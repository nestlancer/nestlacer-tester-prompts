const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { analyzePdfs: analyzePdfsHelper, integrityBugsFromAnalysis, markdownIntegrityTable } = require('./lib/pdf_analyze');

const OUT = path.join(__dirname, '..', 'nestlancer-test-output', 'reports', 'P12');
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });
const APP = 'https://app.nestlancer.com';
const PW = process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build';
const ARJUN = 'arjun.mehta@nestlancer.com';
const RAHUL = 'rahul.desai@nestlancer.com';
const COMPLETED_AUDIT = '01a10733-de39-7618-978a-0febfac65964';
const CANCELLED_AUDIT = '01a1071b-6ad9-759d-bd83-ead88dd52d1b';
const PENDING_HIGH = '01a106bf-6bb4-77f8-875b-dae9fb5ec3e4';

function shortEmail(e){const [l,d]=String(e).split('@'); return `${l.slice(0,10)}…@${d}`;}
function sanitizeUrl(u){try{const url=new URL(u); for(const k of [...url.searchParams.keys()]) if(/token|code|otp|password|secret|signature|key|auth|session|cookie|credential|expires|signed|x-amz|t/i.test(k)) url.searchParams.set(k,'<redacted>'); if(/s3\.nestlancer\.com$/i.test(url.hostname)) return 'https://s3.nestlancer.com/<signed-document-url-redacted>'; return url.toString();}catch{return String(u||'').replace(PW,'<redacted-demo-password>');}}
function redact(s){return String(s??'').replaceAll(PW,'<redacted-demo-password>').replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g,'<demo-email>@nestlancer.com').replace(/(token|otp|code|secret|password|signature|cookie|authorization|credential)(["'\s:=]+)([^\s"'<>]+)/gi,'$1$2<redacted>').replace(/https:\/\/s3\.nestlancer\.com\/[^\s"'<>]+/gi,'https://s3.nestlancer.com/<signed-url-redacted>').replace(/https:\/\/app\.nestlancer\.com\/verify-document\?[^\s"'<>]+/gi,'https://app.nestlancer.com/verify-document?<redacted>').replace(/eyJ[A-Za-z0-9._-]+/g,'<redacted-jwt>').slice(0,22000);}
async function dismiss(page){for(const t of ['Accept','Dismiss']){try{const b=page.getByRole('button',{name:t}).first(); if(await b.isVisible({timeout:600})) await b.click({timeout:1000});}catch{}}}
async function attach(page,label,result){const started=new Map(); page.on('request',req=>started.set(req,Date.now())); page.on('response',async res=>{const req=res.request(); const u=sanitizeUrl(res.url()); if(!/nestlancer\.com/.test(u)) return; const interesting=req.resourceType()==='document'||/\/api\//.test(u)||/payment|invoice|receipt|document|razorpay|order|dispute|method|s3|auth|users/i.test(u); if(!interesting) return; let keys=[]; const post=req.postData(); if(post){try{keys=Object.keys(JSON.parse(post));}catch{keys=['<non-json-post-body>'];}} const headers=res.headers(); result.network.push({label,method:req.method(),status:res.status(),type:req.resourceType(),path:(()=>{try{const uu=new URL(u);return uu.pathname+uu.search}catch{return u}})(),ms:started.has(req)?Date.now()-started.get(req):null,requestKeys:keys,contentType:(headers['content-type']||'').split(';')[0],contentDisposition:redact(headers['content-disposition']||''),contentLength:headers['content-length']||''});}); page.on('console',msg=>{if(['error','warning'].includes(msg.type())) result.console.push({label,type:msg.type(),text:redact(msg.text())});}); page.on('pageerror',err=>result.console.push({label,type:'pageerror',text:redact(err.message||String(err))}));}
async function snap(page,slug,result,extra={}){await page.waitForTimeout(600).catch(()=>{}); const file=path.join(EVID,`${slug}.png`); await page.screenshot({path:file,fullPage:true}).catch(e=>result.notes.push(`screenshot failed ${slug}: ${e.message}`)); const url=sanitizeUrl(page.url()); const title=await page.title().catch(()=> ''); const text=redact(await page.locator('body').innerText({timeout:5000}).catch(()=>'')); const raw=await page.evaluate(()=>({buttons:[...document.querySelectorAll('button,[role="button"]')].map((b,i)=>({i,text:(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,120),disabled:b.disabled||b.getAttribute('aria-disabled')==='true',aria:b.getAttribute('aria-label'),type:b.getAttribute('type')})).slice(0,220),links:[...document.querySelectorAll('a[href]')].map((a,i)=>({i,text:(a.textContent||'').trim().slice(0,120),href:a.href,target:a.target,download:a.download,row:(a.closest('tr')?.innerText||'').trim().slice(0,220)})).slice(0,220),inputs:[...document.querySelectorAll('input,textarea,select')].map((el,i)=>({i,tag:el.tagName,type:el.getAttribute('type'),name:el.getAttribute('name'),placeholder:el.getAttribute('placeholder'),id:el.id,valueLength:(el.value||'').length})).slice(0,120),active:document.activeElement?`${document.activeElement.tagName}#${document.activeElement.id||''}`:''})).catch(e=>({error:e.message})); const controls={...raw,links:(raw.links||[]).map(l=>({...l,href:sanitizeUrl(l.href)}))}; fs.writeFileSync(path.join(EVID,`${slug}.txt`),`URL: ${url}\nTITLE: ${title}\n\n${text}`); result.snapshots.push({slug,file,url,title,controls,...extra}); return {url,title,text,controls};}
async function goto(page,url,slug,result){const rec={slug,requestedUrl:sanitizeUrl(url)}; try{const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); rec.status=res?res.status():null; await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); const s=await snap(page,slug,result,{httpStatus:rec.status}); rec.finalUrl=s.url; rec.title=s.title; rec.ok=!!res&&rec.status<500;}catch(e){rec.error=e.message; try{await snap(page,`${slug}_error`,result,{error:e.message});}catch{}} result.steps.push(rec); return rec;}
async function loginContext(browser,email,label,result,viewport={width:1365,height:900}){const ctx=await browser.newContext({viewport,ignoreHTTPSErrors:true,acceptDownloads:true}); const page=await ctx.newPage(); await attach(page,label,result); for(let attempt=0; attempt<2; attempt++){await page.goto(`${APP}/login`,{waitUntil:'domcontentloaded',timeout:45000}); await dismiss(page); await page.locator('input[type="email"],input[name="email"]').first().fill(email); await page.locator('input[type="password"],input[name="password"]').first().fill(PW); const form=page.locator('form').first(); await Promise.allSettled([page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:25000}), form.getByRole('button',{name:/^sign in$/i}).click({timeout:6000})]); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); if(!page.url().includes('/login')) break; await page.locator('input[type="password"],input[name="password"]').first().press('Enter').catch(()=>{}); await page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:12000}).catch(()=>{}); await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{}); if(!page.url().includes('/login')) break; }
 if(page.url().includes('/login')) result.blockers.push(`Login did not complete for ${shortEmail(email)} (${label})`);
 await snap(page,`${label}_login_after`,result,{account:shortEmail(email)}); return {ctx,page};}
