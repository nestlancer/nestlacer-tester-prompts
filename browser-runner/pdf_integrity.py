#!/usr/bin/env python3
"""
Professional integrity analyzer for Nestlancer generated PDFs
(quotes, invoices, receipts, contracts, exports).

Focus: visual/layout defects that ship to client and admin downloads —
especially overlapping text in dense sections (Payment History on invoices,
line-item tables, payment schedules, footers).
"""
import sys
import json
import re
from pathlib import Path
import fitz

TOKEN_RE = re.compile(r'(t=)[A-Za-z0-9._~-]+')
SIG_RE = re.compile(r'(X-Amz-(?:Credential|Signature|Security-Token|Date|Expires|SignedHeaders|Algorithm)=[^\s&]+)')

# Dense table / history sections where overlap is a known production defect class.
SECTION_PATTERNS = [
    (re.compile(r'payment\s+histor', re.I), 'payment_history'),
    (re.compile(r'transaction\s+histor', re.I), 'transaction_history'),
    (re.compile(r'payment\s+schedule', re.I), 'payment_schedule'),
    (re.compile(r'line\s+items?', re.I), 'line_items'),
    (re.compile(r'item\s+description|description\s+of\s+(?:goods|services)', re.I), 'line_items'),
    (re.compile(r'billing\s+summar', re.I), 'billing_summary'),
    (re.compile(r'tax\s+(?:breakup|breakdown|summary)', re.I), 'tax_summary'),
    (re.compile(r'amount\s+in\s+words', re.I), 'amount_in_words'),
]

DOC_TYPE_HINTS = [
    (re.compile(r'\bINVOICE\b'), 'invoice'),
    (re.compile(r'\bRECEIPT\b'), 'receipt'),
    (re.compile(r'\bQUOTE\b|\bPROPOSAL\b|\bESTIMATE\b'), 'quote'),
    (re.compile(r'\bAGREEMENT\b|\bCONTRACT\b'), 'contract'),
]


def redact(s):
    if not s:
        return s
    s = TOKEN_RE.sub(r'\1<redacted>', s)
    s = re.sub(r'https://s3\.nestlancer\.com/[^\s"<>]+', 'https://s3.nestlancer.com/<signed-url-redacted>', s)
    s = SIG_RE.sub(lambda m: m.group(1).split('=')[0] + '=<redacted>', s)
    s = re.sub(r'([A-Za-z0-9._%+-]+)@nestlancer\.com', '<demo-email>@nestlancer.com', s)
    return s


def rect_intersection(a, b):
    x0 = max(a[0], b[0])
    y0 = max(a[1], b[1])
    x1 = min(a[2], b[2])
    y1 = min(a[3], b[3])
    if x1 <= x0 or y1 <= y0:
        return 0.0
    return (x1 - x0) * (y1 - y0)


def rect_area(r):
    return max(0.0, (r[2] - r[0]) * (r[3] - r[1]))


def classify_doc(text):
    for pat, kind in DOC_TYPE_HINTS:
        if pat.search(text):
            return kind
    return 'unknown'


def find_sections(text_blocks, page_height):
    """Map section labels to approximate Y bands using heading text positions."""
    sections = []
    for x0, y0, x1, y1, txt in text_blocks:
        flat = ' '.join((txt or '').split())
        for pat, name in SECTION_PATTERNS:
            if pat.search(flat):
                sections.append({'name': name, 'y0': y0, 'heading': redact(flat[:100])})
                break
    sections.sort(key=lambda s: s['y0'])
    for i, sec in enumerate(sections):
        next_y = sections[i + 1]['y0'] if i + 1 < len(sections) else page_height * 0.92
        sec['y1'] = max(sec['y0'] + 24, next_y)
    return sections


def section_for_y(sections, y_mid):
    for sec in sections:
        if sec['y0'] - 2 <= y_mid <= sec['y1'] + 2:
            return sec['name']
    return None


def collect_spans(page):
    """Span-level boxes — catches glyph stacking that block bbox heuristics miss."""
    spans = []
    d = page.get_text('dict') or {}
    for block in d.get('blocks', []):
        if block.get('type', 0) != 0:
            continue
        for line in block.get('lines', []):
            for sp in line.get('spans', []):
                txt = (sp.get('text') or '').strip()
                if not txt:
                    continue
                bbox = sp.get('bbox')
                if not bbox or len(bbox) < 4:
                    continue
                x0, y0, x1, y1 = bbox
                if (x1 - x0) < 1 or (y1 - y0) < 1:
                    continue
                spans.append((x0, y0, x1, y1, txt))
    return spans


