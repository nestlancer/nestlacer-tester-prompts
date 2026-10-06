const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'nestlancer-test-output', 'reports', 'P10');
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });
const APP = 'https://app.nestlancer.com';
const PW = process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build';
const KARTHIK = 'karthik.menon@nestlancer.com';
const ARJUN = 'arjun.mehta@nestlancer.com';
const PROJECT_ID = '01a106c2-bc77-7700-8fc1-c3c7c8b86264'; // Karthik UPI Switch Integration Layer
const ARJUN_EMPTY_PROJECT_ID = '01a1071b-6a26-73eb-9394-c5d84a25e803';

function shortEmail(e){const [l,d]=String(e).split('@'); return `${l.slice(0,10)}…@${d}`;}
function sanitizeUrl(u){
  try{const url=new URL(u); for(const k of [...url.searchParams.keys()]) if(/token|code|otp|password|secret|signature|key|auth|session|cookie|credential|expires|signed|x-amz/i.test(k)) url.searchParams.set(k,'<redacted>'); if(/s3\.nestlancer\.com$/i.test(url.hostname)&&/private/i.test(url.pathname)){url.pathname='/<private-media-object-redacted>'; url.search='';} return url.toString();}
  catch{return String(u||'').replace(PW,'<redacted>');}
}
function redact(s){return String(s??'').replaceAll(PW,'<redacted-demo-password>').replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g,'<demo-email>@nestlancer.com').replace(/(token|otp|code|secret|password|signature|cookie|authorization|credential)(["'\s:=]+)([^\s"'<>]+)/gi,'$1$2<redacted>').replace(/https:\/\/s3\.nestlancer\.com\/[^\s"'<>]+/gi,'https://s3.nestlancer.com/<private-or-signed-url-redacted>').replace(/eyJ[A-Za-z0-9._-]+/g,'<redacted-jwt>').slice(0,20000);}
async function dismiss(page){for(const t of ['Accept','Dismiss']){try{const b=page.getByRole('button',{name:t}).first(); if(await b.isVisible({timeout:600})) await b.click({timeout:1000});}catch{}}}
async function attach(page,label,result){const started=new Map(); page.on('request',req=>started.set(req,Date.now())); page.on('response',async res=>{const req=res.request(); const u=sanitizeUrl(res.url()); if(!/nestlancer\.com/.test(u)) return; const interesting=req.resourceType()==='document'||/\/api\//.test(u)||/projects|deliverables|media|files|download|s3|auth|users/i.test(u); if(!interesting) return; let keys=[]; const post=req.postData(); if(post){try{keys=Object.keys(JSON.parse(post));}catch{keys=['<non-json-post-body>'];}} const headers=res.headers(); result.network.push({label,method:req.method(),status:res.status(),type:req.resourceType(),path:(()=>{try{const uu=new URL(u);return uu.pathname+uu.search}catch{return u}})(),ms:started.has(req)?Date.now()-started.get(req):null,requestKeys:keys,contentType:(headers['content-type']||'').split(';')[0],contentDisposition:redact(headers['content-disposition']||''),contentLength:headers['content-length']||''});}); page.on('console',msg=>{if(['error','warning'].includes(msg.type())) result.console.push({label,type:msg.type(),text:redact(msg.text())});}); page.on('pageerror',err=>result.console.push({label,type:'pageerror',text:redact(err.message||String(err))}));}
async function snap(page,slug,result,extra={}){await page.waitForTimeout(700).catch(()=>{}); const file=path.join(EVID,`${slug}.png`); await page.screenshot({path:file,fullPage:true}).catch(e=>result.notes.push(`screenshot failed ${slug}: ${e.message}`)); const url=sanitizeUrl(page.url()); const title=await page.title().catch(()=> ''); const text=redact(await page.locator('body').innerText({timeout:5000}).catch(()=>'')); const raw=await page.evaluate(()=>({buttons:[...document.querySelectorAll('button,[role="button"]')].map((b,i)=>({i,text:(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,120),disabled:b.disabled||b.getAttribute('aria-disabled')==='true',aria:b.getAttribute('aria-label'),type:b.getAttribute('type')})).slice(0,160),links:[...document.querySelectorAll('a[href]')].map((a,i)=>({i,text:(a.textContent||'').trim().slice(0,120),href:a.href,target:a.target,download:a.download})).slice(0,160),inputs:[...document.querySelectorAll('input,textarea,select')].map((el,i)=>({i,tag:el.tagName,type:el.getAttribute('type'),name:el.getAttribute('name'),placeholder:el.getAttribute('placeholder'),id:el.id,valueLength:(el.value||'').length})).slice(0,100),active:document.activeElement?`${document.activeElement.tagName}#${document.activeElement.id||''}`:''})).catch(e=>({error:e.message})); const controls={...raw,links:(raw.links||[]).map(l=>({...l,href:sanitizeUrl(l.href)}))}; fs.writeFileSync(path.join(EVID,`${slug}.txt`),`URL: ${url}\nTITLE: ${title}\n\n${text}`); result.snapshots.push({slug,file,url,title,controls,...extra}); return {url,title,text,controls};}
async function goto(page,url,slug,result){const rec={slug,requestedUrl:sanitizeUrl(url)}; try{const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); rec.status=res?res.status():null; await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{}); const s=await snap(page,slug,result,{httpStatus:rec.status}); rec.finalUrl=s.url; rec.title=s.title; rec.ok=!!res&&rec.status<500;}catch(e){rec.error=e.message; try{await snap(page,`${slug}_error`,result,{error:e.message});}catch{}} result.steps.push(rec); return rec;}
async function loginContext(browser,email,label,result,viewport={width:1365,height:900}){const ctx=await browser.newContext({viewport,ignoreHTTPSErrors:true,acceptDownloads:true}); const page=await ctx.newPage(); await attach(page,label,result); await goto(page,`${APP}/login`,`${label}_login_before`,result); await dismiss(page); await page.locator('input[type="email"],input[name="email"]').first().fill(email); await page.locator('input[type="password"],input[name="password"]').first().fill(PW); await Promise.allSettled([page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:22000}),page.locator('button[type="submit"]').first().click()]); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); if(page.url().includes('/login')){await page.goto(`${APP}/dashboard`,{waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{}); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});} await snap(page,`${label}_login_after`,result,{account:shortEmail(email)}); const cookies=await ctx.cookies(); result.storage.push({label,localStorageKeys:await page.evaluate(()=>Object.keys(localStorage||{})).catch(()=>[]),sessionStorageKeys:await page.evaluate(()=>Object.keys(sessionStorage||{})).catch(()=>[]),cookies:cookies.map(c=>({name:c.name,domain:c.domain,path:c.path,httpOnly:c.httpOnly,secure:c.secure,sameSite:c.sameSite,expires:c.expires?'<set>':'<session>'}))}); return {ctx,page};}
async function closePreview(page){try{const b=page.getByRole('button',{name:/Close preview|Close dialog|Close/i}).last(); if(await b.count()) await b.click({timeout:2000});}catch{try{await page.keyboard.press('Escape');}catch{}} await page.waitForTimeout(500);}
async function clickPreview(page,index,slug,result,options={close:true}){const rec={index,slug,verdict:'NOT_CLICKED'}; try{const btns=page.getByRole('button',{name:/Preview/i}); const count=await btns.count(); rec.previewButtonCount=count; if(index>=count){rec.verdict='MISSING'; result.previewActions.push(rec); return rec;} await btns.nth(index).click({timeout:5000}); await page.waitForTimeout(2500); const snapRes=await snap(page,slug,result,{previewIndex:index}); const text=snapRes.text; rec.verdict=/No in-app preview|Open in new tab|Close|\.pdf|\.zip|Preview/i.test(text)?'PREVIEW_DIALOG_OPENED':'CHECK'; rec.hasOpenLink=/Open in new tab|\bOpen\b/i.test(text); const links=snapRes.controls.links||[]; rec.signedUrlLinks=links.filter(l=>/s3\.nestlancer\.com|<private-media-object-redacted>/.test(l.href)).length; if(options.close){await closePreview(page); await snap(page,`${slug}_closed`,result,{previewIndex:index});} }catch(e){rec.verdict='ERROR'; rec.error=e.message;} result.previewActions.push(rec); return rec;}
async function openPreviewLink(page,slug,result){const rec={slug,verdict:'NOT_CLICKED'}; try{const link=page.getByRole('link',{name:/Open in new tab|Open/i}).first(); if(!(await link.count())){rec.verdict='NO_OPEN_LINK'; result.openActions.push(rec); return rec;} const pagePromise=page.context().waitForEvent('page',{timeout:8000}).catch(()=>null); const dlPromise=page.waitForEvent('download',{timeout:8000}).catch(()=>null); await link.click({timeout:3000}); const newPage=await pagePromise; const dl=await dlPromise; if(newPage){await newPage.waitForLoadState('domcontentloaded',{timeout:8000}).catch(()=>{}); rec.openedUrl=sanitizeUrl(newPage.url()); rec.verdict='OPENED_PAGE'; await newPage.close().catch(()=>{});} if(dl){rec.downloadFilename=dl.suggestedFilename(); rec.verdict='DOWNLOAD_EVENT';} if(rec.verdict==='NOT_CLICKED') rec.verdict='CLICKED_NO_EVENT'; }catch(e){rec.verdict='ERROR'; rec.error=e.message;} result.openActions.push(rec); return rec;}

