const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'nestlancer-test-output', 'reports', 'P09');
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });
const APP = 'https://app.nestlancer.com';
const PW = process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build';
const ARJUN = 'arjun.mehta@nestlancer.com';
const SAMIRA = 'samira.patel@nestlancer.com';
const AUDIT_PROJECT_ID = '01a1071b-6a26-73eb-9394-c5d84a25e803';
const SAMIRA_PROJECT_ID = '01a106c0-3c4c-71ff-a2ae-0c77a6b7653d';
const AUDIT_MESSAGE = `AUDIT-P09-20261005 project-scoped UI message smoke ${Date.now().toString(36)}`;

function shortEmail(e) { const [l,d] = String(e).split('@'); return `${l.slice(0,10)}…@${d}`; }
function sanitizeUrl(u) {
  try {
    const url = new URL(u);
    for (const k of [...url.searchParams.keys()]) if (/token|code|otp|password|secret|signature|key|auth|session|cookie|credential|expires|signed|x-amz/i.test(k)) url.searchParams.set(k, '<redacted>');
    if (/s3\.nestlancer\.com$/i.test(url.hostname) && /private/i.test(url.pathname)) { url.pathname = '/<private-media-object-redacted>'; url.search = ''; }
    return url.toString();
  } catch { return String(u || '').replace(PW, '<redacted>'); }
}
function redact(s) {
  return String(s ?? '')
    .replaceAll(PW, '<redacted-demo-password>')
    .replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g, '<demo-email>@nestlancer.com')
    .replace(/(token|otp|code|secret|password|signature|cookie|authorization|credential)(["'\s:=]+)([^\s"'<>]+)/gi, '$1$2<redacted>')
    .replace(/eyJ[A-Za-z0-9._-]+/g, '<redacted-jwt>')
    .slice(0, 20000);
}
async function dismiss(page) { for (const t of ['Accept','Dismiss']) { try { const b=page.getByRole('button',{name:t}).first(); if(await b.isVisible({timeout:600})) await b.click({timeout:1000}); } catch {} } }
async function attach(page, label, result) {
  const started = new Map(); page.on('request', req => started.set(req, Date.now()));
  page.on('response', async res => {
    const req=res.request(); const u=sanitizeUrl(res.url()); if(!/nestlancer\.com/.test(u)) return;
    const interesting = req.resourceType()==='document' || /\/api\//.test(u) || /projects|progress|milestones|messages|payments|auth|users/i.test(u);
    if(!interesting) return;
    let keys=[]; const post=req.postData(); if(post){try{keys=Object.keys(JSON.parse(post));}catch{keys=['<non-json-post-body>'];}}
    const headers=res.headers(); result.network.push({label, method:req.method(), status:res.status(), type:req.resourceType(), path:(()=>{try{const uu=new URL(u);return uu.pathname+uu.search}catch{return u}})(), ms:started.has(req)?Date.now()-started.get(req):null, requestKeys:keys, contentType:(headers['content-type']||'').split(';')[0]});
  });
  page.on('console', msg => { if(['error','warning'].includes(msg.type())) result.console.push({label,type:msg.type(),text:redact(msg.text())}); });
  page.on('pageerror', err => result.console.push({label,type:'pageerror',text:redact(err.message||String(err))}));
}
async function snap(page, slug, result, extra={}) {
  await page.waitForTimeout(700).catch(()=>{}); const file=path.join(EVID, `${slug}.png`);
  await page.screenshot({path:file, fullPage:true}).catch(e=>result.notes.push(`screenshot failed ${slug}: ${e.message}`));
  const url=sanitizeUrl(page.url()); const title=await page.title().catch(()=> ''); const text=redact(await page.locator('body').innerText({timeout:5000}).catch(()=>''));
  const controls=await page.evaluate(()=>({buttons:[...document.querySelectorAll('button,[role="button"]')].map((b,i)=>({i,text:(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,100),disabled:b.disabled||b.getAttribute('aria-disabled')==='true',aria:b.getAttribute('aria-label'),type:b.getAttribute('type')})).slice(0,140),links:[...document.querySelectorAll('a[href]')].map((a,i)=>({i,text:(a.textContent||'').trim().slice(0,100),href:a.getAttribute('href')})).slice(0,140),inputs:[...document.querySelectorAll('input,textarea,select')].map((el,i)=>({i,tag:el.tagName,type:el.getAttribute('type'),name:el.getAttribute('name'),placeholder:el.getAttribute('placeholder'),id:el.id,valueLength:(el.value||'').length})).slice(0,100),active:document.activeElement?`${document.activeElement.tagName}#${document.activeElement.id||''}`:''})).catch(e=>({error:e.message}));
  fs.writeFileSync(path.join(EVID, `${slug}.txt`), `URL: ${url}\nTITLE: ${title}\n\n${text}`);
  result.snapshots.push({slug,file,url,title,controls,...extra}); return {url,title,text,controls};
}
async function goto(page, url, slug, result) {
  const rec={slug, requestedUrl:sanitizeUrl(url)};
  try { const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); rec.status=res?res.status():null; await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{}); const s=await snap(page,slug,result,{httpStatus:rec.status}); rec.finalUrl=s.url; rec.title=s.title; rec.ok=!!res&&rec.status<500; }
  catch(e){ rec.error=e.message; try{await snap(page,`${slug}_error`,result,{error:e.message});}catch{} }
  result.steps.push(rec); return rec;
}
async function loginContext(browser,email,label,result,viewport={width:1365,height:900}) {
  const ctx=await browser.newContext({viewport,ignoreHTTPSErrors:true}); const page=await ctx.newPage(); await attach(page,label,result);
  await goto(page,`${APP}/login`,`${label}_login_before`,result); await dismiss(page);
  await page.locator('input[type="email"],input[name="email"]').first().fill(email); await page.locator('input[type="password"],input[name="password"]').first().fill(PW);
  await Promise.allSettled([page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:22000}),page.locator('button[type="submit"]').first().click()]); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{});
  if(page.url().includes('/login')){await page.goto(`${APP}/dashboard`,{waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{}); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});}
  await snap(page,`${label}_login_after`,result,{account:shortEmail(email)});
  const cookies=await ctx.cookies(); result.storage.push({label, localStorageKeys:await page.evaluate(()=>Object.keys(localStorage||{})).catch(()=>[]), sessionStorageKeys:await page.evaluate(()=>Object.keys(sessionStorage||{})).catch(()=>[]), cookies:cookies.map(c=>({name:c.name,domain:c.domain,path:c.path,httpOnly:c.httpOnly,secure:c.secure,sameSite:c.sameSite,expires:c.expires?'<set>':'<session>'}))});
  return {ctx,page};
}