def find_overlaps(boxes, sections, min_area=4.0, min_ratio=0.12, max_samples=20):
    """
    Return overlap samples with severity:
      FAIL — dense content sections, near-identical stacking, high coverage
      WARN — decorative/header collisions with small coverage
    """
    samples = []
    fail_count = 0
    warn_count = 0
    n = len(boxes)
    for a in range(n):
        A = boxes[a]
        for b in range(a + 1, n):
            B = boxes[b]
            area = rect_intersection(A[:4], B[:4])
            if area <= min_area:
                continue
            area_a = rect_area(A[:4])
            area_b = rect_area(B[:4])
            min_a = min(area_a, area_b) or 1.0
            ratio = area / min_a
            if ratio < min_ratio:
                continue
            # Near-identical position = stacked duplicate draw (classic payment-history bug)
            same_origin = (
                abs(A[0] - B[0]) < 1.5
                and abs(A[1] - B[1]) < 1.5
                and abs(A[2] - B[2]) < 3.0
                and abs(A[3] - B[3]) < 3.0
            )
            y_mid = (min(A[1], B[1]) + max(A[3], B[3])) / 2.0
            sec = section_for_y(sections, y_mid) or section_for_y(sections, A[1]) or section_for_y(sections, B[1])
            dense = sec in {
                'payment_history', 'transaction_history', 'payment_schedule',
                'line_items', 'billing_summary', 'tax_summary',
            }
            severity = 'FAIL' if (same_origin or dense or ratio > 0.35) else 'WARN'
            if severity == 'FAIL':
                fail_count += 1
            else:
                warn_count += 1
            if len(samples) < max_samples:
                samples.append({
                    'severity': severity,
                    'section': sec or 'general',
                    'ratio': round(ratio, 3),
                    'area': round(area, 2),
                    'stacked_same_origin': same_origin,
                    'a': redact(A[4][:80]),
                    'b': redact(B[4][:80]),
                })
            if len(samples) >= max_samples and fail_count > 0:
                break
        if len(samples) >= max_samples and fail_count > 0:
            break
    return samples, fail_count, warn_count


def find_row_collisions(boxes, sections, y_tol=3.0):
    """Detect distinct text rows that share nearly the same baseline (overprinted rows)."""
    hits = []
    # Only inspect dense sections
    dense_boxes = []
    for box in boxes:
        sec = section_for_y(sections, (box[1] + box[3]) / 2.0)
        if sec in {'payment_history', 'transaction_history', 'payment_schedule', 'line_items'}:
            dense_boxes.append((sec, box))
    for i in range(len(dense_boxes)):
        sec_a, A = dense_boxes[i]
        for j in range(i + 1, len(dense_boxes)):
            sec_b, B = dense_boxes[j]
            if sec_a != sec_b:
                continue
            # Different content, nearly same vertical band, horizontal overlap
            if abs(A[1] - B[1]) > y_tol:
                continue
            if A[4].strip() == B[4].strip():
                continue
            if rect_intersection(A[:4], B[:4]) <= 2:
                # Still flag if baselines collide and x-ranges overlap partially
                if not (A[0] < B[2] and B[0] < A[2]):
                    continue
            hits.append({
                'section': sec_a,
                'a': redact(A[4][:80]),
                'b': redact(B[4][:80]),
                'y_delta': round(abs(A[1] - B[1]), 2),
            })
            if len(hits) >= 8:
                return hits
    return hits