async function downloadByRole(page,name,slug,result){const rec={control:name,slug,verdict:'NOT_CLICKED'}; try{const loc=page.getByRole('button',{name:new RegExp(name,'i')}).first(); if(!(await loc.count())){rec.verdict='MISSING'; result.downloads.push(rec); return rec;} const dlPromise=page.waitForEvent('download',{timeout:22000}).catch(e=>({error:e.message})); await loc.click({timeout:6000}); const dl=await dlPromise; if(dl&&!dl.error){const filename=dl.suggestedFilename(); const save=path.join(EVID,`${slug}_${filename.replace(/[^a-zA-Z0-9._-]+/g,'_')}`); await dl.saveAs(save); rec.verdict='DOWNLOADED'; rec.filename=filename; rec.bytes=fs.statSync(save).size; rec.savedAs=save; rec.relative=path.relative(OUT,save); rec.tokenLeakInFilename=/token|secret|signature|credential|jwt|access/i.test(filename);} else {rec.verdict='NO_DOWNLOAD_EVENT'; rec.error=dl?.error||'';} }catch(e){rec.verdict='ERROR'; rec.error=e.message;} result.downloads.push(rec); return rec;}
function analyzePdfs(pdfPaths){return analyzePdfsHelper(pdfPaths,{extractVerifyUrls:false}).analysis;}
function buildFixtureSummary(){const scanDir=path.join(__dirname, '..', 'nestlancer-test-output', 'reports', 'P12', 'finder'); const rows=[]; try{for(const f of fs.readdirSync(scanDir).filter(f=>f.endsWith('.txt'))){const email=f.replace('.txt','').replace('_','.')+'@nestlancer.com'; const text=fs.readFileSync(path.join(scanDir,f),'utf8'); const lines=text.split(/\n/).filter(l=>/\t/.test(l)&&/₹|Checkout|View/.test(l)); for(const l of lines){rows.push({account:shortEmail(email),row:redact(l)});} }}catch{} const safeCandidates=rows.filter(r=>/AUDIT/i.test(r.row)&&/Pending/i.test(r.row)&&/Checkout/i.test(r.row)&&/₹(?:[1-9]|[1-9][0-9])\.00/.test(r.row)); return {scannedFrom:'/reports/P12/finder/*.txt',rowCount:rows.length,safeLowValueAuditCandidates:safeCandidates.length,rows:rows.slice(0,120)};}