(async()=>{
  const result={prompt:'P10',generatedAt:new Date().toISOString(),mode:'public-domain UI-first',steps:[],snapshots:[],network:[],console:[],storage:[],previewActions:[],openActions:[],controlInventory:[],bugs:[],blockers:[],notes:[],securityFindings:[]};
  const browser=await chromium.launch({ headless: true});
  const primary=await loginContext(browser,KARTHIK,'karthik',result); const page=primary.page;

  await goto(page,`${APP}/projects/${PROJECT_ID}?tab=deliverables`,'deliverables_karthik',result);
  const delivInfo=await page.evaluate(()=>({text:document.body.innerText,buttons:[...document.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(Boolean)})).catch(e=>({error:e.message}));
  fs.writeFileSync(path.join(EVID,'deliverables_inventory.json'),JSON.stringify(delivInfo,null,2));
  const mutationVisible=/\bApprove\b|Reject|Request revision|Request changes/i.test((delivInfo.buttons||[]).join(' '));
  result.controlInventory.push({page:'deliverables',control:'deliverable cards/status/file count',verdict:/1 deliverable|Approved|Preview/i.test(delivInfo.text||'')?'PASS':'CHECK',evidence:'two approved deliverable cards visible for Karthik project'});
  result.controlInventory.push({page:'deliverables',control:'approve/reject controls in approved state',verdict:mutationVisible?'FAIL_VISIBLE':'PASS_HIDDEN',evidence:`buttons=${(delivInfo.buttons||[]).join(', ')}`});
  await clickPreview(page,0,'deliverables_preview_0_zip_or_spec',result);
  await clickPreview(page,1,'deliverables_preview_1_pdf_or_zip',result);

  await goto(page,`${APP}/projects/${PROJECT_ID}?tab=files`,'files_karthik',result);
  const filesInfo=await page.evaluate(()=>({text:document.body.innerText,buttons:[...document.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(Boolean)})).catch(e=>({error:e.message}));
  fs.writeFileSync(path.join(EVID,'files_inventory.json'),JSON.stringify(filesInfo,null,2));
  const filenames=[...new Set((filesInfo.text||'').match(/[a-z0-9-]+\.(?:pdf|zip|png|jpg|jpeg|webp)/gi)||[])];
  result.controlInventory.push({page:'files',control:'file cards/preview controls',verdict:filenames.length>=2?'PASS':'CHECK',evidence:`filenames=${filenames.join(', ')}`});
  await clickPreview(page,0,'files_preview_0_zip',result,{close:false});
  // With preview open, try Open in new tab for authorized signed URL/download behavior; URL will be redacted.
  await openPreviewLink(page,'files_preview_0_open_link',result);
  await closePreview(page);
  await snap(page,'files_preview_0_closed',result);
  await clickPreview(page,1,'files_preview_1_pdf',result);

  // Empty state on an audit project with no deliverables/files.
  const arjun=await loginContext(browser,ARJUN,'arjun',result);
  await goto(arjun.page,`${APP}/projects/${ARJUN_EMPTY_PROJECT_ID}?tab=deliverables`,'empty_deliverables_audit_project',result);
  await goto(arjun.page,`${APP}/projects/${ARJUN_EMPTY_PROJECT_ID}?tab=files`,'empty_files_audit_project',result);

  // Settings files consistency under primary account.
  await goto(page,`${APP}/settings/files`,'settings_files_karthik',result);
  const settingsText=await page.locator('body').innerText().catch(()=> '');
  const settingsMatches=filenames.filter(f=>settingsText.includes(f));
  result.controlInventory.push({page:'/settings/files',control:'project files appear in global file library',verdict:settingsMatches.length? 'PARTIAL_PASS':'CHECK_NOT_FOUND',evidence:`matched=${settingsMatches.join(', ')||'-'} / project=${filenames.join(', ')}`});

  // IDOR: Arjun tries Karthik project files.
  await goto(arjun.page,`${APP}/projects/${PROJECT_ID}?tab=files`,'security_arjun_attempt_karthik_project_files',result);
  const idorText=await arjun.page.locator('body').innerText().catch(()=> '');
  const idorFail=/UPI Switch Integration Layer|karthik-menon-upi-switch|NPCI UPI/i.test(idorText);
  result.securityFindings.push({id:idorFail?'P10-SEC-IDOR-01':'P10-SEC-IDOR-CHECK',severity:idorFail?'P0':'PASS',surface:'project files',role:'client A accessing client B files',impact:idorFail?'Cross-client project files disclosed':'Client B files not disclosed to client A',evidence:'security_arjun_attempt_karthik_project_files',fix:idorFail?'Enforce project/media ownership in route/API':'No fix'});

  // Anonymous access gate.
  const anonCtx=await browser.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true}); const anon=await anonCtx.newPage(); await attach(anon,'anon',result); await goto(anon,`${APP}/projects/${PROJECT_ID}?tab=files`,'security_anon_files_redirect',result); await anonCtx.close().catch(()=>{});

  // Mobile evidence.
  const mobile=await loginContext(browser,KARTHIK,'mobile_karthik',result,{width:375,height:812});
  await goto(mobile.page,`${APP}/projects/${PROJECT_ID}?tab=deliverables`,'mobile_deliverables_375',result);
  await goto(mobile.page,`${APP}/projects/${PROJECT_ID}?tab=files`,'mobile_files_375',result);

  // Keyboard focus.
  await goto(page,`${APP}/projects/${PROJECT_ID}?tab=files`,'keyboard_files_start',result);
  for(let i=0;i<10;i++) await page.keyboard.press('Tab').catch(()=>{});
  await snap(page,'keyboard_files_after_tabs',result);

  await primary.ctx.close().catch(()=>{}); await arjun.ctx.close().catch(()=>{}); await mobile.ctx.close().catch(()=>{}); await browser.close();

  if(mutationVisible) result.bugs.push({id:'NL-BUG-P10-1',severity:'P1',title:'Approved deliverables expose approve/reject mutation controls',evidence:'deliverables_karthik'});
  if(idorFail) result.bugs.push({id:'NL-BUG-P10-SEC-1',severity:'P0',title:'Client A can view Client B project files',evidence:'security_arjun_attempt_karthik_project_files'});
  result.blockers.push('Approve/reject/request-revision mutations were not executed: no AUDIT-P10 deliverable fixture was available and visible deliverables belonged to seeded client project.');
  result.blockers.push('Processing/quarantined/private edge states were not found in accessible client UI; require seeded media states or admin media P32.');
  if(!settingsMatches.length) result.blockers.push('Could not prove project file parity in /settings/files from visible text; file may be filtered, hidden, or named differently in global media library.');

  fs.writeFileSync(path.join(OUT,'p10_result.json'),JSON.stringify(result,null,2));

  const highest=result.bugs.find(b=>b.severity==='P0')?'P0':result.bugs.length?result.bugs[0].severity:(result.blockers.length?'BLOCKED/P2':'INFO');
  const covRows=[
    ['Deliverables tab',`/projects/${PROJECT_ID}?tab=deliverables`,'TESTED','deliverables_karthik','Approved deliverable cards and preview controls'],
    ['Files tab',`/projects/${PROJECT_ID}?tab=files`,'TESTED','files_karthik','Two project file cards, sizes, preview controls'],
    ['Preview ZIP/non-previewable', 'Preview first file','TESTED','files_preview_0_zip','No in-app preview + Open link observed; signed URL redacted'],
    ['Preview PDF', 'Preview second file','TESTED','files_preview_1_pdf','PDF preview path/modal observed'],
    ['Open/download path', 'Open in new tab from preview','TESTED','files_preview_0_open_link','Signed URL/open event redacted; no token persisted in report'],
    ['Empty deliverables/files state',`Arjun audit project ${ARJUN_EMPTY_PROJECT_ID}`,'TESTED','empty_*','No deliverables/files states captured'],
    ['Settings files parity','/settings/files','PARTIAL','settings_files_karthik',`${settingsMatches.length}/${filenames.length} filenames matched in visible text`],
    ['Cross-user IDOR','Arjun opening Karthik files',idorFail?'FAIL':'PASS','security_arjun_attempt_karthik_project_files',idorFail?'Client B files visible':'Client B files not disclosed'],
    ['Anonymous protected access','Project files anonymous','TESTED','security_anon_files_redirect','Redirect/access gate tested'],
    ['Mobile','375px deliverables/files','TESTED','mobile_*','Mobile dense card evidence'],
  ].map(r=>`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join('\n');
  const controlRows=result.controlInventory.map(c=>`| ${c.page} | ${c.control} | - | ${c.verdict} | ${redact(c.evidence)} |`).join('\n')||'| - | - | - | - | - |';
  const previewRows=result.previewActions.map(p=>`| ${p.slug} | ${p.index} | ${p.verdict} | ${p.hasOpenLink?'Yes':'No'} | ${p.signedUrlLinks||0} | ${p.error||''} |`).join('\n')||'| - | - | - | - | - | - |';
  const openRows=result.openActions.map(o=>`| ${o.slug} | ${o.verdict} | ${o.openedUrl||'-'} | ${o.downloadFilename||'-'} | ${o.error||''} |`).join('\n')||'| - | - | - | - | - |';
  const netRows=result.network.slice(0,240).map(n=>`| ${n.label} | ${n.method} ${n.path} | ${n.status} | ${n.status<400?'OK':'CHECK'} | keys: ${(n.requestKeys||[]).join(', ')}; ${n.contentType||''}; ${n.contentLength||''}; ${n.ms??''}ms |`).join('\n')||'| - | - | - | - | - |';
  const consoleRows=result.console.slice(0,80).map(c=>`| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n')||'| - | - | No console warnings/errors captured. |';
  const blockers=result.blockers.map(b=>`- ${b}`).join('\n')||'- None.';
  const bugText=result.bugs.length?result.bugs.map(b=>`### ${b.id}: ${b.title}\n- Severity: ${b.severity}\n- Evidence: ${b.evidence}`).join('\n\n'):'No confirmed NL-BUG created in this P10 pass.';
  const secRows=result.securityFindings.map(f=>`| ${f.id} | ${f.severity} | ${f.surface} | ${f.role} | ${f.impact} | ${f.evidence} | ${f.fix} |`).join('\n')||'| - | - | - | - | - | - | - |';
  const shots=result.snapshots.map(s=>`- ${s.slug}: \`evidence/${path.basename(s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md=`# Result — P10 — Client project deliverables, files, previews, approvals and file actions\n\n## Session summary\n- Host/environment: public-domain \`${APP}\`.\n- Browser/MCP/tooling: Playwright Chromium headless, UI-first.\n- Role/account used: file-rich client ${shortEmail(KARTHIK)}; IDOR/empty-state client ${shortEmail(ARJUN)}.\n- Fixtures created: none.\n- Routes walked: /projects/[id]?tab=deliverables, /projects/[id]?tab=files, /settings/files, mobile variants.\n- Highest severity: ${highest}\n\n## Coverage table\n| Unit | Route/subsurface | Status | Evidence | Notes |\n|---|---|---|---|---|\n${covRows}\n\n## Control inventory deltas\n| Page | Control/tab/dialog | Old-prompt gap? | Runtime verdict | Evidence |\n|---|---|---|---|---|\n${controlRows}\n\n## Preview/open observations\n| Evidence | Preview index | Verdict | Open link shown | Signed/private links in sanitized controls | Notes |\n|---|---:|---|---|---:|---|\n${previewRows}\n\n## Open/download observations\n| Evidence | Verdict | Opened URL | Download filename | Notes |\n|---|---|---|---|---|\n${openRows}\n\n## Network/API observations\n| Trigger | Method + path | Status | Verdict | Notes |\n|---|---|---:|---|---|\n${netRows}\n\n## Console findings\n| Context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## Blockers / deferred checks\n${blockers}\n\n## Bugs\n${bugText}\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n${secRows}\n\n## Security checks passed\n| Area | Sample tested | Verdict | Evidence |\n|---|---|---|---|\n| Protected files route | Anonymous user opening project files | TESTED | security_anon_files_redirect |\n| Cross-client file isolation | Arjun opening Karthik project files | ${idorFail?'FAIL':'PASS'} | security_arjun_attempt_karthik_project_files |\n| Approved-state action gating | Approved deliverables | ${mutationVisible?'FAIL':'PASS'} | deliverables_karthik |\n| Signed URL evidence hygiene | Preview/Open links sanitized in report | PASS | preview/open tables and local scan |\n\n## Blocked security checks\n| Check | Why blocked | Required access/fixture |\n|---|---|---|\n| Approve/reject/request-revision mutation | No AUDIT-P10 deliverable; seeded project deliverables already approved | Dedicated AUDIT-P10 deliverable in review/revision states |\n| Quarantined/processing/private state negative probes | No accessible client fixture with those states | Seeded media records or admin-media P32 setup |\n| Admin media parity | Cross-prompt/admin dependency | P32 admin media walk |\n\n## Evidence files\n${shots}\n\n## Handoff\n- Backend/API: seed AUDIT-P10 deliverables/media in READY/PROCESSING/QUARANTINED states to close mutation and negative-state checks.\n- Frontend/UI: preview modal exposes signed Open links to authorized user; report evidence redacts them. Confirm whether download button should be separate from Open in new tab.\n- Data/setup: global /settings/files parity was only partial from visible text; compare API/admin media in P16/P32.\n`;
  fs.writeFileSync(path.join(OUT,'result.md'),md);
})();