def analyze_pdf(path):
    p = Path(path)
    doc = fitz.open(p)
    out = {
        'file': str(p),
        'filename': p.name,
        'bytes': p.stat().st_size,
        'page_count': doc.page_count,
        'doc_type': 'unknown',
        'pages': [],
        'verify_urls': [],
        'sections_detected': [],
        'professional_integrity': {
            'status': 'PASS',
            'issues': [],
            'warnings': [],
            'checks': [],
        },
    }
    all_text = ''
    top_texts = []
    bottom_texts = []
    all_sections = set()
    total_fail_overlaps = 0
    total_warn_overlaps = 0
    row_collision_pages = []

    for i, page in enumerate(doc):
        rect = page.rect
        text = page.get_text() or ''
        all_text += '\n' + text
        overflow = []
        text_blocks = []
        for b in page.get_text('blocks'):
            x0, y0, x1, y1, txt, *rest = b
            txt = (txt or '').strip()
            if not txt:
                continue
            item = {
                'bbox': [round(x0, 2), round(y0, 2), round(x1, 2), round(y1, 2)],
                'text_sample': redact(txt[:120]),
            }
            text_blocks.append((x0, y0, x1, y1, txt))
            if x0 < -1 or y0 < -1 or x1 > rect.width + 1 or y1 > rect.height + 1:
                overflow.append(item)

        sections = find_sections(text_blocks, rect.height)
        for s in sections:
            all_sections.add(s['name'])

        block_overlaps, bf, bw = find_overlaps(text_blocks, sections, min_area=6.0, min_ratio=0.10)
        spans = collect_spans(page)
        span_overlaps, sf, sw = find_overlaps(spans, sections, min_area=3.0, min_ratio=0.18, max_samples=12)
        # Prefer richer samples; merge unique
        overlaps = block_overlaps[:]
        seen = {(o['a'], o['b'], o.get('section')) for o in overlaps}
        for o in span_overlaps:
            key = (o['a'], o['b'], o.get('section'))
            if key not in seen:
                overlaps.append(o)
                seen.add(key)
        fail_n = bf + sf
        warn_n = bw + sw
        total_fail_overlaps += fail_n
        total_warn_overlaps += warn_n

        row_hits = find_row_collisions(text_blocks, sections)
        if row_hits:
            row_collision_pages.append({'page': i + 1, 'samples': row_hits})

        top = []
        bottom = []
        for x0, y0, x1, y1, txt in text_blocks:
            if y0 < rect.height * 0.12:
                top.append(txt.replace('\n', ' ')[:120])
            if y1 > rect.height * 0.88:
                bottom.append(txt.replace('\n', ' ')[:120])
        top_text = ' | '.join(top)
        bottom_text = ' | '.join(bottom)
        top_texts.append(top_text)
        bottom_texts.append(bottom_text)

        urls = []
        for l in page.get_links():
            if l.get('uri'):
                urls.append(redact(l['uri']))
        for m in re.finditer(r'https?://[^\s]+', text):
            urls.append(redact(m.group(0).rstrip('.,;)')))

        out['pages'].append({
            'page': i + 1,
            'width': round(rect.width, 2),
            'height': round(rect.height, 2),
            'chars': len(text),
            'sections': sections,
            'top_region': redact(top_text),
            'bottom_region': redact(bottom_text),
            'has_page_number': bool(re.search(r'Page\s+%d\s+of\s+%d' % (i + 1, doc.page_count), text)),
            'overflow_blocks': overflow[:10],
            'overlap_samples': overlaps[:15],
            'overlap_fail_count': fail_n,
            'overlap_warn_count': warn_n,
            'row_collision_samples': row_hits[:8],
            'links_or_urls': list(dict.fromkeys(urls))[:10],
            'text_sample': redact(text[:1200]),
        })

    out['doc_type'] = classify_doc(all_text)
    out['sections_detected'] = sorted(all_sections)

    verify_urls = []
    for m in re.finditer(r'https://app\.nestlancer\.com/verify-document\?[^\s]+', all_text):
        verify_urls.append(m.group(0).rstrip('.,;)'))
    out['verify_urls'] = [redact(u) for u in dict.fromkeys(verify_urls)]

    integ = out['professional_integrity']

    if p.stat().st_size == 0:
        integ['status'] = 'FAIL'
        integ['issues'].append('0-byte PDF download')
    if doc.page_count == 0:
        integ['status'] = 'FAIL'
        integ['issues'].append('PDF has zero pages')

    missing_page_nums = [pg['page'] for pg in out['pages'] if not pg['has_page_number']]
    if missing_page_nums:
        integ['warnings'].append('Page numbering not detected on pages: ' + ', '.join(map(str, missing_page_nums)))
    else:
        integ['checks'].append('Page numbering detected on every page')

    if doc.page_count > 1:
        doc_title_words = ['INVOICE', 'RECEIPT', 'Nestlancer', 'GSTIN', 'QUOTE', 'AGREEMENT']
        missing_cont_headers = []
        for idx, txt in enumerate(top_texts[1:], start=2):
            if not any(w.lower() in txt.lower() for w in doc_title_words):
                missing_cont_headers.append(idx)
        if missing_cont_headers:
            integ['warnings'].append(
                'Continuation pages do not repeat a recognizable document header/brand/title: pages '
                + ', '.join(map(str, missing_cont_headers))
            )
        else:
            integ['checks'].append('Recognizable document header/brand/title appears on continuation pages')
        missing_footer = [i + 1 for i, t in enumerate(bottom_texts) if not t.strip()]
        if missing_footer:
            integ['warnings'].append('Footer/bottom-region text missing on pages: ' + ', '.join(map(str, missing_footer)))
        else:
            integ['checks'].append('Bottom-region footer/page text detected on every page')

    ov_pages = [pg['page'] for pg in out['pages'] if pg['overflow_blocks']]
    if ov_pages:
        integ['status'] = 'FAIL'
        integ['issues'].append('Text blocks overflow page bounds on pages: ' + ', '.join(map(str, ov_pages)))

    # Overlap: FAIL for dense-section / stacked overlaps (payment history class)
    fail_pages = [pg['page'] for pg in out['pages'] if pg.get('overlap_fail_count', 0) > 0]
    warn_pages = [pg['page'] for pg in out['pages'] if pg.get('overlap_warn_count', 0) > 0 and pg['page'] not in fail_pages]
    if fail_pages:
        integ['status'] = 'FAIL'
        section_hint = ', '.join(sorted(all_sections)) or 'general content'
        integ['issues'].append(
            'Overlapping / stacked text in generated PDF on pages %s (sections seen: %s). '
            'Known class: payment history / table rows printing on top of each other or on footers; '
            'review invoice, receipt, quote and contract PDFs from both client and admin downloads.'
            % (', '.join(map(str, fail_pages)), section_hint)
        )
        # Attach a few samples for triage
        samples = []
        for pg in out['pages']:
            for o in pg.get('overlap_samples') or []:
                if o.get('severity') == 'FAIL':
                    samples.append('p%s/%s: "%s" vs "%s"' % (pg['page'], o.get('section'), o['a'][:40], o['b'][:40]))
                if len(samples) >= 5:
                    break
            if len(samples) >= 5:
                break
        if samples:
            integ['issues'].append('Overlap samples: ' + ' | '.join(samples))
    elif warn_pages:
        integ['warnings'].append(
            'Potential overlapping text blocks detected on pages: ' + ', '.join(map(str, warn_pages))
        )
    else:
        integ['checks'].append('No significant text-block overlap detected by bbox/span heuristic')

    if row_collision_pages:
        integ['status'] = 'FAIL'
        pages = [str(r['page']) for r in row_collision_pages]
        integ['issues'].append(
            'Dense-section row collisions (overprinted table/history rows) on pages: ' + ', '.join(pages)
        )

    # Known textual integrity defects
    if 'For queries: billing@nestlancer.com For queries: billing@nestlancer.com' in all_text:
        integ['warnings'].append('Duplicate footer/query text detected: "For queries" appears twice consecutively')
    if 'GSTIN 29AABCT1332L1ZV · GSTIN 29AABCT1332L1ZV' in all_text:
        integ['warnings'].append('Duplicate GSTIN text detected in footer')
    if re.search(r'NL-RCPT-\d{4}-\d{6}NL-INV-\d{4}-\d{6}', all_text):
        integ['status'] = 'FAIL'
        integ['issues'].append(
            'Receipt/invoice numbers appear concatenated without separator in transaction/payment history'
        )
    if re.search(r'NL-INV-\d{4}-\d{6}NL-(?:INV|RCPT)-', all_text):
        integ['status'] = 'FAIL'
        integ['issues'].append('Document numbers concatenated in history/table cells (missing cell separator/spacing)')

    # Invoice-specific: payment history should exist and be readable when payments exist
    if out['doc_type'] == 'invoice':
        if 'payment_history' in all_sections or 'transaction_history' in all_sections:
            integ['checks'].append('Invoice includes a payment/transaction history section')
        # Amounts smashed together like ₹750.00₹750.00
        if re.search(r'₹\s*[\d,]+\.\d{2}\s*₹\s*[\d,]+\.\d{2}', all_text) or re.search(
            r'₹[\d,]+\.\d{2}₹[\d,]+\.\d{2}', all_text
        ):
            integ['status'] = 'FAIL'
            integ['issues'].append(
                'Currency amounts appear concatenated (likely overlapping payment-history/total cells)'
            )

    if 'Verify:' not in all_text and out['doc_type'] in {'invoice', 'receipt', 'quote'}:
        integ['warnings'].append('No Verify URL/text detected in PDF text')
    elif 'Verify:' in all_text:
        integ['checks'].append('Verify URL/text detected in PDF')

    if integ['status'] == 'PASS' and integ['warnings']:
        integ['status'] = 'WARN'

    out['overlap_summary'] = {
        'fail_overlaps': total_fail_overlaps,
        'warn_overlaps': total_warn_overlaps,
        'fail_pages': fail_pages,
        'warn_pages': warn_pages,
        'row_collision_pages': [r['page'] for r in row_collision_pages],
    }
    return out


if __name__ == '__main__':
    results = [analyze_pdf(arg) for arg in sys.argv[1:]]
    print(json.dumps(results, indent=2, ensure_ascii=False))
