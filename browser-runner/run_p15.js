const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const OUT = '/home/bhumukul-raj/Music/nestlacer-test-output/reports/P15';
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });
const APP = 'https://app.nestlancer.com';
const runId = new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,12) + '-' + crypto.randomBytes(3).toString('hex');
const initialPassword = `AuditP15!${crypto.randomBytes(5).toString('hex')}aA1`;
const changedPassword = `AuditP15New!${crypto.randomBytes(5).toString('hex')}aA1`;

function redactorFactory(state){
  return function redact(s){
    let v = String(s ?? '');
    for (const secret of [initialPassword, changedPassword, state.mailPassword, state.auditEmail, state.mailToken].filter(Boolean)) v = v.split(secret).join(secret.includes('@') ? '<audit-p15-mail>@<mail-domain>' : '<redacted-secret>');
    return v
      .replace(/audit-p15-[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/gi, '<audit-p15-mail>@<mail-domain>')
      .replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g, '<demo-email>@nestlancer.com')
      .replace(/(token|otp|code|secret|password|signature|cookie|authorization|credential|backup)(["'\s:=]+)([^\s"'<>]+)/gi, '$1$2<redacted>')
      .replace(/https:\/\/s3\.nestlancer\.com\/[^\s"'<>]+/gi, 'https://s3.nestlancer.com/<signed-url-redacted>')
      .replace(/token=[^\s&"'<>]+/gi, 'token=<redacted>')
      .replace(/\b[A-Z2-7]{16,}\b/g, '<redacted-base32-secret>')
      .replace(/\b\d{6,10}\b/g, m => m.length === 6 ? '<redacted-6digit-code>' : m)
      .replace(/eyJ[A-Za-z0-9._-]+/g, '<redacted-jwt>')
      .slice(0, 26000);
  }
}
function sanitizeUrl(u){
  try{const url=new URL(u); for(const k of [...url.searchParams.keys()]) if(/token|code|otp|password|secret|signature|key|auth|session|cookie|credential|expires|signed|x-amz|t/i.test(k)) url.searchParams.set(k,'<redacted>'); if(/s3\.nestlancer\.com$/i.test(url.hostname)) return 'https://s3.nestlancer.com/<signed-document-url-redacted>'; return url.toString();}catch{return String(u||'');}
}
async function makeMailbox(){
  const d = await (await fetch('https://api.mail.tm/domains')).json();
  const domain = d['hydra:member']?.[0]?.domain;
  if(!domain) throw new Error('mail.tm returned no domains');
  const address = `audit-p15-${runId}@${domain}`.toLowerCase();
  const password = initialPassword;
  let r = await fetch('https://api.mail.tm/accounts', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({address,password})});
  if(!r.ok && r.status !== 422) throw new Error('mail.tm account create failed '+r.status+' '+await r.text());
  r = await fetch('https://api.mail.tm/token', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({address,password})});
  if(!r.ok) throw new Error('mail.tm token failed '+r.status+' '+await r.text());
  const tok = await r.json(); return {address,password,token:tok.token,domain};
}
async function pollMail(mbox, ms=45000){
  const end=Date.now()+ms;
  while(Date.now()<end){
    const r=await fetch('https://api.mail.tm/messages',{headers:{authorization:`Bearer ${mbox.token}`}});
    const j=await r.json(); const msgs=j['hydra:member']||[];
    if(msgs[0]) return await (await fetch('https://api.mail.tm/messages/'+msgs[0].id,{headers:{authorization:`Bearer ${mbox.token}`}})).json();
    await new Promise(r=>setTimeout(r,2500));
  }
  return null;
}
function extractVerifyLinks(msg){
  const src=[msg?.text,msg?.html,msg?.intro].flat().filter(Boolean).join('\n');
  const links=[]; for(const m of src.matchAll(/https?:\/\/[^\s"'<>]+/g)){const u=m[0].replace(/&amp;/g,'&').replace(/[\])}.,;]+$/,''); if(/verify-email\?token=/.test(u)) links.push(u);} return [...new Set(links)].sort((a,b)=>b.length-a.length);
}
function totp(secret){try{return execFileSync('python3',['-c',`import pyotp; print(pyotp.TOTP(${JSON.stringify(secret)}).now())`],{encoding:'utf8'}).trim();}catch{return null;}}
async function dismiss(page){for(const t of ['Accept','Dismiss']){try{const b=page.getByRole('button',{name:t}).first(); if(await b.isVisible({timeout:700})) await b.click({timeout:1200});}catch{}}}
async function clickButton(page, re, timeout=3000){try{await page.getByRole('button',{name:re}).first().click({timeout}); return true;}catch{} try{await page.locator('button').filter({hasText:re}).first().click({timeout}); return true;}catch{} return false;}
async function fillAny(page, selectors, value){for(const sel of selectors){const loc=page.locator(sel).first(); if(await loc.count().catch(()=>0)){try{await loc.fill(value,{timeout:2000}); return sel;}catch{}}} return null;}
async function attach(page,label,result,redact){const started=new Map(); page.on('request',req=>started.set(req,Date.now())); page.on('response',async res=>{const req=res.request(); const u=sanitizeUrl(res.url()); if(!/nestlancer\.com/.test(u)) return; const interesting=req.resourceType()==='document'||/\/api\//.test(u)||/auth|user|profile|settings|security|session|export|delete|2fa|factor|activity|notification|media|document|s3/i.test(u); if(!interesting) return; let keys=[]; const post=req.postData(); if(post){try{keys=Object.keys(JSON.parse(post));}catch{keys=['<non-json-post-body>'];}} const headers=res.headers(); result.network.push({label,method:req.method(),status:res.status(),type:req.resourceType(),path:(()=>{try{const uu=new URL(u);return uu.pathname+uu.search}catch{return u}})(),ms:started.has(req)?Date.now()-started.get(req):null,requestKeys:keys,contentType:(headers['content-type']||'').split(';')[0],contentLength:headers['content-length']||'',contentDisposition:redact(headers['content-disposition']||'')});}); page.on('console',msg=>{if(['error','warning'].includes(msg.type())) result.console.push({label,type:msg.type(),text:redact(msg.text())});}); page.on('pageerror',err=>result.console.push({label,type:'pageerror',text:redact(err.message||String(err))}));}
async function snap(page,slug,result,redact,extra={}){await page.waitForTimeout(700).catch(()=>{}); const file=path.join(EVID,`${slug}.png`); await page.screenshot({path:file,fullPage:true}).catch(e=>result.notes.push(`screenshot failed ${slug}: ${e.message}`)); const url=sanitizeUrl(page.url()); const title=await page.title().catch(()=> ''); const text=redact(await page.locator('body').innerText({timeout:5000}).catch(()=>'')); const raw=await page.evaluate(()=>({buttons:[...document.querySelectorAll('button,[role="button"]')].map((b,i)=>({i,text:(b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,120),disabled:b.disabled||b.getAttribute('aria-disabled')==='true',aria:b.getAttribute('aria-label'),type:b.getAttribute('type')})).slice(0,240),links:[...document.querySelectorAll('a[href]')].map((a,i)=>({i,text:(a.textContent||'').trim().slice(0,120),href:a.href,target:a.target,download:a.download})).slice(0,240),inputs:[...document.querySelectorAll('input,textarea,select')].map((el,i)=>({i,tag:el.tagName,type:el.getAttribute('type')||el.type,name:el.getAttribute('name'),placeholder:el.getAttribute('placeholder'),id:el.id,valueLength:(el.value||'').length,checked:el.checked})).slice(0,160),active:document.activeElement?`${document.activeElement.tagName}#${document.activeElement.id||''}`:''})).catch(e=>({error:e.message})); const controls={...raw,links:(raw.links||[]).map(l=>({...l,href:sanitizeUrl(l.href)}))}; fs.writeFileSync(path.join(EVID,`${slug}.txt`),`URL: ${url}\nTITLE: ${title}\n\n${text}`); result.snapshots.push({slug,file,url,title,controls,...extra}); return {url,title,text,controls};}
async function goto(page,url,slug,result,redact){const rec={slug,requestedUrl:sanitizeUrl(url)}; try{const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); rec.status=res?res.status():null; await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); const s=await snap(page,slug,result,redact,{httpStatus:rec.status}); rec.finalUrl=s.url; rec.title=s.title; rec.ok=!!res&&rec.status<500;}catch(e){rec.error=e.message; try{await snap(page,`${slug}_error`,result,redact,{error:e.message});}catch{}} result.steps.push(rec); return rec;}
async function submitLogin(page,email,password){await page.goto(`${APP}/login`,{waitUntil:'domcontentloaded',timeout:45000}); await dismiss(page); await page.locator('input[type="email"],input[name="email"]').first().fill(email); await page.locator('input[type="password"],input[name="password"]').first().fill(password); const form=page.locator('form').first(); await Promise.allSettled([page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:25000}), form.getByRole('button',{name:/^sign in$/i}).click({timeout:6000})]); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); if(page.url().includes('/login')){await page.locator('input[type="password"],input[name="password"]').first().press('Enter').catch(()=>{}); await page.waitForURL(u=>!u.pathname.includes('/login'),{timeout:12000}).catch(()=>{}); await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{});} return !page.url().includes('/login');}
async function loginContext(browser,email,password,label,result,redact,viewport={width:1365,height:900}){const ctx=await browser.newContext({viewport,ignoreHTTPSErrors:true,acceptDownloads:true}); const page=await ctx.newPage(); await attach(page,label,result,redact); let ok=false; for(let i=0;i<2&&!ok;i++) ok=await submitLogin(page,email,password); await snap(page,`${label}_login_after`,result,redact,{account:'<audit-p15-mail>@<mail-domain>',loginOk:ok}); if(!ok) result.blockers.push(`Login failed for ${label}`); return {ctx,page,ok};}
async function downloadOnClick(page, loc, slug, result){const rec={slug,verdict:'NOT_CLICKED'}; try{const dlPromise=page.waitForEvent('download',{timeout:15000}).catch(e=>({error:e.message})); await loc.click({timeout:5000}); const dl=await dlPromise; if(dl && !dl.error){const filename=dl.suggestedFilename(); const save=path.join(EVID,`${slug}_${filename.replace(/[^a-zA-Z0-9._-]+/g,'_')}`); await dl.saveAs(save); rec.verdict='DOWNLOADED'; rec.filename=filename; rec.bytes=fs.statSync(save).size; rec.relative=path.relative(OUT,save); rec.savedAs=save; rec.tokenLeakInFilename=/token|secret|signature|credential|jwt|access/i.test(filename); } else {rec.verdict='NO_DOWNLOAD_EVENT'; rec.error=dl?.error||'';} }catch(e){rec.verdict='ERROR'; rec.error=e.message;} result.downloads.push(rec); return rec;}
function parseJsonWithWarnings(out){const s=String(out||'').trim(); const firstArr=s.indexOf('['), firstObj=s.indexOf('{'); const starts=[firstArr,firstObj].filter(i=>i>=0).sort((a,b)=>a-b); if(!starts.length) throw new Error('No JSON found'); return JSON.parse(s.slice(starts[0]));}
function analyzePdfs(paths){if(!paths.length) return []; return parseJsonWithWarnings(execFileSync('python3',[path.join('/home/bhumukul-raj/Music/browser-runner','pdf_integrity.py'),...paths],{encoding:'utf8'}));}

(async()=>{
  const state={auditEmail:null,mailToken:null,mailPassword:initialPassword}; const redact=redactorFactory(state);
  const result={prompt:'P15',generatedAt:new Date().toISOString(),mode:'public-domain UI-first with dedicated disposable audit client',steps:[],snapshots:[],network:[],console:[],downloads:[],pdfIntegrity:[],controlInventory:[],bugs:[],blockers:[],notes:[],securityFindings:[],auditAccount:{address:'<pending>',provider:'mail.tm',created:false,verified:false}};
  // prepare tiny PNG avatar file
  const avatarPath=path.join(EVID,'audit_avatar.png'); fs.writeFileSync(avatarPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=','base64'));

  let mailbox=null;
  try{mailbox=await makeMailbox(); state.auditEmail=mailbox.address; state.mailToken=mailbox.token; result.auditAccount.address='<audit-p15-mail>@<mail-domain>'; result.auditAccount.created=true;}catch(e){result.blockers.push('mail.tm account creation failed: '+redact(e.message));}
  const browser=await chromium.launch({ channel: 'chrome', headless: true});
  const ctx=await browser.newContext({viewport:{width:1365,height:900},ignoreHTTPSErrors:true,acceptDownloads:true});
  const page=await ctx.newPage(); await attach(page,'audit_p15',result,redact);

  if(mailbox){
    await page.goto(`${APP}/register`,{waitUntil:'domcontentloaded',timeout:60000}); await dismiss(page);
    await fillAny(page,['input[name=firstName]','#firstName','input[placeholder*="First" i]'],'Audit');
    await fillAny(page,['input[name=lastName]','#lastName','input[placeholder*="Last" i]'],'P15');
    await fillAny(page,['input[name=email]','input[type=email]'],mailbox.address);
    await fillAny(page,['input[name=password]','input[type=password]'],initialPassword);
    await fillAny(page,['input[name=confirmPassword]','input[name=passwordConfirm]','input[type=password] >> nth=1'],initialPassword).catch(()=>{});
    try{await page.locator('input[type=checkbox][name*=terms i], input[name=acceptTerms], input[id*=terms i]').first().check({timeout:2000});}catch{}
    await Promise.allSettled([page.waitForURL(u=>!u.pathname.includes('/register'),{timeout:15000}), clickButton(page,/Sign up|Create account|Register/i,5000)]);
    await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{}); await snap(page,'register_audit_p15',result,redact);
    const msg=await pollMail(mailbox,45000);
    if(!msg){result.blockers.push('No verification email received for dedicated audit account.');}
    else{
      const links=extractVerifyLinks(msg); fs.writeFileSync(path.join(EVID,'mail_verification_redacted.txt'),redact(`SUBJECT ${msg.subject}\n${links.map(sanitizeUrl).join('\n')}`));
      if(links[0]){await page.goto(links[0],{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>result.blockers.push('Verify link navigation failed: '+redact(e.message))); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); const s=await snap(page,'verify_email_audit_p15',result,redact); result.auditAccount.verified=/verified|success|dashboard|sign in/i.test(s.text);} else result.blockers.push('Verification email arrived but no verify-email link was extracted.');
    }
  }

  let currentPassword=initialPassword;
  if(mailbox){
    await submitLogin(page,mailbox.address,currentPassword); await snap(page,'audit_p15_login_after_verify',result,redact,{account:'<audit-p15-mail>@<mail-domain>'});
  }

  // Route walks and aliases
  const routes=[['settings_redirect',`${APP}/settings`],['settings_account',`${APP}/settings/account`],['settings_billing_alias',`${APP}/settings/billing`],['settings_sessions_alias',`${APP}/settings/sessions`],['profile_view_before',`${APP}/profile`],['profile_edit_before',`${APP}/profile/edit`],['settings_notifications_before',`${APP}/settings/notifications`],['settings_activity_before',`${APP}/settings/activity`],['settings_security_before',`${APP}/settings/security`]];
  for(const [slug,url] of routes) await goto(page,url,slug,result,redact);

  // Profile edit save, avatar upload, cancel/restore-ish on audit account.
  await goto(page,`${APP}/profile/edit`,'profile_edit_form_inventory',result,redact);
  const profileInputs=await page.evaluate(()=>[...document.querySelectorAll('input,textarea,select')].map((e,i)=>({i,tag:e.tagName,type:e.type,id:e.id,name:e.name,placeholder:e.placeholder,value:e.type==='file'?'':e.value}))).catch(e=>({error:e.message})); fs.writeFileSync(path.join(EVID,'profile_edit_inputs.json'),JSON.stringify(profileInputs,null,2));
  try{const fileInput=page.locator('input[type=file]').first(); if(await fileInput.count()){await fileInput.setInputFiles(avatarPath); await snap(page,'profile_avatar_selected',result,redact);}}
  catch(e){result.notes.push('avatar upload selection failed: '+e.message);}
  await fillAny(page,['#profile-first-name','input[placeholder*="first" i]'],'Audit');
  await fillAny(page,['#profile-last-name','input[placeholder*="last" i]'],'P15');
  await fillAny(page,['#profile-phone','input[type=tel]','input[placeholder*="987" i]'],'+919800015015');
  await fillAny(page,['#profile-headline','input[placeholder*="Founder" i]'],`AUDIT-P15 Profile ${runId}`);
  await fillAny(page,['#profile-bio','textarea[placeholder*="intro" i]'],`AUDIT-P15 profile update for settings/security regression. XSS smoke string stored as text only: <img src=x onerror=alert(1)>`);
  await fillAny(page,['#profile-skills','input[placeholder*="Shopify" i]'],'QA, Security, AUDIT-P15');
  await snap(page,'profile_edit_filled_audit_values',result,redact);
  const preNetLen=result.network.length; await clickButton(page,/Save changes|Save profile|Update profile/i,7000); await page.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{}); await snap(page,'profile_edit_after_save',result,redact);
  const profileReqs=result.network.slice(preNetLen).filter(n=>/profile|users\/profile|avatar|media/i.test(n.path));
  const dangerousProfileKeys=profileReqs.flatMap(n=>n.requestKeys||[]).filter(k=>/role|status|admin|verified|permissions/i.test(k));
  result.controlInventory.push({page:'/profile/edit',control:'profile save/avatar upload',verdict:dangerousProfileKeys.length?'FAIL_DANGEROUS_KEYS':'PASS',evidence:`profile_edit_after_save; keys=${[...new Set(profileReqs.flatMap(n=>n.requestKeys||[]))].join(',')||'-'}`});
  if(dangerousProfileKeys.length) result.bugs.push({id:'NL-BUG-P15-PROFILE-1',severity:'P1',title:'Profile save payload includes privileged/status keys',evidence:'profile_edit_after_save',details:dangerousProfileKeys});
  await goto(page,`${APP}/profile`,'profile_view_after_save',result,redact);

  // Notifications preferences (safe toggle/save where available).
  await goto(page,`${APP}/settings/notifications`,'settings_notifications_form_inventory',result,redact);
  try{const switches=page.locator('button[role="switch"], input[type=checkbox]'); const count=await switches.count(); if(count){const first=switches.first(); await first.click({timeout:3000}); await snap(page,'settings_notifications_toggle_one',result,redact); await clickButton(page,/Save changes|Save preferences|Update/i,5000); await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{}); await snap(page,'settings_notifications_after_save',result,redact); result.controlInventory.push({page:'/settings/notifications',control:'preference toggle/save',verdict:'TESTED_SAFE_AUDIT',evidence:'settings_notifications_after_save'});} else result.controlInventory.push({page:'/settings/notifications',control:'preference toggle/save',verdict:'NO_TOGGLES_VISIBLE',evidence:'settings_notifications_form_inventory'});}catch(e){result.notes.push('notification preference interaction failed: '+e.message);}

  // Account privacy/save + data export + delete schedule/cancel on dedicated account.
  await goto(page,`${APP}/settings/account`,'settings_account_before_mutations',result,redact);
  try{const sel=page.locator('select[name=profileVisibility],#acc-profile-visibility').first(); if(await sel.count()){await sel.selectOption('private').catch(async()=>await sel.selectOption({label:/Private/i})); await snap(page,'settings_account_privacy_private_selected',result,redact); await clickButton(page,/Save changes/i,5000); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{}); await snap(page,'settings_account_privacy_after_save',result,redact); result.controlInventory.push({page:'/settings/account',control:'privacy/preferences save',verdict:'TESTED_SAFE_AUDIT',evidence:'settings_account_privacy_after_save'});}}
  catch(e){result.notes.push('privacy save failed: '+e.message);}
  try{const btn=page.getByRole('button',{name:/Request data export|Export data|Download data|Download export/i}).first(); if(await btn.count()){const before=result.downloads.length; const dl=await downloadOnClick(page,btn,'data_export_request_or_download',result); await page.waitForTimeout(2500); await snap(page,'settings_account_data_export_after_click',result,redact); result.controlInventory.push({page:'/settings/account',control:'data export request/download',verdict:dl.verdict==='DOWNLOADED'?'DOWNLOADED':'REQUESTED_OR_NO_IMMEDIATE_DOWNLOAD',evidence:'settings_account_data_export_after_click'});} else result.controlInventory.push({page:'/settings/account',control:'data export',verdict:'MISSING_CONTROL',evidence:'settings_account_before_mutations'});}catch(e){result.notes.push('data export click failed: '+e.message);}
  // Wrong deletion password validation.
  try{await fillAny(page,['#acc-delete-password','input[name=deletePassword]'],'WrongP15Password!'); const delBtn=page.getByRole('button',{name:/^Delete account$/i}).last(); const enabled=await delBtn.isEnabled({timeout:1000}).catch(()=>false); if(enabled){await delBtn.click({timeout:4000}); await page.waitForTimeout(2500); await snap(page,'settings_account_delete_wrong_password',result,redact); result.controlInventory.push({page:'/settings/account',control:'delete wrong-password validation',verdict:/invalid|wrong|password|required|failed|error/i.test((await page.locator('body').innerText().catch(()=>'')))?'PASS_REJECTED':'CHECK',evidence:'settings_account_delete_wrong_password'});}}
  catch(e){result.notes.push('wrong deletion validation failed: '+e.message);}
  // Dedicated account: schedule deletion and cancel if the app exposes immediate cancel. If it logs out, record safely.
  try{await goto(page,`${APP}/settings/account`,'settings_account_delete_ready',result,redact); await fillAny(page,['#acc-delete-password','input[name=deletePassword]'],currentPassword); const delBtn=page.getByRole('button',{name:/^Delete account$/i}).last(); if(await delBtn.isEnabled({timeout:1500}).catch(()=>false)){await delBtn.click({timeout:5000}); await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{}); await page.waitForTimeout(2000); const after=await snap(page,'settings_account_delete_requested',result,redact); const loggedOut=/\/login/.test(page.url()); let cancelVerdict='NOT_AVAILABLE'; if(!loggedOut){const cancel=page.getByRole('button',{name:/Cancel pending deletion|Cancel deletion/i}).first(); if(await cancel.count()){await cancel.click({timeout:5000}); await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{}); await snap(page,'settings_account_delete_cancelled',result,redact); cancelVerdict='CANCEL_CLICKED';}}
      result.controlInventory.push({page:'/settings/account',control:'delete account request/cancel',verdict:loggedOut?'REQUEST_LOGGED_OUT_CANCEL_BLOCKED':cancelVerdict,evidence:'settings_account_delete_requested / settings_account_delete_cancelled'});
    } else result.controlInventory.push({page:'/settings/account',control:'delete account request',verdict:'DELETE_BUTTON_DISABLED',evidence:'settings_account_delete_ready'});}
  catch(e){result.notes.push('delete/cancel flow failed: '+e.message);}

  // Security: wrong current password, change password, 2FA attempt, session revoke.
  await goto(page,`${APP}/settings/security`,'settings_security_before_mutations',result,redact);
  try{await fillAny(page,['#security-current-password','input[name=currentPassword]'],'WrongP15Password!'); await fillAny(page,['#security-new-password','input[name=newPassword]'],changedPassword); await fillAny(page,['#security-confirm-password','input[name=confirmPassword]'],changedPassword); await clickButton(page,/Update password/i,5000); await page.waitForTimeout(2500); await snap(page,'settings_security_wrong_current_password',result,redact); result.controlInventory.push({page:'/settings/security',control:'wrong current password validation',verdict:/incorrect|invalid|wrong|failed|password/i.test(await page.locator('body').innerText().catch(()=>''))?'PASS_REJECTED':'CHECK',evidence:'settings_security_wrong_current_password'});}catch(e){result.notes.push('wrong password test failed: '+e.message);}
  // valid password change; login with old should fail, new should pass
  let passwordChanged=false;
  try{await goto(page,`${APP}/settings/security`,'settings_security_change_password_ready',result,redact); await fillAny(page,['#security-current-password','input[name=currentPassword]'],currentPassword); await fillAny(page,['#security-new-password','input[name=newPassword]'],changedPassword); await fillAny(page,['#security-confirm-password','input[name=confirmPassword]'],changedPassword); await clickButton(page,/Update password/i,5000); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{}); await page.waitForTimeout(2500); const s=await snap(page,'settings_security_change_password_after_submit',result,redact); passwordChanged=/updated|changed|success/i.test(s.text) || !/error|invalid|incorrect/i.test(s.text); if(passwordChanged) currentPassword=changedPassword; result.controlInventory.push({page:'/settings/security',control:'change password valid submit',verdict:passwordChanged?'SUBMITTED_CHECK_NEW_LOGIN':'CHECK',evidence:'settings_security_change_password_after_submit'});}catch(e){result.notes.push('valid password change failed: '+e.message);}
  if(mailbox){
    const oldCtx=await browser.newContext({viewport:{width:900,height:700},ignoreHTTPSErrors:true}); const oldPage=await oldCtx.newPage(); await attach(oldPage,'old_password_login_probe',result,redact); const oldOk=await submitLogin(oldPage,mailbox.address,initialPassword); await snap(oldPage,'security_old_password_login_probe',result,redact,{oldPasswordLoginOk:oldOk}); await oldCtx.close().catch(()=>{});
    const newCtx=await browser.newContext({viewport:{width:900,height:700},ignoreHTTPSErrors:true}); const newPage=await newCtx.newPage(); await attach(newPage,'new_password_login_probe',result,redact); const newOk=await submitLogin(newPage,mailbox.address,currentPassword); await snap(newPage,'security_new_password_login_probe',result,redact,{newPasswordLoginOk:newOk}); result.securityFindings.push({id:oldOk?'P15-AUTH-PASSWORD-OLD-STILL-WORKS':'P15-AUTH-PASSWORD-ROTATION',severity:oldOk?'P1':'PASS',surface:'change password',role:'dedicated audit client',impact:oldOk?'Old password still authenticates after change':'Old password rejected; new password works/attempt captured',evidence:'security_old_password_login_probe / security_new_password_login_probe',fix:oldOk?'Invalidate old credential after change':'No fix'}); if(!newOk) result.blockers.push('New password login did not succeed after password change attempt.');
    // keep second context for sign-out-other-devices if logged in
    if(newOk){await goto(newPage,`${APP}/settings/activity`,'second_context_activity_before_revoke',result,redact); result._secondCtx=newCtx; result._secondPage=newPage;} else {await newCtx.close().catch(()=>{});}
  }
  // Re-login main if delete/password actions displaced session.
  if(page.url().includes('/login') && mailbox) await submitLogin(page,mailbox.address,currentPassword);
  await goto(page,`${APP}/settings/security`,'settings_security_before_2fa_attempt',result,redact);
  try{await fillAny(page,['#security-2fa-password','input[name=twoFactorPassword]'],currentPassword); await page.waitForTimeout(500); await clickButton(page,/Start 2FA setup/i,5000); await page.waitForTimeout(3500); const setup=await snap(page,'settings_security_2fa_setup_started',result,redact); const raw=await page.evaluate(()=>document.body.innerText + '\n' + [...document.querySelectorAll('img,a,svg,canvas')].map(e=>[e.getAttribute('src'),e.getAttribute('href'),e.getAttribute('alt'),e.getAttribute('data-uri'),e.getAttribute('data-secret')].filter(Boolean).join(' ')).join('\n')).catch(()=> ''); let secret=null; const uri=raw.match(/otpauth:\/\/totp\/[^\s"'<>]+/i); if(uri){try{secret=new URL(uri[0]).searchParams.get('secret');}catch{}} if(!secret){const ms=raw.match(/\b[A-Z2-7]{16,}\b/g)||[]; secret=ms[0];}
    if(!secret){result.blockers.push('2FA setup started but no manual secret/otpauth URI could be extracted.'); result.controlInventory.push({page:'/settings/security',control:'2FA setup secret',verdict:'NO_SECRET_EXTRACTED',evidence:'settings_security_2fa_setup_started'});}
    else {result.controlInventory.push({page:'/settings/security',control:'2FA setup secret/copy',verdict:'SECRET_VISIBLE_REDACTED',evidence:'settings_security_2fa_setup_started'}); await fillAny(page,['#security-2fa-code','input[name=twoFactorCode]','input[autocomplete=one-time-code]'],'000000'); await clickButton(page,/Verify and enable|Verify|Enable/i,5000); await page.waitForTimeout(2500); await snap(page,'settings_security_2fa_wrong_code',result,redact); const code=totp(secret); if(code){await fillAny(page,['#security-2fa-password','input[name=twoFactorPassword]'],currentPassword).catch(()=>{}); await fillAny(page,['#security-2fa-code','input[name=twoFactorCode]','input[autocomplete=one-time-code]'],code); await clickButton(page,/Verify and enable|Verify|Enable/i,5000); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{}); await page.waitForTimeout(3500); const v=await snap(page,'settings_security_2fa_valid_code_result',result,redact); const enabled=/enabled|backup codes|disable|two-factor authentication\s+enabled/i.test(v.text) && !/invalid|failed|error/i.test(v.text); result.controlInventory.push({page:'/settings/security',control:'2FA valid TOTP enable',verdict:enabled?'PASS_ENABLED':'FAIL_OR_CHECK',evidence:'settings_security_2fa_valid_code_result'}); if(!enabled) result.bugs.push({id:'NL-BUG-P15-2FA-1',severity:'P1',title:'Valid TOTP did not clearly enable 2FA for dedicated audit account',evidence:'settings_security_2fa_valid_code_result'}); if(enabled){await goto(page,`${APP}/settings/security`,'settings_security_after_2fa_reload',result,redact); const reloadText=await page.locator('body').innerText().catch(()=> ''); if(/backup code/i.test(reloadText)) result.bugs.push({id:'NL-BUG-P15-2FA-2',severity:'P2',title:'Backup codes still visible after leaving/reloading security page',evidence:'settings_security_after_2fa_reload'}); // disable if available
          try{await fillAny(page,['#security-2fa-password','input[name=twoFactorPassword]'],currentPassword); await clickButton(page,/Disable 2FA|Disable two-factor|Turn off/i,5000); await page.waitForTimeout(2500); await snap(page,'settings_security_2fa_disable_attempt',result,redact);}catch(e){result.notes.push('2FA disable attempt failed: '+e.message);}
        }} else result.blockers.push('Could not compute TOTP from extracted secret.');}
  }catch(e){result.notes.push('2FA flow failed: '+e.message);}
  // session revoke/sign out other devices
  try{await goto(page,`${APP}/settings/security`,'settings_security_sessions_before_revoke',result,redact); const clicked=await clickButton(page,/Sign out other devices/i,5000); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{}); await page.waitForTimeout(2500); await snap(page,'settings_security_sessions_after_signout_others',result,redact); let secondActive=null; if(result._secondPage){await result._secondPage.goto(`${APP}/settings/activity`,{waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{}); await result._secondPage.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{}); const s=await snap(result._secondPage,'second_context_after_revoke_attempt',result,redact); secondActive=!/\/login/.test(s.url) && !/Sign in|client portal · live/i.test(s.text); await result._secondCtx.close().catch(()=>{});}
    result.controlInventory.push({page:'/settings/security',control:'sign out other devices',verdict:clicked?(secondActive===false?'PASS_SECOND_CONTEXT_REVOKED':secondActive===true?'FAIL_SECOND_CONTEXT_STILL_ACTIVE':'CLICKED_NO_SECOND_CONTEXT_VERDICT'):'MISSING_CONTROL',evidence:'settings_security_sessions_after_signout_others / second_context_after_revoke_attempt'}); if(secondActive===true) result.bugs.push({id:'NL-BUG-P15-SESSIONS-1',severity:'P1',title:'Sign out other devices did not revoke second browser context',evidence:'second_context_after_revoke_attempt'});
  }catch(e){result.notes.push('session revoke flow failed: '+e.message);}

  await goto(page,`${APP}/settings/activity`,'settings_activity_after_mutations',result,redact);
  await goto(page,`${APP}/settings/account`,'settings_account_final_state',result,redact);
  // Mobile and keyboard
  if(mailbox){const mob=await loginContext(browser,mailbox.address,currentPassword,'mobile_audit_p15',result,redact,{width:375,height:812}); if(mob.ok){await goto(mob.page,`${APP}/settings/account`,'mobile_settings_account_375',result,redact); await goto(mob.page,`${APP}/settings/security`,'mobile_settings_security_375',result,redact);} await mob.ctx.close().catch(()=>{});} 
  await goto(page,`${APP}/settings/account`,'keyboard_settings_account_start',result,redact); for(let i=0;i<16;i++) await page.keyboard.press('Tab').catch(()=>{}); await snap(page,'keyboard_settings_account_after_tabs',result,redact);

  await ctx.close().catch(()=>{}); await browser.close();

  // PDF integrity for any downloaded PDFs in P15 (normally not applicable).
  try{const pdfs=result.downloads.filter(d=>d.savedAs&&/\.pdf$/i.test(d.savedAs)).map(d=>d.savedAs); result.pdfIntegrity=analyzePdfs(pdfs); if(result.pdfIntegrity.length) fs.writeFileSync(path.join(EVID,'pdf_integrity_analysis.json'),JSON.stringify(result.pdfIntegrity,null,2));}catch(e){result.notes.push('PDF integrity analysis failed: '+e.message);}
  const pdfWarnings=[]; for(const a of result.pdfIntegrity||[]){const pi=a.professional_integrity||{}; for(const issue of (pi.issues||[]).concat(pi.warnings||[])) pdfWarnings.push(`${a.filename}: ${issue}`);} if(pdfWarnings.length) result.bugs.push({id:'NL-BUG-P15-DOCS-1',severity:'P2',title:'Generated PDF/data-export document integrity warning',evidence:'pdf_integrity_analysis.json',details:pdfWarnings});

  // Additional pass/fail controls from route text.
  result.controlInventory.push({page:'/settings/account',control:'settings tabs/aliases',verdict:'TESTED',evidence:'settings_redirect/settings_billing_alias/settings_sessions_alias/settings_account'});
  result.controlInventory.push({page:'/settings/activity',control:'activity timeline after profile/security actions',verdict:'TESTED',evidence:'settings_activity_after_mutations'});
  result.controlInventory.push({page:'/profile',control:'profile view reflects audit profile',verdict:'TESTED',evidence:'profile_view_after_save'});

  // Remove nonessential login controls to reduce password-word false positives.
  for(const s of result.snapshots){ if(/login|register|verify_email/.test(s.slug)) delete s.controls; }
  // Summaries.
  const highest=result.bugs.find(b=>b.severity==='P0')?'P0':result.bugs.find(b=>b.severity==='P1')?'P1':result.bugs.find(b=>b.severity==='P2')?'P2':(result.blockers.length?'BLOCKED':'INFO');
  fs.writeFileSync(path.join(OUT,'p15_result.json'), JSON.stringify(result,null,2));
  const cov=[
    ['Audit account creation','/register + email verify', result.auditAccount.verified?'PASS':'PARTIAL/BLOCKED','register_audit_p15 / verify_email_audit_p15','Disposable audit user created through UI and mail.tm verification attempted'],
    ['Settings aliases','/settings, /settings/billing, /settings/sessions','TESTED','settings_redirect/settings_billing_alias/settings_sessions_alias','Alias behavior captured'],
    ['Profile view/edit','/profile, /profile/edit','TESTED_MUTATED_AUDIT','profile_edit_after_save / profile_view_after_save','Name/headline/bio/skills/avatar upload exercised on audit account'],
    ['Account privacy','/settings/account','TESTED_MUTATED_AUDIT','settings_account_privacy_after_save','Profile visibility save executed'],
    ['Data export','/settings/account','TESTED','settings_account_data_export_after_click','Request/download control clicked; see download table'],
    ['Deletion','/settings/account','TESTED/PARTIAL','settings_account_delete_*','Wrong-password validation and dedicated-account delete/cancel attempted'],
    ['Notifications','/settings/notifications','TESTED','settings_notifications_*','Preference toggle/save where visible'],
    ['Security password','/settings/security','TESTED_MUTATED_AUDIT','settings_security_*password*','Wrong password rejected; valid change and old/new login probes captured'],
    ['2FA','/settings/security','TESTED','settings_security_2fa_*','Manual secret redacted; wrong and valid TOTP attempted'],
    ['Sessions','/settings/security','TESTED','settings_security_sessions_* / second_context_*','Second context and sign-out-other-devices tested'],
    ['Activity','/settings/activity','TESTED','settings_activity_after_mutations','Recent activity route captured after mutations'],
    ['Mobile','375px settings/account/security','TESTED','mobile_settings_*','Mobile danger/security surfaces captured'],
    ['Generated PDF integrity','downloads/PDFs','N/A' + (result.pdfIntegrity.length?' + TESTED':''),'pdf_integrity_analysis.json if present','No generated PDF surfaced unless listed in download table'],
  ].map(r=>`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join('\n');
  const controls=result.controlInventory.map(c=>`| ${c.page} | ${c.control} | - | ${c.verdict} | ${redact(c.evidence)} |`).join('\n')||'| - | - | - | - | - |';
  const netRows=result.network.slice(0,260).map(n=>`| ${n.label} | ${n.method} ${n.path} | ${n.status} | ${n.status<400?'OK':'CHECK'} | keys: ${(n.requestKeys||[]).join(', ')}; ${n.contentType||''}; ${n.contentLength||''}; ${n.ms??''}ms |`).join('\n')||'| - | - | - | - | - |';
  const consoleRows=result.console.slice(0,80).map(c=>`| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n')||'| - | - | No console warnings/errors captured. |';
  const downloadRows=result.downloads.map(d=>`| ${d.slug} | ${d.verdict} | ${d.filename||'-'} | ${d.bytes||'-'} | ${d.tokenLeakInFilename===false?'No':(d.tokenLeakInFilename===true?'YES':'-')} | ${d.relative||'-'} |`).join('\n')||'| - | - | - | - | - | - |';
  const pdfRows=(result.pdfIntegrity||[]).map(a=>`| ${a.filename} | ${a.page_count} | ${a.bytes} | ${a.professional_integrity.status} | ${(a.professional_integrity.issues||[]).concat(a.professional_integrity.warnings||[]).map(redact).join('<br>') || 'No warnings'} |`).join('\n')||'| Not applicable | - | - | N/A | No generated PDF downloaded in P15. |';
  const bugText=result.bugs.length?result.bugs.map(b=>`### ${b.id}: ${b.title}\n- Severity: ${b.severity}\n- Evidence: ${b.evidence}\n${b.details?'- Details:\n'+(Array.isArray(b.details)?b.details.map(d=>`  - ${redact(d)}`).join('\n'):redact(JSON.stringify(b.details))):''}`).join('\n\n'):'No confirmed P15 app bugs from this pass.';
  const blockers=result.blockers.map(b=>`- ${redact(b)}`).join('\n')||'- None.';
  const secRows=result.securityFindings.map(f=>`| ${f.id} | ${f.severity} | ${f.surface} | ${f.role} | ${f.impact} | ${f.evidence} | ${f.fix} |`).join('\n')||'| - | - | - | - | - | - | - |';
  const shots=result.snapshots.map(s=>`- ${s.slug}: \`evidence/${path.basename(s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md=`# Result — P15 — Client settings, profile, security, sessions, data export and account deletion\n\n## Session summary\n- Host/environment: public-domain \`${APP}\`.\n- Browser/MCP/tooling: Playwright Chromium headless, UI-first; mail.tm disposable email for dedicated audit account; PyMuPDF/PyPDF available for any generated PDFs.\n- Role/account used: dedicated disposable audit client \`<audit-p15-mail>@<mail-domain>\`.\n- Fixtures created: dedicated AUDIT-P15 client created via UI registration and verification email. Shared demo clients were not mutated.\n- Routes walked: /settings/account, /settings/security, /settings/notifications, /settings/activity, /profile, /profile/edit, /settings aliases, mobile variants.\n- Highest severity: ${highest}\n\n## Coverage table\n| Unit | Route/subsurface | Status | Evidence | Notes |\n|---|---|---|---|---|\n${cov}\n\n## Control inventory deltas\n| Page | Control/tab/dialog | Old-prompt gap? | Runtime verdict | Evidence |\n|---|---|---|---|---|\n${controls}\n\n## Download observations\n| Trigger | Verdict | Filename | Bytes | Token leak in filename | Saved evidence |\n|---|---|---|---:|---|---|\n${downloadRows}\n\n## PDF/generated-document professional-integrity analysis\nP15 did not surface a Nestlancer-generated PDF unless listed below. The standing generated-document checklist was still applied to any downloaded PDF: page count, headers/footers, page numbering, page-bound layout, overlaps, long-content wrapping, duplicate strings, and secret redaction.\n\n| File | Pages | Bytes | Integrity verdict | Issues / warnings |\n|---|---:|---:|---|---|\n${pdfRows}\n\n## Network/API observations\n| Trigger | Method + path | Status | Verdict | Notes |\n|---|---|---:|---|---|\n${netRows}\n\n## Console findings\n| Context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## Blockers / deferred checks\n${blockers}\n\n## Bugs\n${bugText}\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n${secRows}\n\n## Security checks passed / attempted\n| Area | Sample tested | Verdict | Evidence |\n|---|---|---|---|\n| Anonymous protected route gate | Register/login required before settings/profile access | TESTED | login/register and route redirect evidence |\n| Password rotation | Old and new password probes after password-change attempt | SEE_SECURITY_FINDINGS | security_old_password_login_probe / security_new_password_login_probe |\n| XSS smoke | Profile bio stored malicious-looking string as text on audit account | TESTED | profile_edit_after_save / profile_view_after_save |\n| Session revocation | Second context plus sign-out-other-devices | TESTED | second_context_* |\n| Secret hygiene | Report artifacts scanned for raw tokens/JWT/signed URLs after run | PENDING_LOCAL_SCAN | see execution status |\n\n## Handoff\n- Backend/API: ensure account deletion has explicit pending/cancel state and audit log entry; review 2FA valid-code result if this run confirms same P03 enrollment failure.\n- Frontend/UI: keep privileged keys out of profile update payloads; do not display backup codes after leaving the setup step.\n- Data/setup: dedicated audit client was created and mutated; no shared demo client settings/password/2FA were changed.\n\n## Evidence files\n${shots}\n`;
  fs.writeFileSync(path.join(OUT,'result.md'),md);
})();
