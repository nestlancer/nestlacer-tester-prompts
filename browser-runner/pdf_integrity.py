#!/usr/bin/env python3
import sys, json, re, math
from pathlib import Path
import fitz

TOKEN_RE = re.compile(r'(t=)[A-Za-z0-9._~-]+')
SIG_RE = re.compile(r'(X-Amz-(?:Credential|Signature|Security-Token|Date|Expires|SignedHeaders|Algorithm)=[^\s&]+)')

def redact(s):
    if not s:
        return s
    s = TOKEN_RE.sub(r'\1<redacted>', s)
    s = re.sub(r'https://s3\.nestlancer\.com/[^\s"<>]+', 'https://s3.nestlancer.com/<signed-url-redacted>', s)
    s = SIG_RE.sub(lambda m: m.group(1).split('=')[0]+'=<redacted>', s)
    s = re.sub(r'([A-Za-z0-9._%+-]+)@nestlancer\.com', '<demo-email>@nestlancer.com', s)
    return s

def rect_intersection(a,b):
    x0=max(a[0],b[0]); y0=max(a[1],b[1]); x1=min(a[2],b[2]); y1=min(a[3],b[3])
    if x1<=x0 or y1<=y0: return 0
    return (x1-x0)*(y1-y0)

def analyze_pdf(path):
    p=Path(path)
    doc=fitz.open(p)
    out={
        'file': str(p), 'filename': p.name, 'bytes': p.stat().st_size,
        'page_count': doc.page_count, 'pages': [], 'verify_urls': [],
        'professional_integrity': {
            'status': 'PASS', 'issues': [], 'warnings': [], 'checks': []
        }
    }
    all_text=''
    top_texts=[]; bottom_texts=[]
    for i,page in enumerate(doc):
        rect=page.rect
        text=page.get_text() or ''
        all_text += '\n' + text
        blocks=[]
        overflow=[]
        text_blocks=[]
        for b in page.get_text('blocks'):
            x0,y0,x1,y1,txt,*rest=b
            txt=(txt or '').strip()
            if not txt: continue
            item={'bbox':[round(x0,2),round(y0,2),round(x1,2),round(y1,2)],'text_sample':redact(txt[:120])}
            text_blocks.append((x0,y0,x1,y1,txt))
            if x0 < -1 or y0 < -1 or x1 > rect.width+1 or y1 > rect.height+1:
                overflow.append(item)
        overlaps=[]
        for a in range(len(text_blocks)):
            for b in range(a+1,len(text_blocks)):
                A=text_blocks[a]; B=text_blocks[b]
                area=rect_intersection(A[:4],B[:4])
                if area > 6:  # small tolerance
                    min_area=min((A[2]-A[0])*(A[3]-A[1]), (B[2]-B[0])*(B[3]-B[1]))
                    if min_area and area/min_area > 0.10:
                        overlaps.append({'a':redact(A[4][:80]),'b':redact(B[4][:80]),'area':round(area,2)})
                        if len(overlaps)>=10: break
            if len(overlaps)>=10: break
        # top/bottom text regions
        top=[]; bottom=[]
        for x0,y0,x1,y1,txt in text_blocks:
            if y0 < rect.height*0.12: top.append(txt.replace('\n',' ')[:120])
            if y1 > rect.height*0.88: bottom.append(txt.replace('\n',' ')[:120])
        top_text=' | '.join(top)
        bottom_text=' | '.join(bottom)
        top_texts.append(top_text); bottom_texts.append(bottom_text)
        links=page.get_links()
        urls=[]
        for l in links:
            if l.get('uri'): urls.append(redact(l['uri']))
        # text URL extraction
        for m in re.finditer(r'https?://[^\s]+', text):
            u=m.group(0).rstrip('.,;)')
            urls.append(redact(u))
        out['pages'].append({
            'page': i+1, 'width': round(rect.width,2), 'height': round(rect.height,2),
            'chars': len(text), 'top_region': redact(top_text), 'bottom_region': redact(bottom_text),
            'has_page_number': bool(re.search(r'Page\s+%d\s+of\s+%d' % (i+1, doc.page_count), text)),
            'overflow_blocks': overflow[:10], 'overlap_samples': overlaps[:10], 'links_or_urls': list(dict.fromkeys(urls))[:10],
            'text_sample': redact(text[:1200])
        })
    # collect verify URLs redacted and raw separately? only redacted in JSON
    verify_urls=[]
    for m in re.finditer(r'https://app\.nestlancer\.com/verify-document\?[^\s]+', all_text):
        verify_urls.append(m.group(0).rstrip('.,;)'))
    out['verify_urls'] = [redact(u) for u in dict.fromkeys(verify_urls)]
    integ=out['professional_integrity']
    # Hard checks
    if p.stat().st_size == 0:
        integ['status']='FAIL'; integ['issues'].append('0-byte PDF download')
    if doc.page_count == 0:
        integ['status']='FAIL'; integ['issues'].append('PDF has zero pages')
    # page number check
    missing_page_nums=[pg['page'] for pg in out['pages'] if not pg['has_page_number']]
    if missing_page_nums:
        integ['warnings'].append('Page numbering not detected on pages: '+', '.join(map(str,missing_page_nums)))
    else:
        integ['checks'].append('Page numbering detected on every page')
    # Header/footer continuity heuristic
    if doc.page_count > 1:
        doc_title_words=['INVOICE','RECEIPT','Nestlancer','GSTIN']
        missing_cont_headers=[]
        for idx,txt in enumerate(top_texts[1:], start=2):
            if not any(w.lower() in txt.lower() for w in doc_title_words):
                missing_cont_headers.append(idx)
        if missing_cont_headers:
            integ['warnings'].append('Continuation pages do not repeat a recognizable document header/brand/title: pages '+', '.join(map(str,missing_cont_headers)))
        else:
            integ['checks'].append('Recognizable document header/brand/title appears on continuation pages')
        # footer presence any bottom text
        missing_footer=[i+1 for i,t in enumerate(bottom_texts) if not t.strip()]
        if missing_footer:
            integ['warnings'].append('Footer/bottom-region text missing on pages: '+', '.join(map(str,missing_footer)))
        else:
            integ['checks'].append('Bottom-region footer/page text detected on every page')
    # overflow/overlap
    ov_pages=[pg['page'] for pg in out['pages'] if pg['overflow_blocks']]
    if ov_pages:
        integ['status']='FAIL'; integ['issues'].append('Text blocks overflow page bounds on pages: '+', '.join(map(str,ov_pages)))
    overlap_pages=[pg['page'] for pg in out['pages'] if pg['overlap_samples']]
    if overlap_pages:
        integ['warnings'].append('Potential overlapping text blocks detected on pages: '+', '.join(map(str,overlap_pages)))
    else:
        integ['checks'].append('No significant text-block overlap detected by bbox heuristic')
    # Known visible textual integrity warnings
    if 'For queries: billing@nestlancer.com For queries: billing@nestlancer.com' in all_text:
        integ['warnings'].append('Duplicate footer/query text detected: "For queries" appears twice consecutively')
    if 'GSTIN 29AABCT1332L1ZV · GSTIN 29AABCT1332L1ZV' in all_text:
        integ['warnings'].append('Duplicate GSTIN text detected in footer')
    if re.search(r'NL-RCPT-\d{4}-\d{6}NL-INV-\d{4}-\d{6}', all_text):
        integ['warnings'].append('Receipt/invoice numbers appear concatenated without separator in transaction history')
    if 'Verify:' not in all_text:
        integ['warnings'].append('No Verify URL/text detected in PDF text')
    else:
        integ['checks'].append('Verify URL/text detected in PDF')
    # Set status WARN if warnings only
    if integ['status']=='PASS' and integ['warnings']:
        integ['status']='WARN'
    return out

if __name__=='__main__':
    results=[analyze_pdf(arg) for arg in sys.argv[1:]]
    print(json.dumps(results, indent=2, ensure_ascii=False))
