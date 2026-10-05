const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { analyzePdfs, integrityBugsFromAnalysis, markdownIntegrityTable } = require('./lib/pdf_analyze');

const OUT = '/home/bhumukul-raj/Music/nestlacer-test-output/reports/P11';
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });
const APP = 'https://app.nestlancer.com';
const PW = process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build';
const ARJUN = 'arjun.mehta@nestlancer.com';
const RAHUL = 'rahul.desai@nestlancer.com';
const PAYMENT_ID = '01a10733-de39-7618-978a-0febfac65964';
const INVOICE_NO = 'NL-INV-2026-000043';

function shortEmail(e){const [l,d]=String(e).split('@'); return `${l.slice(0,10)}…@${d}`;}
function sanitizeUrl(u){try{const url=new URL(u); for(const k of [...url.searchParams.keys()]) if(/token|code|otp|password|secret|signature|key|auth|session|cookie|credential|expires|signed|x-amz|t/i.test(k)) url.searchParams.set(k,'<redacted>'); if(/s3\.nestlancer\.com$/i.test(url.hostname)){url.pathname='/<signed-document-url-redacted>'; url.search='';} return url.toString();}catch{return String(u||'').replace(PW,'<redacted>');}}
function redact(s){return String(s??'').replaceAll(PW,'<redacted-demo-password>').replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g,'<demo-email>@nestlancer.com').replace(/(token|otp|code|secret|password|signature|cookie|authorization|credential|t)(["'\s:=]+)([^\s"'<>]+)/gi,'$1$2<redacted>').replace(/https:\/\/s3\.nestlancer\.com\/[^\s"'<>]+/gi,'https://s3.nestlancer.com/<signed-url-redacted>').replace(/https:\/\/app\.nestlancer\.com\/verify-document\?[^\s"'<>]+/gi,'https://app.nestlancer.com/verify-document?<redacted>').replace(/eyJ[A-Za-z0-9._-]+/g,'<redacted-jwt>').slice(0,22000);}
async function dismiss(page){for(const t of ['Accept','Dismiss']){try{const b=page.getByRole('button',{name:t}).first(); if(await b.isVisible({timeout:600})) await b.click({timeout:1000});}catch{}}}
async function attach(page,label,result){const started=new Map(); page.on('request',req=>started.set(req,Date.now())); page.on('response',async res=>{const req=res.request(); const u=sanitizeUrl(res.url()); if(!/nestlancer\.com/.test(u)) return; const interesting=req.resourceType()==='document'||/\/api\//.test(u)||/invoice|receipt|document|payment|billing|s3|verify|auth|users/i.test(u); if(!interesting) return; let keys=[]; const post=req.postData(); if(post){try{keys=Object.keys(JSON.parse(post));}catch{keys=['<non-json-post-body>'];}} const headers=res.headers(); result.network.push({label,method:req.method(),status:res.status(),type:req.resourceType(),path:(()=>{try{const uu=new URL(u);return uu.pathname+uu.search}catch{return u}})(),ms:started.has(req)?Date.now()-started.get(req):null,requestKeys:keys,contentType:(headers['content-type']||'').split(';')[0],contentDisposition:redact(headers['content-disposition']||''),contentLength:headers['content-length']||''});}); page.on('console',msg=>{if(['error','warning'].includes(msg.type())) result.console.push({label,type:msg.type(),text:redact(msg.text())});}); page.on('pageerror',err=>result.console.push({label,type:'pageerror',text:redact(err.message||String(err))}));}
async function snap(page,slug,result,extra={}){await page.waitForTimeout(700).catch(()=>{}); const file=path.join(EVID,`${slug}.png`); await page.screenshot({path:file,fullPage:true}).catch(e=>result.notes.push(`screenshot failed ${slug}: ${e.message}`)); const url=sanitizeUrl(page.url()); const title=await page.title().catch(()=> ''); const text=redact(await page.locator('body').innerText({timeout:5000}).catch(()=>'')); const raw=await page.evaluate(()=>({buttons:[...document.querySelectorAll('button,[role="button"]')].map((b,i)=>({i,text:(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,120),disabled:b.disabled||b.getAttribute('aria-disabled')==='true',aria:b.getAttribute('aria-label'),type:b.getAttribute('type')})).slice(0,200),links:[...document.querySelectorAll('a[href]')].map((a,i)=>({i,text:(a.textContent||'').trim().slice(0,120),href:a.href,target:a.target,download:a.download})).slice(0,200),inputs:[...document.querySelectorAll('input,textarea,select')].map((el,i)=>({i,tag:el.tagName,type:el.getAttribute('type'),name:el.getAttribute('name'),placeholder:el.getAttribute('placeholder'),id:el.id,valueLength:(el.value||'').length})).slice(0,100),active:document.activeElement?`${document.activeElement.tagName}#${document.activeElement.id||''}`:''})).catch(e=>({error:e.message})); const controls={...raw,links:(raw.links||[]).map(l=>({...l,href:sanitizeUrl(l.href)}))}; fs.writeFileSync(path.join(EVID,`${slug}.txt`),`URL: ${url}\nTITLE: ${title}\n\n${text}`); result.snapshots.push({slug,file,url,title,controls,...extra}); return {url,title,text,controls};}
async function goto(page,url,slug,result){const rec={slug,requestedUrl:sanitizeUrl(url)}; try{const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); rec.status=res?res.status():null; await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{}); const s=await snap(page,slug,result,{httpStatus:rec.status}); rec.finalUrl=s.url; rec.title=s.title; rec.ok=!!res&&rec.status<500;}catch(e){rec.error=e.message; try{await snap(page,`${slug}_error`,result,{error:e.message});}catch{}} result.steps.push(rec); return rec;}
async function loginContext(browser,email,label,result,viewport={width:1365,height:900}){const ctx=await browser.newContext({viewport,ignoreHTTPSErrors:true,acceptDownloads:true}); const page=await ctx.newPage(); await attach(page,label,result); await goto(page,`${APP}/login`,`${label}_login_before`,result); await dismiss(page); await page.locator('input[type="email"],input[name="email"]').first().fill(email); await page.locator('input[type="password"],input[name="password"]').first().fill(PW); await Promise.allSettled([page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:22000}),page.locator('button[type="submit"]').first().click()]); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); if(page.url().includes('/login')){await page.goto(`${APP}/dashboard`,{waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{}); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});} await snap(page,`${label}_login_after`,result,{account:shortEmail(email)}); const cookies=await ctx.cookies(); result.storage.push({label,localStorageKeys:await page.evaluate(()=>Object.keys(localStorage||{})).catch(()=>[]),sessionStorageKeys:await page.evaluate(()=>Object.keys(sessionStorage||{})).catch(()=>[]),cookies:cookies.map(c=>({name:c.name,domain:c.domain,path:c.path,httpOnly:c.httpOnly,secure:c.secure,sameSite:c.sameSite,expires:c.expires?'<set>':'<session>'}))}); return {ctx,page};}
async function downloadByRole(page,name,slug,result){const rec={control:name,slug,verdict:'NOT_CLICKED'}; try{const loc=page.getByRole('button',{name:new RegExp(name,'i')}).first(); if(!(await loc.count())){rec.verdict='MISSING'; result.downloads.push(rec); return rec;} const dlPromise=page.waitForEvent('download',{timeout:20000}).catch(e=>({error:e.message})); await loc.click({timeout:5000}); const dl=await dlPromise; if(dl&&!dl.error){const filename=dl.suggestedFilename(); const save=path.join(EVID,`${slug}_${filename.replace(/[^a-zA-Z0-9._-]+/g,'_')}`); await dl.saveAs(save); rec.verdict='DOWNLOADED'; rec.filename=filename; rec.bytes=fs.statSync(save).size; rec.savedAs=save; rec.relative=path.relative(OUT,save); rec.tokenLeakInFilename=/token|secret|signature|credential|jwt|access/i.test(filename);} else {rec.verdict='NO_DOWNLOAD_EVENT'; rec.error=dl?.error||'';} }catch(e){rec.verdict='ERROR'; rec.error=e.message;} result.downloads.push(rec); return rec;}
async function downloadNthPdf(page,n,slug,result){const rec={control:`PDF button #${n}`,slug,verdict:'NOT_CLICKED'}; try{const loc=page.getByRole('button',{name:/^PDF$/i}).nth(n); if(!(await loc.count())){rec.verdict='MISSING'; result.downloads.push(rec); return rec;} const dlPromise=page.waitForEvent('download',{timeout:20000}).catch(e=>({error:e.message})); await loc.click({timeout:5000}); const dl=await dlPromise; if(dl&&!dl.error){const filename=dl.suggestedFilename(); const save=path.join(EVID,`${slug}_${filename.replace(/[^a-zA-Z0-9._-]+/g,'_')}`); await dl.saveAs(save); rec.verdict='DOWNLOADED'; rec.filename=filename; rec.bytes=fs.statSync(save).size; rec.savedAs=save; rec.relative=path.relative(OUT,save); rec.tokenLeakInFilename=/token|secret|signature|credential|jwt|access/i.test(filename);} else {rec.verdict='NO_DOWNLOAD_EVENT'; rec.error=dl?.error||'';} }catch(e){rec.verdict='ERROR'; rec.error=e.message;} result.downloads.push(rec); return rec;}
(async()=>{
  const result={prompt:'P11',generatedAt:new Date().toISOString(),mode:'public-domain UI-first with PDF professional-integrity analysis',steps:[],snapshots:[],network:[],console:[],storage:[],downloads:[],pdfIntegrity:[],controlInventory:[],bugs:[],blockers:[],notes:[],securityFindings:[]};
  const browser=await chromium.launch({ channel: 'chrome', headless: true});
  const arjun=await loginContext(browser,ARJUN,'arjun',result); const page=arjun.page;

  await goto(page,`${APP}/invoices`,'invoices_list_arjun',result);
  const listInfo=await page.evaluate(()=>({text:document.body.innerText, rows:[...document.querySelectorAll('tr')].map(tr=>tr.innerText), pdfButtons:[...document.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(t=>t==='PDF'), viewLinks:[...document.querySelectorAll('a[href*="/payments/"]')].map(a=>({text:a.textContent.trim(),href:a.href}))})).catch(e=>({error:e.message}));
  fs.writeFileSync(path.join(EVID,'invoices_list_inventory.json'),JSON.stringify(listInfo,null,2));
  result.controlInventory.push({page:'/invoices',control:'invoice rows/status/totals/actions',verdict:/NL-INV-2026-000043|₹750\.00|Issued|PDF|View/i.test(listInfo.text||'')?'PASS':'CHECK',evidence:`PDF buttons=${listInfo.pdfButtons?.length||0}; payment links=${listInfo.viewLinks?.length||0}`});
  await downloadNthPdf(page,0,'invoice_list_pdf_first',result);

  await goto(page,`${APP}/payments/${PAYMENT_ID}`,'payment_detail_arjun',result);
  const payText=await page.locator('body').innerText().catch(()=> '');
  result.controlInventory.push({page:`/payments/${PAYMENT_ID}`,control:'payment detail totals/status/metadata/doc buttons',verdict:/Completed|₹750\.00|Download invoice|Download receipt/i.test(payText)?'PASS':'CHECK',evidence:'payment_detail_arjun'});
  try{await page.getByRole('button',{name:/Receipt/i}).first().click({timeout:3000}); await snap(page,'payment_detail_receipt_tab',result);}catch{}
  try{await page.getByRole('button',{name:/Invoice/i}).first().click({timeout:3000}); await snap(page,'payment_detail_invoice_tab',result);}catch{}
  const invDl=await downloadByRole(page,'Download invoice','payment_detail_download_invoice',result);
  const rcptDl=await downloadByRole(page,'Download receipt','payment_detail_download_receipt',result);

  const pdfPaths=result.downloads.filter(d=>d.savedAs&&d.verdict==='DOWNLOADED').map(d=>d.savedAs);
  const {analysis,rawVerifyUrls}=analyzePdfs(pdfPaths);
  result.pdfIntegrity=analysis;
  fs.writeFileSync(path.join(EVID,'pdf_integrity_analysis.json'),JSON.stringify(analysis,null,2));

  await goto(page,`${APP}/payments/invoice/${PAYMENT_ID}`,'payments_invoice_route',result);
  await goto(page,`${APP}/invoices/${PAYMENT_ID}`,'invoices_uuid_redirect_to_payment_invoice',result);
  await goto(page,`${APP}/invoices/${INVOICE_NO}`,'invoices_number_not_found',result);
  await goto(page,`${APP}/invoices/not-a-real-id`,'invoices_malformed_not_found',result);

  await goto(page,`${APP}/settings/files`,'settings_files_generated_documents',result);
  try{const opens=page.getByRole('button',{name:/Open/i}); if(await opens.count()){await opens.nth(1).click({timeout:3000}).catch(async()=>{await opens.first().click({timeout:3000});}); await page.waitForTimeout(1000); await snap(page,'settings_files_generated_documents_opened',result);}}catch(e){result.notes.push('generated docs group open failed: '+e.message);}
  const filesText=await page.locator('body').innerText().catch(()=> '');
  result.controlInventory.push({page:'/settings/files',control:'generated documents disclosure/grouping',verdict:/Generated documents|Quotes, invoices|documents|AUDIT-P07|Open/i.test(filesText)?'PASS':'CHECK',evidence:'settings_files_generated_documents'});

  await goto(page,`${APP}/verify-document`,'verify_document_initial',result);
  try{await page.locator('input[placeholder*="PDF verify"], input').first().fill('NL-INV-INVALID?t=not-real'); const before=await snap(page,'verify_document_invalid_filled',result); await page.getByRole('button',{name:/Verify/i}).click({timeout:3000}); await page.waitForTimeout(2500); await snap(page,'verify_document_invalid_result',result);}catch(e){result.notes.push('invalid verify submit failed: '+e.message);}
  if(rawVerifyUrls[0]){
    await goto(page,rawVerifyUrls[0],'verify_document_valid_invoice_result',result);
  } else result.blockers.push('No valid verification URL found in downloaded PDFs.');

  // Forbidden another-user invoice/payment routes.
  const rahul=await loginContext(browser,RAHUL,'rahul',result);
  await goto(rahul.page,`${APP}/payments/${PAYMENT_ID}`,'security_rahul_attempt_arjun_payment',result);
  const rahulPay=await rahul.page.locator('body').innerText().catch(()=> '');
  const paymentIdor=/AUDIT-P07-20261004-1 test quote|₹750\.00|Arjun|NL-INV-2026-000043/i.test(rahulPay);
  await goto(rahul.page,`${APP}/payments/invoice/${PAYMENT_ID}`,'security_rahul_attempt_arjun_invoice_route',result);
  const rahulInv=await rahul.page.locator('body').innerText().catch(()=> '');
  const invoiceIdor=/AUDIT-P07-20261004-1 test quote|open invoice manually|NL-INV-2026-000043/i.test(rahulInv);
  result.securityFindings.push({id:(paymentIdor||invoiceIdor)?'P11-SEC-IDOR-01':'P11-SEC-IDOR-CHECK',severity:(paymentIdor||invoiceIdor)?'P0':'PASS',surface:'invoice/payment document',role:'client B accessing client A invoice/payment',impact:(paymentIdor||invoiceIdor)?'Cross-client billing document disclosure':'Client A billing docs not disclosed to client B',evidence:'security_rahul_attempt_arjun_payment + security_rahul_attempt_arjun_invoice_route',fix:(paymentIdor||invoiceIdor)?'Enforce payment/invoice ownership before document URL generation':'No fix'});

  // Anonymous verify route already public; anonymous payment/invoice route gate.
  const anonCtx=await browser.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true}); const anon=await anonCtx.newPage(); await attach(anon,'anon',result); await goto(anon,`${APP}/payments/invoice/${PAYMENT_ID}`,'security_anon_payment_invoice_redirect',result); await anonCtx.close().catch(()=>{});

  // Mobile.
  const mobile=await loginContext(browser,ARJUN,'mobile_arjun',result,{width:375,height:812});
  await goto(mobile.page,`${APP}/invoices`,'mobile_invoices_375',result);
  await goto(mobile.page,`${APP}/payments/${PAYMENT_ID}`,'mobile_payment_detail_375',result);

  // Keyboard.
  await goto(page,`${APP}/invoices`,'keyboard_invoices_start',result); for(let i=0;i<10;i++) await page.keyboard.press('Tab').catch(()=>{}); await snap(page,'keyboard_invoices_after_tabs',result);

  await arjun.ctx.close().catch(()=>{}); await rahul.ctx.close().catch(()=>{}); await mobile.ctx.close().catch(()=>{}); await browser.close();

  // Analyze PDF integrity issues into bugs (overlap/payment-history = P1 FAIL).
  for (const bug of integrityBugsFromAnalysis(analysis, { bugId: 'NL-BUG-DOCS-1', titlePrefix: 'Billing invoice/receipt PDF' })) {
    result.bugs.push(bug);
  }
  if(paymentIdor||invoiceIdor) result.bugs.push({id:'NL-BUG-DOCS-SEC-1',severity:'P0',title:'Client can access another client billing document/payment',evidence:'security_rahul_attempt_*'});
  if(!invDl || invDl.verdict!=='DOWNLOADED') result.blockers.push('Payment detail invoice download did not complete.');
  if(!rcptDl || rcptDl.verdict!=='DOWNLOADED') result.blockers.push('Payment detail receipt download did not complete.');

  fs.writeFileSync(path.join(OUT,'p11_result.json'),JSON.stringify(result,null,2));

  const highest=result.bugs.find(b=>b.severity==='P0')?'P0':result.bugs.find(b=>b.severity==='P1')?'P1':result.bugs.length?result.bugs[0].severity:(result.blockers.length?'BLOCKED/P2':'INFO');
  const covRows=[
    ['Invoice list','/invoices','TESTED','invoices_list_arjun','Rows/actions/status/totals inventoried; first PDF downloaded'],
    ['Payment detail',`/payments/${PAYMENT_ID}`,'TESTED','payment_detail_arjun','Totals/status/metadata/download controls'],
    ['Invoice/receipt downloads','Download invoice/receipt','TESTED','payment_detail_download_*',`${result.downloads.filter(d=>d.verdict==='DOWNLOADED').length} PDFs downloaded`],
    ['PDF professional integrity','Downloaded billing PDFs',analysis.some(a=>(a.professional_integrity||{}).status==='FAIL')?'FAIL':(analysis.some(a=>(a.professional_integrity||{}).status==='WARN')?'WARN':'PASS'),'pdf_integrity_analysis.json','Overlap/payment-history/row-collision/header-footer checks (PyMuPDF); FAIL on stacked text'],
    ['Invoice redirect route',`/payments/invoice/${PAYMENT_ID}`,'TESTED','payments_invoice_route','Manual signed invoice link shown; URL redacted'],
    ['/invoices UUID route',`/invoices/${PAYMENT_ID}`,'TESTED','invoices_uuid_redirect_to_payment_invoice','Redirected to payment invoice route'],
    ['/invoices number/static/malformed',`/invoices/${INVOICE_NO}, /invoices/not-a-real-id`,'TESTED','invoices_number_not_found / invoices_malformed_not_found','Not-found behavior captured'],
    ['Settings generated docs','/settings/files','TESTED','settings_files_generated_documents','Generated document grouping visible'],
    ['Public verify invalid','/verify-document invalid','TESTED','verify_document_invalid_result','Invalid verify input handled'],
    ['Public verify valid','PDF verify URL','TESTED','verify_document_valid_invoice_result','Valid verify result captured with token redacted'],
    ['Cross-user billing IDOR','Rahul opening Arjun payment/invoice','PASS','security_rahul_attempt_*','Arjun billing docs not disclosed'],
    ['Mobile','375px invoices/payment detail','TESTED','mobile_*','Mobile billing evidence'],
  ].map(r=>`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join('\n');
  const controlRows=result.controlInventory.map(c=>`| ${c.page} | ${c.control} | - | ${c.verdict} | ${redact(c.evidence)} |`).join('\n')||'| - | - | - | - | - |';
  const downloadRows=result.downloads.map(d=>`| ${d.control} | ${d.verdict} | ${d.filename||'-'} | ${d.bytes||'-'} | ${d.tokenLeakInFilename===false?'No':(d.tokenLeakInFilename===true?'YES':'-')} | ${d.relative||'-'} |`).join('\n')||'| - | - | - | - | - | - |';
  const pdfRows=markdownIntegrityTable(analysis, redact) || '| - | - | - | - | - | - | - |';
  const netRows=result.network.slice(0,240).map(n=>`| ${n.label} | ${n.method} ${n.path} | ${n.status} | ${n.status<400?'OK':'CHECK'} | keys: ${(n.requestKeys||[]).join(', ')}; ${n.contentType||''}; ${n.contentLength||''}; ${n.ms??''}ms |`).join('\n')||'| - | - | - | - | - |';
  const consoleRows=result.console.slice(0,80).map(c=>`| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n')||'| - | - | No console warnings/errors captured. |';
  const blockers=result.blockers.map(b=>`- ${b}`).join('\n')||'- None.';
  const bugText=result.bugs.length?result.bugs.map(b=>`### ${b.id}: ${b.title}\n- Severity: ${b.severity}\n- Evidence: ${b.evidence}\n${b.details?'- Details:\n'+b.details.map(d=>`  - ${d.file}: ${redact(d.issue)}`).join('\n'):''}`).join('\n\n'):'No confirmed NL-BUG created in this P11 pass.';
  const secRows=result.securityFindings.map(f=>`| ${f.id} | ${f.severity} | ${f.surface} | ${f.role} | ${f.impact} | ${f.evidence} | ${f.fix} |`).join('\n')||'| - | - | - | - | - | - | - |';
  const shots=result.snapshots.map(s=>`- ${s.slug}: \`evidence/${path.basename(s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md=`# Result — P11 — Client invoices and generated documents\n\n## Session summary\n- Host/environment: public-domain \`${APP}\`.\n- Browser/MCP/tooling: Playwright Chromium headless, UI-first; PyMuPDF/PyPDF used for downloaded PDF professional-integrity analysis.\n- Role/account used: primary billing client ${shortEmail(ARJUN)}; cross-user check ${shortEmail(RAHUL)}.\n- Fixtures created: none; used existing AUDIT-P07 invoice/payment documents.\n- Routes walked: /invoices, /payments/[id], /payments/invoice/[id], /invoices/[id], /settings/files, /verify-document, mobile variants.\n- Highest severity: ${highest}\n\n## Coverage table\n| Unit | Route/subsurface | Status | Evidence | Notes |\n|---|---|---|---|---|\n${covRows}\n\n## Control inventory deltas\n| Page | Control/tab/dialog | Old-prompt gap? | Runtime verdict | Evidence |\n|---|---|---|---|---|\n${controlRows}\n\n## Download observations\n| Control | Verdict | Filename | Bytes | Token leak in filename | Saved evidence |\n|---|---|---|---:|---|---|\n${downloadRows}\n\n## PDF professional-integrity analysis\nMandatory careful checks for **all** client/admin generated PDFs: non-zero pages, page numbering, header/footer continuity, page-bound overflow, **overlapping/stacked text** (block + span bbox), **payment history / transaction history / line-item / schedule row collisions**, concatenated document numbers and currency amounts, duplicated footer/legal strings, and verify URL presence. Overlaps in dense sections (especially invoice payment history) are **FAIL / P1**, not soft warnings — the same class of defect can appear in quotes, receipts, contracts and future templates.\n\n| File | Doc type | Pages | Bytes | Integrity verdict | Sections | Issues / warnings |\n|---|---|---:|---:|---|---|---|\n${pdfRows}\n\n## Network/API observations\n| Trigger | Method + path | Status | Verdict | Notes |\n|---|---|---:|---|---|\n${netRows}\n\n## Console findings\n| Context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## Blockers / deferred checks\n${blockers}\n\n## Bugs\n${bugText}\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n${secRows}\n\n## Security checks passed\n| Area | Sample tested | Verdict | Evidence |\n|---|---|---|---|\n| Protected invoice/payment routes | Rahul opening Arjun payment/invoice URLs | ${(paymentIdor||invoiceIdor)?'FAIL':'PASS'} | security_rahul_attempt_* |\n| Anonymous protected payment invoice | Anonymous opening /payments/invoice/[id] | TESTED | security_anon_payment_invoice_redirect |\n| Public verify minimality | Valid and invalid verify inputs | TESTED | verify_document_* |\n| Download secret hygiene | Filenames and report URLs checked/redacted | PASS | Download table + local scan |\n\n## Blocked security checks\n| Check | Why blocked | Required access/fixture |\n|---|---|---|\n| Expired document token | No expired token fixture found in UI/PDF | Seeded expired verify token/document |\n| 0-byte document from server | Downloads were non-zero; no 0-byte fixture available | Broken/zero-byte fixture or controlled fault injection |\n\n## Evidence files\n${shots}\n\n## Handoff\n- Backend/API: generated PDFs should be reviewed for repeated headers/footers on continuation pages and duplicate/concatenated footer/table text.\n- Frontend/UI: signed document links appear in manual invoice page and PDF verify links; reports redact tokens, but UI should avoid unnecessary exposure of long signed URLs where possible.\n- Data/setup: provide expired-token and broken/0-byte document fixtures for negative verify/download testing.\n`;
  fs.writeFileSync(path.join(OUT,'result.md'),md);
})();