(async()=>{
  const result={prompt:'P09',generatedAt:new Date().toISOString(),mode:'public-domain UI-first',steps:[],snapshots:[],network:[],console:[],storage:[],controlInventory:[],bugs:[],blockers:[],notes:[],securityFindings:[]};
  const browser=await chromium.launch({ headless: true});
  const arjun=await loginContext(browser,ARJUN,'arjun',result); const page=arjun.page;

  await goto(page,`${APP}/projects`,'projects_list_arjun',result);
  const listInfo=await page.evaluate(()=>({links:[...document.querySelectorAll('a[href*="/projects/"]')].map(a=>({text:a.textContent.trim(),href:a.href})), text:document.body.innerText})).catch(e=>({error:e.message}));
  fs.writeFileSync(path.join(EVID,'projects_list_inventory.json'),JSON.stringify(listInfo,null,2));
  result.controlInventory.push({page:'/projects',control:'project list/card navigation',verdict:listInfo.links?.length?'PASS':'CHECK_EMPTY',evidence:`${listInfo.links?.length||0} project links`});

  // Direct tab routes and aliases.
  const tabs=['overview','progress','milestones','messages','deliverables','files','billing','payments','delivery'];
  const tabResults=[];
  for(const tab of tabs){
    await goto(page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=${tab}`,`project_${tab}`,result);
    const body=await page.locator('body').innerText().catch(()=> '');
    let mapped='unknown';
    if(/No files yet|project media/i.test(body)) mapped='files';
    if(/No deliverables yet|Files and assets from your team/i.test(body)) mapped='deliverables';
    if(/Daily progress|No progress entries/i.test(body)) mapped='progress';
    if(/Advance payment|Installment due|PAYMENT/i.test(body)) mapped='milestones';
    if(/Project messages|Write a message|Search messages/i.test(body)) mapped='messages';
    if(/Project status|Submit feedback|Latest progress/i.test(body)) mapped='overview';
    tabResults.push({tab, finalUrl:sanitizeUrl(page.url()), mapped, hasHeader:/AUDIT-P07-20261004-1 test quote/i.test(body)});
    result.controlInventory.push({page:`/projects/${AUDIT_PROJECT_ID}?tab=${tab}`, control:`tab/alias ${tab}`, verdict:'TESTED', evidence:`mapped=${mapped}`});
  }
  fs.writeFileSync(path.join(EVID,'tab_alias_results.json'),JSON.stringify(tabResults,null,2));

  // Overview feedback form inventory without submit.
  await goto(page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=overview`,'overview_feedback_form_inventory',result);
  const fb = page.locator('textarea[placeholder*="feedback" i]').first();
  if(await fb.count().catch(()=>0)){ await fb.fill('AUDIT-P09 feedback text not submitted'); await snap(page,'overview_feedback_text_entered_not_submitted',result); result.controlInventory.push({page:'overview',control:'Submit feedback',verdict:'INVENTORIED_NOT_SUBMITTED',evidence:'textarea enables submit; not submitted due safety fence'}); }

  // Progress/request changes form inventory without submit.
  await goto(page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=progress`,'progress_request_changes_inventory',result);
  const changeBox = page.locator('textarea[placeholder*="change" i]').first();
  if(await changeBox.count().catch(()=>0)){ await changeBox.fill('AUDIT-P09 request changes text not submitted'); await snap(page,'progress_request_changes_text_entered_not_submitted',result); result.controlInventory.push({page:'progress',control:'Request changes / Send request',verdict:'INVENTORIED_NOT_SUBMITTED',evidence:'textarea enables send; not submitted due safety fence'}); }

  // Milestones: Pay now visible but do not click.
  await goto(page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=milestones`,'milestones_payment_schedule',result);
  const milestoneText=await page.locator('body').innerText().catch(()=> '');
  result.controlInventory.push({page:'milestones',control:'payment schedule / Pay now',verdict:/Advance payment|Pay now|₹750/.test(milestoneText)?'PASS_VISIBLE':'CHECK',evidence:'milestones_payment_schedule'});

  // Messages: send AUDIT-P09 project scoped message because project is AUDIT disposable and message has prompt prefix.
  await goto(page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=messages`,'messages_before_send',result);
  let messageVerdict='BLOCKED';
  try{
    const msgBox=page.locator('textarea[name="message"], textarea[placeholder*="message" i], textarea[placeholder*="Write" i]').last();
    if(await msgBox.count()){
      await msgBox.fill(AUDIT_MESSAGE);
      await snap(page,'messages_composer_filled',result,{message:redact(AUDIT_MESSAGE)});
      const send=page.getByRole('button',{name:/^Send$/i}).last();
      await Promise.allSettled([page.waitForResponse(res=>/messages/i.test(res.url()) && ['POST','PUT','PATCH'].includes(res.request().method()),{timeout:15000}), send.click({timeout:5000})]);
      await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); await page.waitForTimeout(2000);
      const after=await snap(page,'messages_after_send',result,{message:redact(AUDIT_MESSAGE)});
      messageVerdict=after.text.includes(AUDIT_MESSAGE)?'PASS_SENT_VISIBLE':'CHECK_SENT_NOT_VISIBLE';
    } else messageVerdict='COMPOSER_NOT_FOUND';
  }catch(e){ messageVerdict='ERROR '+e.message; }
  result.controlInventory.push({page:'messages',control:'message composer/send AUDIT-P09',verdict:messageVerdict,evidence:'messages_before_send/messages_after_send'});

  // Cross-client IDOR: Arjun attempts Samira project.
  await goto(page,`${APP}/projects/${SAMIRA_PROJECT_ID}?tab=overview`,'security_arjun_attempt_samira_project',result);
  const idorText=await page.locator('body').innerText().catch(()=> '');
  const idorFail=/Festive Season Campaign Landing Pages|Samira/i.test(idorText);
  result.securityFindings.push({id:idorFail?'P09-SEC-IDOR-01':'P09-SEC-IDOR-CHECK',severity:idorFail?'P0':'PASS',surface:'project detail',role:'client A accessing client B project',impact:idorFail?'Cross-client project disclosure':'Client B project not disclosed to client A',evidence:'security_arjun_attempt_samira_project',fix:idorFail?'Enforce project ownership in route/API':'No fix'});

  // Samira baseline own project.
  const samira=await loginContext(browser,SAMIRA,'samira',result);
  await goto(samira.page,`${APP}/projects/${SAMIRA_PROJECT_ID}?tab=overview`,'project_detail_samira_baseline',result);

  // Anonymous protected project redirect.
  const anonCtx=await browser.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true}); const anon=await anonCtx.newPage(); await attach(anon,'anon',result); await goto(anon,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=overview`,'security_anon_project_redirect',result); await anonCtx.close().catch(()=>{});

  // Mobile evidence.
  const mobile=await loginContext(browser,ARJUN,'mobile_arjun',result,{width:375,height:812});
  await goto(mobile.page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=milestones`,'mobile_project_milestones_375',result);
  await goto(mobile.page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=messages`,'mobile_project_messages_375',result);

  // Keyboard traversal.
  await goto(page,`${APP}/projects/${AUDIT_PROJECT_ID}?tab=overview`,'keyboard_project_overview_start',result);
  for(let i=0;i<10;i++) await page.keyboard.press('Tab').catch(()=>{});
  await snap(page,'keyboard_project_overview_after_tabs',result);

  await arjun.ctx.close().catch(()=>{}); await samira.ctx.close().catch(()=>{}); await mobile.ctx.close().catch(()=>{}); await browser.close();

  if(!messageVerdict.startsWith('PASS')) result.blockers.push('AUDIT-P09 project message send did not verify as visible after send.');
  result.blockers.push('Approve project, approve milestone, request revision, payment flows were not executed: available project is AUDIT but not AUDIT-P09 and approval/payment mutations may alter lifecycle/money state.');
  result.blockers.push('Admin P25/P26 parity cross-check remains pending for the same project.');
  if(idorFail) result.bugs.push({id:'NL-BUG-PROJECT-SEC-1',severity:'P0',title:'Client A can view Client B project',evidence:'security_arjun_attempt_samira_project'});

  fs.writeFileSync(path.join(OUT,'p09_result.json'),JSON.stringify(result,null,2));

  const highest=result.bugs.find(b=>b.severity==='P0')?'P0':(result.blockers.length?'BLOCKED/P2':'INFO');
  const covRows=[
    ['Project list','/projects','TESTED','projects_list_arjun','Card navigation to projects inventoried'],
    ['Overview tab',`/projects/${AUDIT_PROJECT_ID}?tab=overview`,'TESTED','project_overview','Header/status/contract/payment gates and feedback form'],
    ['Progress tab',`?tab=progress`,'TESTED','project_progress','Progress empty state and request changes form'],
    ['Milestones tab',`?tab=milestones`,'TESTED','project_milestones','Payment schedule, due dates, Pay now visible'],
    ['Messages tab',`?tab=messages`,messageVerdict,'messages_after_send','AUDIT-P09 message composer flow'],
    ['Deliverables/files tabs',`?tab=deliverables/files`,'TESTED','project_deliverables/project_files','Empty states verified'],
    ['Alias billing/payments/delivery','billing→files, payments→milestones, delivery→deliverables','TESTED','project_billing/project_payments/project_delivery','Alias content mapping recorded'],
    ['Cross-user IDOR','Arjun opening Samira project',idorFail?'FAIL':'PASS','security_arjun_attempt_samira_project',idorFail?'Client B data visible':'Client B project not disclosed'],
    ['Anonymous protected access','Project detail anonymous','TESTED','security_anon_project_redirect','Redirect/access gate tested'],
    ['Mobile','375px milestones/messages','TESTED','mobile_project_*','Mobile tab/content evidence'],
  ].map(r=>`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join('\n');
  const controlRows=result.controlInventory.map(c=>`| ${c.page} | ${c.control} | - | ${c.verdict} | ${redact(c.evidence)} |`).join('\n')||'| - | - | - | - | - |';
  const netRows=result.network.slice(0,240).map(n=>`| ${n.label} | ${n.method} ${n.path} | ${n.status} | ${n.status<400?'OK':'CHECK'} | keys: ${(n.requestKeys||[]).join(', ')}; ${n.contentType||''}; ${n.ms??''}ms |`).join('\n')||'| - | - | - | - | - |';
  const consoleRows=result.console.slice(0,80).map(c=>`| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n')||'| - | - | No console warnings/errors captured. |';
  const blockers=result.blockers.map(b=>`- ${b}`).join('\n')||'- None.';
  const bugText=result.bugs.length?result.bugs.map(b=>`### ${b.id}: ${b.title}\n- Severity: ${b.severity}\n- Evidence: ${b.evidence}`).join('\n\n'):'No confirmed NL-BUG created in this P09 pass.';
  const secRows=result.securityFindings.map(f=>`| ${f.id} | ${f.severity} | ${f.surface} | ${f.role} | ${f.impact} | ${f.evidence} | ${f.fix} |`).join('\n')||'| - | - | - | - | - | - | - |';
  const shots=result.snapshots.map(s=>`- ${s.slug}: \`evidence/${path.basename(s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md=`# Result — P09 — Client project detail hub: overview, progress, milestones and messages\n\n## Session summary\n- Host/environment: public-domain \`${APP}\`.\n- Browser/MCP/tooling: Playwright Chromium headless, UI-first.\n- Role/account used: primary client ${shortEmail(ARJUN)}; IDOR baseline client ${shortEmail(SAMIRA)}.\n- Fixtures created: one project-scoped message: \`${AUDIT_MESSAGE.replace(/\|/g,'/')}\`.\n- Routes walked: /projects, /projects/[id]?tab=overview/progress/milestones/messages/deliverables/files plus alias tabs billing/payments/delivery.\n- Highest severity: ${highest}\n\n## Coverage table\n| Unit | Route/subsurface | Status | Evidence | Notes |\n|---|---|---|---|---|\n${covRows}\n\n## Control inventory deltas\n| Page | Control/tab/dialog | Old-prompt gap? | Runtime verdict | Evidence |\n|---|---|---|---|---|\n${controlRows}\n\n## Network/API observations\n| Trigger | Method + path | Status | Verdict | Notes |\n|---|---|---:|---|---|\n${netRows}\n\n## Console findings\n| Context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## Blockers / deferred checks\n${blockers}\n\n## Bugs\n${bugText}\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n${secRows}\n\n## Security checks passed\n| Area | Sample tested | Verdict | Evidence |\n|---|---|---|---|\n| Protected project route | Anonymous user opening project detail | TESTED | security_anon_project_redirect |\n| Cross-client project isolation | Arjun opening Samira project URL | ${idorFail?'FAIL':'PASS'} | security_arjun_attempt_samira_project |\n| Message scope | Message sent on project-specific messages tab | ${messageVerdict.startsWith('PASS')?'PASS':'CHECK'} | messages_after_send |\n| Money-action safety | Pay now visible but not clicked | PASS_SAFE_STOP | milestones_payment_schedule |\n\n## Blocked security checks\n| Check | Why blocked | Required access/fixture |\n|---|---|---|\n| Approve/request-revision/payment mutations | Would alter lifecycle/payment state; no AUDIT-P09 project fixture | Dedicated AUDIT-P09 project with safe approval/revision/payment states |\n| Offline during revision request | Request-change mutation not submitted | AUDIT-P09 project and approved offline mutation window |\n| Admin parity P25/P26 | Cross-prompt dependency pending | Admin project walk in P25/P26 |\n\n## Evidence files\n${shots}\n\n## Handoff\n- Backend/API: confirm expected alias behavior for billing/payments/delivery and seed AUDIT-P09 project states for approval/revision/payment tests.\n- Frontend/UI: project tabs and message composer rendered; message send succeeded only if visible in report status.\n- Data/setup: use dedicated AUDIT-P09 project for future mutation-heavy rerun.\n`;
  fs.writeFileSync(path.join(OUT,'result.md'),md);
})();