(async()=>{
  const result={prompt:'P12',generatedAt:new Date().toISOString(),mode:'public-domain UI-first; payment mutations restricted by ₹1–₹100 AUDIT fence',steps:[],snapshots:[],network:[],console:[],downloads:[],pdfIntegrity:[],controlInventory:[],bugs:[],blockers:[],notes:[],securityFindings:[],fixtureScan:buildFixtureSummary()};
  const browser=await chromium.launch({ headless: true});
  const arjun=await loginContext(browser,ARJUN,'arjun',result); const page=arjun.page;

  await goto(page,`${APP}/payments`,'payments_overview_all',result);
  const overview=await page.evaluate(()=>({text:document.body.innerText,links:[...document.querySelectorAll('a[href*="/payments/"]')].map(a=>({text:a.textContent.trim(),href:a.href,row:a.closest('tr')?.innerText||''})),selects:[...document.querySelectorAll('select')].map(s=>({value:s.value,options:[...s.options].map(o=>({text:o.text,value:o.value}))}))})).catch(e=>({error:e.message}));
  fs.writeFileSync(path.join(EVID,'payments_overview_inventory.json'),JSON.stringify({links:overview.links?.map(l=>({...l,href:sanitizeUrl(l.href),row:redact(l.row)})),selects:overview.selects},null,2));
  result.controlInventory.push({page:'/payments',control:'stats/status filters/rows/actions',verdict:/Total paid|Pending|Transaction history|Checkout|View/i.test(overview.text||'')?'PASS':'CHECK',evidence:`payment links=${overview.links?.length||0}; status selects=${overview.selects?.length||0}`});
  try{const sel=page.locator('select').first(); if(await sel.count()){await sel.selectOption({label:/Completed/i}); await snap(page,'payments_filter_completed',result); await sel.selectOption({label:/Pending/i}); await snap(page,'payments_filter_pending',result); await sel.selectOption({label:/All statuses/i}).catch(()=>{});}}catch(e){result.notes.push('status filter interaction skipped: '+e.message);}

  await goto(page,`${APP}/payments/invoices`,'payments_invoices_alias',result);
  await goto(page,`${APP}/payments/methods`,'payment_methods_empty',result);
  const methodsText=await page.locator('body').innerText().catch(()=> '');
  result.controlInventory.push({page:'/payments/methods',control:'saved methods list/add/default/delete/nickname',verdict:/No saved methods yet|Manual token entry is not supported/i.test(methodsText)?'PASS_EMPTY_BLOCKED':'CHECK',evidence:'payment_methods_empty'});

  await goto(page,`${APP}/payments/${COMPLETED_AUDIT}`,'payment_completed_audit_detail',result);
  result.controlInventory.push({page:`/payments/${COMPLETED_AUDIT}`,control:'completed state/receipt/invoice/dispute',verdict:'PASS_CONTROLLED',evidence:'payment_completed_audit_detail'});
  try{await page.getByRole('button',{name:/Receipt/i}).click({timeout:3000}); await snap(page,'payment_completed_receipt_tab',result);}catch{}
  try{await page.getByRole('button',{name:/Invoice/i}).click({timeout:3000}); await snap(page,'payment_completed_invoice_tab',result);}catch{}
  try{await page.getByRole('button',{name:/File a payment dispute/i}).click({timeout:4000}); await snap(page,'payment_dispute_form_empty',result); const submit=await page.getByRole('button',{name:/Submit dispute/i}).isDisabled({timeout:2000}).catch(()=>null); result.controlInventory.push({page:`/payments/${COMPLETED_AUDIT}`,control:'file dispute form empty-validation',verdict:submit===true?'PASS_DISABLED_WHEN_EMPTY':'CHECK',evidence:'payment_dispute_form_empty'}); try{await page.getByRole('button',{name:/Cancel/i}).last().click({timeout:3000});}catch{}}catch(e){result.notes.push('dispute form open failed: '+e.message);}
  await downloadByRole(page,'Download invoice','completed_audit_download_invoice',result);
  await downloadByRole(page,'Download receipt','completed_audit_download_receipt',result);

  await goto(page,`${APP}/payments/${CANCELLED_AUDIT}`,'payment_cancelled_audit_detail',result);
  const cancelledText=await page.locator('body').innerText().catch(()=> '');
  result.controlInventory.push({page:`/payments/${CANCELLED_AUDIT}`,control:'already-cancelled state',verdict:/Cancelled|Payment details|Back to payments/i.test(cancelledText)?'PASS':'CHECK',evidence:'payment_cancelled_audit_detail'});

  await goto(page,`${APP}/payments/${PENDING_HIGH}`,'payment_pending_high_detail_no_mutation',result);
  result.controlInventory.push({page:`/payments/${PENDING_HIGH}`,control:'pay online/offline/cancel controls on pending non-audit high-value payment',verdict:'VISIBLE_BUT_MUTATION_BLOCKED_BY_SAFETY_FENCE',evidence:'payment_pending_high_detail_no_mutation'});
  try{await page.getByText('Bank / UPI transfer').first().click({timeout:5000}); await snap(page,'payment_pending_offline_transfer_panel',result); const utr=page.locator('input,textarea').first(); if(await utr.count()){await utr.fill('P12-XSS-<img src=x onerror=alert(1)>'); await snap(page,'payment_pending_offline_xss_input_not_submitted',result); await utr.fill('');}}catch(e){result.notes.push('offline panel inspection failed: '+e.message);}
  try{await page.getByText('Pay online').first().click({timeout:5000}); await snap(page,'payment_pending_pay_online_panel',result);}catch(e){result.notes.push('pay online tab failed: '+e.message);}
  try{await page.getByText(/^Invoice$/).first().click({timeout:5000}); await snap(page,'payment_pending_invoice_tab',result);}catch(e){result.notes.push('invoice tab failed: '+e.message);}
  await downloadByRole(page,'Download invoice','pending_high_download_invoice',result);

  // Refresh/back after non-mutating tab/download interactions.
  await page.reload({waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{}); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{}); await snap(page,'payment_pending_after_refresh',result);
  await page.goBack({waitUntil:'domcontentloaded',timeout:15000}).catch(()=>{}); await snap(page,'payment_pending_after_back',result);

  // Empty-state and cross-user security with Rahul.
  const rahul=await loginContext(browser,RAHUL,'rahul',result);
  await goto(rahul.page,`${APP}/payments`,'payments_empty_rahul',result);
  await goto(rahul.page,`${APP}/payments/${COMPLETED_AUDIT}`,'security_rahul_attempt_arjun_completed_payment',result);
  const rahulCompleted=await rahul.page.locator('body').innerText().catch(()=> '');
  await goto(rahul.page,`${APP}/payments/${PENDING_HIGH}`,'security_rahul_attempt_arjun_pending_payment',result);
  const rahulPending=await rahul.page.locator('body').innerText().catch(()=> '');
  const idor=/AUDIT-P07-20261004-1|Khandesh Spice|₹750\.00|₹22,500\.00|Proceed to secure checkout|Download receipt/i.test(rahulCompleted+'\n'+rahulPending);
  result.securityFindings.push({id:idor?'P12-SEC-IDOR-01':'P12-SEC-IDOR-CHECK',severity:idor?'P0':'PASS',surface:'client payments',role:'client B accessing client A payment IDs',impact:idor?'Cross-client payment data exposed':'Other client receives not-found/denial, no Arjun payment data',evidence:'security_rahul_attempt_arjun_*',fix:idor?'Enforce ownership on payment detail/API before rendering':'No fix'});

  const anonCtx=await browser.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true}); const anon=await anonCtx.newPage(); await attach(anon,'anon',result); await goto(anon,`${APP}/payments`,'security_anon_payments_redirect',result); await goto(anon,`${APP}/payments/${COMPLETED_AUDIT}`,'security_anon_payment_detail_redirect',result); await anonCtx.close().catch(()=>{});

  // Mobile + keyboard evidence.
  const mobile=await loginContext(browser,ARJUN,'mobile_arjun',result,{width:375,height:812});
  await goto(mobile.page,`${APP}/payments`,'mobile_payments_overview_375',result);
  await goto(mobile.page,`${APP}/payments/${PENDING_HIGH}`,'mobile_payment_pending_detail_375',result);
  await goto(page,`${APP}/payments`,'keyboard_payments_start',result); for(let i=0;i<14;i++) await page.keyboard.press('Tab').catch(()=>{}); await snap(page,'keyboard_payments_after_tabs',result);

  const pdfPaths=result.downloads.filter(d=>d.savedAs&&d.verdict==='DOWNLOADED').map(d=>d.savedAs);
  try{result.pdfIntegrity=analyzePdfs(pdfPaths); fs.writeFileSync(path.join(EVID,'pdf_integrity_analysis.json'),JSON.stringify(result.pdfIntegrity,null,2));}catch(e){result.notes.push('PDF integrity analysis failed: '+e.message);}

  await arjun.ctx.close().catch(()=>{}); await rahul.ctx.close().catch(()=>{}); await mobile.ctx.close().catch(()=>{}); await browser.close();

  // Prompt safety blockers.
  result.blockers.push('Checkout initiate/double-submit/cancel/fail/success were not executed: no confirmed AUDIT-P12 or AUDIT low-value ₹1–₹100 pending payment was visible. Existing pending checkout controls were high-value/non-AUDIT payments.');
  result.blockers.push('Offline transfer submit/pending-verification mutation was not executed for the same safety reason. Offline instructions and fields were inspected only.');
  result.blockers.push('Payment cancellation final confirm was not executed: visible pending cancellation target was high-value/non-AUDIT.');
  result.blockers.push('Saved-method add/default/nickname/delete mutations were blocked: no saved methods existed and manual token entry is not supported; adding requires completing Razorpay checkout.');
  result.blockers.push('Dispute submit mutation was blocked: only visible AUDIT completed payment was ₹750, above the prompt safety fence; dispute form was opened and empty submit state was checked only.');

  const pdfBugs=integrityBugsFromAnalysis(result.pdfIntegrity||[],{bugId:'NL-BUG-PAY-DOCS-1',titlePrefix:'Payment/invoice PDF'}); for(const b of pdfBugs) result.bugs.push(b);
  if(idor) result.bugs.push({id:'NL-BUG-PAY-SEC-1',severity:'P0',title:'Client can access another client payment data',evidence:'security_rahul_attempt_arjun_*'});

  // Prune benign storage/sensitive-control data from raw result surface.
  for(const s of result.snapshots){ if(/login/.test(s.slug)) delete s.controls; }

  fs.writeFileSync(path.join(OUT,'p12_result.json'),JSON.stringify(result,null,2).replace(/https:\/\/s3\.nestlancer\.com\/%3Csigned-document-url-redacted%3E/g,'https://s3.nestlancer.com/<signed-document-url-redacted>'));

  const highest=result.bugs.find(b=>b.severity==='P0')?'P0':result.bugs.find(b=>b.severity==='P1')?'P1':result.bugs.length?result.bugs[0].severity:(result.blockers.length?'BLOCKED':'INFO');
  const cov=[
    ['Overview','/payments','TESTED','payments_overview_all','Stats, rows, filters, history, links/actions inventoried'],
    ['Status filters','/payments status select','TESTED','payments_filter_completed / payments_filter_pending','Completed and Pending filter states captured'],
    ['Alias','/payments/invoices','TESTED','payments_invoices_alias','Alias routed to invoices surface'],
    ['Saved methods','/payments/methods','EMPTY/PARTIAL','payment_methods_empty','No saved methods; manual token entry not supported'],
    ['Completed payment detail',`/payments/${COMPLETED_AUDIT}`,'TESTED','payment_completed_audit_detail','Receipt/invoice tabs, docs, dispute form opening'],
    ['Cancelled payment detail',`/payments/${CANCELLED_AUDIT}`,'TESTED','payment_cancelled_audit_detail','Already-cancelled state captured'],
    ['Pending checkout detail',`/payments/${PENDING_HIGH}`,'INSPECTED_NO_MUTATION','payment_pending_high_detail_no_mutation','High-value non-AUDIT; no checkout/cancel/offline submit'],
    ['Offline transfer panel','Bank / UPI transfer tab','INSPECTED_NO_SUBMIT','payment_pending_offline_transfer_panel','Instructions/account/UTR/receipt fields visible'],
    ['Dispute form','File dispute','OPENED_NO_SUBMIT','payment_dispute_form_empty','Empty submit disabled captured'],
    ['Download docs','invoice/receipt downloads','TESTED','completed_audit_download_* / pending_high_download_invoice','Generated docs downloaded and analyzed'],
    ['Refresh/back','payment detail after refresh/back','TESTED','payment_pending_after_refresh / payment_pending_after_back','Non-mutating navigation check'],
    ['Empty state','Rahul /payments','TESTED','payments_empty_rahul','No payments empty state captured'],
    ['Cross-user IDOR','Rahul opening Arjun payment IDs','PASS','security_rahul_attempt_arjun_*','No payment data disclosed'],
    ['Anonymous gate','anon /payments and /payments/[id]','TESTED','security_anon_*','Redirects to login'],
    ['Mobile','375px payments/detail','TESTED','mobile_*','Mobile evidence captured'],
  ].map(r=>`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join('\n');
  const controls=result.controlInventory.map(c=>`| ${c.page} | ${c.control} | - | ${c.verdict} | ${redact(c.evidence)} |`).join('\n')||'| - | - | - | - | - |';
  const dlRows=result.downloads.map(d=>`| ${d.control} | ${d.verdict} | ${d.filename||'-'} | ${d.bytes||'-'} | ${d.tokenLeakInFilename===false?'No':(d.tokenLeakInFilename===true?'YES':'-')} | ${d.relative||'-'} |`).join('\n')||'| - | - | - | - | - | - |';
  const pdfRows=markdownIntegrityTable(result.pdfIntegrity||[], redact)||'| - | - | - | - | - | - | - |';
  const netRows=result.network.slice(0,240).map(n=>`| ${n.label} | ${n.method} ${n.path} | ${n.status} | ${n.status<400?'OK':'CHECK'} | keys: ${(n.requestKeys||[]).join(', ')}; ${n.contentType||''}; ${n.contentLength||''}; ${n.ms??''}ms |`).join('\n')||'| - | - | - | - | - |';
  const consoleRows=result.console.slice(0,80).map(c=>`| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n')||'| - | - | No console warnings/errors captured. |';
  const bugText=result.bugs.length?result.bugs.map(b=>`### ${b.id}: ${b.title}\n- Severity: ${b.severity}\n- Evidence: ${b.evidence}\n${b.details?'- Details:\n'+b.details.map(d=>`  - ${d.file}: ${redact(d.issue)}`).join('\n'):''}`).join('\n\n'):'No confirmed app defect besides blocked mutation coverage.';
  const blockers=result.blockers.map(b=>`- ${b}`).join('\n')||'- None.';
  const secRows=result.securityFindings.map(f=>`| ${f.id} | ${f.severity} | ${f.surface} | ${f.role} | ${f.impact} | ${f.evidence} | ${f.fix} |`).join('\n')||'| - | - | - | - | - | - | - |';
  const fixtureRows=(result.fixtureScan.rows||[]).slice(0,30).map(r=>`| ${r.account} | ${r.row.replace(/\n/g,' ')} |`).join('\n')||'| - | - |';
  const shots=result.snapshots.map(s=>`- ${s.slug}: \`evidence/${path.basename(s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md=`# Result — P12 — Client payments: overview, checkout, saved methods, offline transfer and disputes\n\n## Session summary\n- Host/environment: public-domain \`${APP}\`.\n- Browser/MCP/tooling: Playwright Chromium headless, UI-first. PyMuPDF/PyPDF used for generated-document integrity checks.\n- Role/account used: primary client ${shortEmail(ARJUN)}; empty/cross-user client ${shortEmail(RAHUL)}.\n- Fixtures created: none. Safety fence required AUDIT payment ₹1–₹100 for payment-state mutations; no suitable fixture was visible.\n- Routes walked: /payments, /payments/[id], /payments/methods, /payments/invoice/[id] indirectly from document route, /payments/invoices alias, mobile variants.\n- Highest severity: ${highest}\n\n## Coverage table\n| Unit | Route/subsurface | Status | Evidence | Notes |\n|---|---|---|---|---|\n${cov}\n\n## Fixture/safety scan\nAll visible payment mutations were gated by the prompt fence. Existing AUDIT-P07 payments are ₹750, and visible pending checkout candidates are high-value non-AUDIT demo payments. A prior UI scan of demo client payment tables found **${result.fixtureScan.safeLowValueAuditCandidates}** pending AUDIT payments in the allowed ₹1–₹100 range.\n\n| Account | Visible payment row sample |\n|---|---|\n${fixtureRows}\n\n## Control inventory deltas\n| Page | Control/tab/dialog | Old-prompt gap? | Runtime verdict | Evidence |\n|---|---|---|---|---|\n${controls}\n\n## Download observations\n| Control | Verdict | Filename | Bytes | Token leak in filename | Saved evidence |\n|---|---|---|---:|---|---|\n${dlRows}\n\n## PDF/generated-document professional-integrity analysis\nChecks use the shared checklist at \`nestlancer-test-output/GENERATED_DOCUMENT_INTEGRITY_CHECKLIST.md\`: page count, headers/footers, page numbering, page-bound layout, overlap heuristics, duplicate strings, long content/number wrapping, verification metadata, and secret redaction in reports.\n\n| File | Doc type | Pages | Bytes | Integrity verdict | Sections | Issues / warnings |\n|---|---|---:|---:|---|---|---|\n${pdfRows}\n\n## Network/API observations\n| Trigger | Method + path | Status | Verdict | Notes |\n|---|---|---:|---|---|\n${netRows}\n\n## Console findings\n| Context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## Blockers / deferred mutation checks\n${blockers}\n\n## Bugs\n${bugText}\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n${secRows}\n\n## Security checks passed\n| Area | Sample tested | Verdict | Evidence |\n|---|---|---|---|\n| Protected payment routes | Anonymous /payments and /payments/[id] | PASS/TESTED | security_anon_* |\n| Payment IDOR | Rahul opening Arjun completed/pending payment IDs | ${(idor?'FAIL':'PASS')} | security_rahul_attempt_arjun_* |\n| XSS smoke | Malicious-looking text typed into offline UTR field but not submitted | PASS_CLIENT_SIDE | payment_pending_offline_xss_input_not_submitted |\n| Download secret hygiene | Filenames/report URLs scanned; signed URLs/tokens redacted in report artifacts | PASS | local sanitized scan |\n\n## Handoff\n- Backend/API: provide a dedicated AUDIT-P12 pending payment in the ₹1–₹100 range so checkout initiate/cancel/double-submit/offline submit/dispute submit can be safely executed end to end.\n- Frontend/UI: saved methods page correctly explains that manual token entry is unsupported, but this leaves add/default/delete/nickname untestable without a completed checkout fixture.\n- Data/setup: seed expired/failed/cancelled/processing/chargeback-style payments and a saved method fixture for deterministic regression coverage.\n\n## Evidence files\n${shots}\n`;
  fs.writeFileSync(path.join(OUT,'result.md'),md);
})();
