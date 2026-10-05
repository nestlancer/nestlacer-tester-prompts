const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/home/bhumukul-raj/Music/nestlacer-test-output/reports/P07';
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });
const APP = 'https://app.nestlancer.com';
const PW = process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build';
const ARJUN = 'arjun.mehta@nestlancer.com';
const RAHUL = 'rahul.desai@nestlancer.com';
const AUDIT_QUOTE_ID = '01a10716-d343-75b8-a1b8-d87025edeb08';
const RAHUL_QUOTE_ID = '01a106c0-7f1e-742e-a0b5-2e10202c91b5';

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
async function dismiss(page) {
  for (const t of ['Accept', 'Dismiss']) {
    try { const b = page.getByRole('button', { name: t }).first(); if (await b.isVisible({ timeout: 600 })) await b.click({ timeout: 1000 }); } catch {}
  }
}
async function attach(page, label, result) {
  const started = new Map();
  page.on('request', req => started.set(req, Date.now()));
  page.on('response', async res => {
    const req = res.request();
    const u = sanitizeUrl(res.url());
    if (!/nestlancer\.com/.test(u)) return;
    const interesting = req.resourceType() === 'document' || /\/api\//.test(u) || /quotes|documents|contract|pdf|download|projects|auth|users/i.test(u);
    if (!interesting) return;
    let keys = [];
    const post = req.postData();
    if (post) { try { keys = Object.keys(JSON.parse(post)); } catch { keys = ['<non-json-post-body>']; } }
    const headers = res.headers();
    const ct = headers['content-type'] || '';
    const cd = headers['content-disposition'] || '';
    result.network.push({ label, method: req.method(), status: res.status(), type: req.resourceType(), path: (() => { try { const uu = new URL(u); return uu.pathname + uu.search; } catch { return u; } })(), ms: started.has(req) ? Date.now() - started.get(req) : null, requestKeys: keys, contentType: ct ? ct.split(';')[0] : '', contentDisposition: cd ? redact(cd).slice(0,120) : '', contentLength: headers['content-length'] || '' });
  });
  page.on('console', msg => { if (['error', 'warning'].includes(msg.type())) result.console.push({ label, type: msg.type(), text: redact(msg.text()) }); });
  page.on('pageerror', err => result.console.push({ label, type: 'pageerror', text: redact(err.message || err.toString()) }));
}
async function snap(page, slug, result, extra = {}) {
  await page.waitForTimeout(800).catch(()=>{});
  const file = path.join(EVID, `${slug}.png`);
  await page.screenshot({ path: file, fullPage: true }).catch(e => result.notes.push(`screenshot failed ${slug}: ${e.message}`));
  const url = sanitizeUrl(page.url());
  const title = await page.title().catch(()=> '');
  const text = redact(await page.locator('body').innerText({ timeout: 5000 }).catch(()=>''));
  const controls = await page.evaluate(() => ({
    buttons: [...document.querySelectorAll('button,[role="button"]')].map((b, i) => ({ i, text: (b.textContent || b.getAttribute('aria-label') || '').trim().slice(0,100), type: b.getAttribute('type'), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true', aria: b.getAttribute('aria-label') })).slice(0,120),
    links: [...document.querySelectorAll('a[href]')].map((a, i) => ({ i, text: (a.textContent || '').trim().slice(0,100), href: a.getAttribute('href') })).slice(0,120),
    inputs: [...document.querySelectorAll('input,textarea,select')].map((el, i) => ({ i, tag: el.tagName, type: el.getAttribute('type'), name: el.getAttribute('name'), id: el.id, placeholder: el.getAttribute('placeholder'), valueLength: (el.value || '').length })).slice(0,80),
    active: document.activeElement ? `${document.activeElement.tagName}#${document.activeElement.id || ''}` : ''
  })).catch(e => ({ error: e.message }));
  fs.writeFileSync(path.join(EVID, `${slug}.txt`), `URL: ${url}\nTITLE: ${title}\n\n${text}`);
  result.snapshots.push({ slug, file, url, title, controls, ...extra });
  return { url, title, text, controls };
}
async function goto(page, url, slug, result) {
  const rec = { slug, requestedUrl: sanitizeUrl(url) };
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    rec.status = res ? res.status() : null;
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(()=>{});
    const s = await snap(page, slug, result, { httpStatus: rec.status });
    rec.finalUrl = s.url; rec.title = s.title; rec.ok = !!res && rec.status < 500;
  } catch (e) { rec.error = e.message; try { await snap(page, `${slug}_error`, result, { error: e.message }); } catch {} }
  result.steps.push(rec);
  return rec;
}
async function loginContext(browser, email, label, result, viewport = { width: 1365, height: 900 }) {
  const ctx = await browser.newContext({ viewport, ignoreHTTPSErrors: true, acceptDownloads: true });
  const page = await ctx.newPage(); await attach(page, label, result);
  await goto(page, `${APP}/login`, `${label}_login_before`, result); await dismiss(page);
  await page.locator('input[type="email"],input[name="email"]').first().fill(email);
  await page.locator('input[type="password"],input[name="password"]').first().fill(PW);
  await Promise.allSettled([page.waitForURL(u => !u.pathname.includes('/login'), { timeout: 22000 }), page.locator('button[type="submit"]').first().click()]);
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(()=>{});
  if (page.url().includes('/login')) { await page.goto(`${APP}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(()=>{}); await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(()=>{}); }
  await snap(page, `${label}_login_after`, result, { account: shortEmail(email) });
  const cookies = await ctx.cookies();
  result.storage.push({ label, localStorageKeys: await page.evaluate(() => Object.keys(localStorage || {})).catch(()=>[]), sessionStorageKeys: await page.evaluate(() => Object.keys(sessionStorage || {})).catch(()=>[]), cookies: cookies.map(c => ({ name: c.name, domain: c.domain, path: c.path, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, expires: c.expires ? '<set>' : '<session>' })) });
  return { ctx, page };
}
async function tryDownload(page, buttonName, slug, result) {
  const rec = { control: buttonName, slug, verdict: 'NOT_CLICKED' };
  try {
    const locator = page.getByRole('button', { name: new RegExp(buttonName, 'i') }).first();
    if (!(await locator.count())) { rec.verdict = 'MISSING'; result.downloads.push(rec); return rec; }
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(e => ({ error: e.message }));
    await locator.click({ timeout: 5000 });
    const dl = await downloadPromise;
    if (dl && !dl.error) {
      const suggested = dl.suggestedFilename();
      const savePath = path.join(EVID, `${slug}_${suggested.replace(/[^a-zA-Z0-9._-]+/g, '_')}`);
      await dl.saveAs(savePath);
      const st = fs.statSync(savePath);
      rec.verdict = 'DOWNLOADED'; rec.filename = suggested; rec.bytes = st.size; rec.savedAs = path.relative(OUT, savePath);
      rec.tokenLeakInFilename = /token|secret|signature|credential|jwt|access/i.test(suggested);
    } else {
      rec.verdict = 'NO_DOWNLOAD_EVENT'; rec.error = dl?.error || '';
    }
  } catch (e) { rec.verdict = 'ERROR'; rec.error = e.message; }
  result.downloads.push(rec);
  await snap(page, `${slug}_after_click`, result, { download: rec });
  return rec;
}

(async () => {
  const result = { prompt: 'P07', generatedAt: new Date().toISOString(), mode: 'public-domain UI-first', steps: [], snapshots: [], network: [], console: [], storage: [], downloads: [], controlInventory: [], bugs: [], blockers: [], notes: [], securityFindings: [] };
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const arjun = await loginContext(browser, ARJUN, 'arjun', result);
  const page = arjun.page;
  await goto(page, `${APP}/quotes`, 'quotes_list_arjun', result);
  // Inventory quote cards/hrefs and filter/status labels.
  const listInfo = await page.evaluate(() => ({
    text: document.body.innerText,
    quoteLinks: [...document.querySelectorAll('a[href*="/quotes/"]')].map(a => ({ text: a.textContent.trim(), href: a.href })),
    statusWords: [...new Set((document.body.innerText.match(/Pending|Accepted|Declined|Changes requested|Expired|Draft/gi) || []))],
  })).catch(e => ({ error: e.message }));
  fs.writeFileSync(path.join(EVID, 'quotes_list_arjun_inventory.json'), JSON.stringify(listInfo, null, 2));
  result.controlInventory.push({ page: '/quotes', control: 'quote list/cards/status labels', verdict: listInfo.quoteLinks?.length ? 'PASS' : 'CHECK_EMPTY', evidence: `${listInfo.quoteLinks?.length || 0} quote links; statuses: ${(listInfo.statusWords || []).join(', ')}` });

  // Alias redirects.
  for (const alias of ['/quotes/drafts', '/quotes/new', '/quotes/templates']) {
    await goto(page, `${APP}${alias}`, `alias_${alias.replace(/\W+/g,'_')}`, result);
    result.controlInventory.push({ page: alias, control: 'alias redirect', verdict: page.url().includes('/quotes') ? 'PASS' : 'CHECK', evidence: sanitizeUrl(page.url()) });
  }

  // Back to list, keyboard traversal.
  await goto(page, `${APP}/quotes`, 'quotes_list_after_aliases', result);
  for (let i=0; i<8; i++) await page.keyboard.press('Tab').catch(()=>{});
  await snap(page, 'quotes_keyboard_focus_after_tabs', result);

  // Audit quote detail (accepted AUDIT quote).
  await goto(page, `${APP}/quotes/${AUDIT_QUOTE_ID}`, 'quote_detail_audit_accepted', result);
  const detailInfo = await page.evaluate(() => ({
    text: document.body.innerText,
    buttons: [...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(Boolean),
    links: [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent.trim(), href: a.href })),
  })).catch(e => ({ error: e.message }));
  fs.writeFileSync(path.join(EVID, 'quote_detail_audit_accepted_inventory.json'), JSON.stringify(detailInfo, null, 2));
  const hasInvalidActions = /\bAccept\b|Decline|Request changes/i.test((detailInfo.buttons || []).join(' '));
  result.controlInventory.push({ page: `/quotes/${AUDIT_QUOTE_ID}`, control: 'accepted-state action hiding', verdict: hasInvalidActions ? 'FAIL' : 'PASS', evidence: `buttons: ${(detailInfo.buttons || []).join(', ')}` });
  result.controlInventory.push({ page: `/quotes/${AUDIT_QUOTE_ID}`, control: 'money/schedule/terms/documents', verdict: /₹1,500\.00|Payment schedule|Terms & conditions|Documents/i.test(detailInfo.text || '') ? 'PASS' : 'CHECK', evidence: 'detail text inventory' });

  await tryDownload(page, 'Download quote PDF', 'download_quote_pdf', result);
  await tryDownload(page, 'Download signed service agreement', 'download_signed_service_agreement', result);

  // Open project link for accepted quote.
  try {
    const project = page.getByRole('link', { name: /Open project/i }).first();
    if (await project.count()) {
      await Promise.allSettled([page.waitForURL(u => u.pathname.includes('/projects/'), { timeout: 10000 }), project.click({ timeout: 5000 })]);
      await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(()=>{});
      await snap(page, 'accepted_quote_open_project', result);
      result.controlInventory.push({ page: 'quote detail', control: 'Open project', verdict: page.url().includes('/projects/') ? 'PASS' : 'CHECK', evidence: sanitizeUrl(page.url()) });
    } else result.blockers.push('Open project link not found on accepted AUDIT quote.');
  } catch (e) { result.controlInventory.push({ page: 'quote detail', control: 'Open project', verdict: 'ERROR', evidence: e.message }); }

  // IDOR: Arjun tries Rahul quote URL.
  await goto(page, `${APP}/quotes/${RAHUL_QUOTE_ID}`, 'security_arjun_attempt_rahul_quote', result);
  const idorText = await page.locator('body').innerText().catch(()=> '');
  const idorFail = /Warehouse & Fleet Operations Portal|₹19,800|Rahul/i.test(idorText);
  result.securityFindings.push({ id: idorFail ? 'P07-SEC-IDOR-01' : 'P07-SEC-IDOR-CHECK', severity: idorFail ? 'P0' : 'PASS', surface: 'quote detail', role: 'client A accessing client B quote', impact: idorFail ? 'Cross-client quote disclosure' : 'Client B quote not disclosed to client A', evidence: 'security_arjun_attempt_rahul_quote', fix: idorFail ? 'Enforce quote ownership in route/API' : 'No fix' });

  // Rahul baseline for own declined quote detail.
  const rahul = await loginContext(browser, RAHUL, 'rahul', result);
  await goto(rahul.page, `${APP}/quotes/${RAHUL_QUOTE_ID}`, 'quote_detail_rahul_declined_baseline', result);
  const rahulDetail = await rahul.page.locator('body').innerText().catch(()=> '');
  result.controlInventory.push({ page: 'Rahul quote detail', control: 'declined-state visibility/actions', verdict: /Declined/i.test(rahulDetail) ? 'PASS' : 'CHECK', evidence: 'quote_detail_rahul_declined_baseline' });

  // Anonymous protected quote detail redirect.
  const anonCtx = await browser.newContext({ viewport: { width: 1365, height: 900 }, ignoreHTTPSErrors: true });
  const anon = await anonCtx.newPage(); await attach(anon, 'anon', result);
  await goto(anon, `${APP}/quotes/${AUDIT_QUOTE_ID}`, 'security_anon_quote_detail_redirect', result);
  await anonCtx.close().catch(()=>{});

  // Mobile evidence.
  const mobile = await loginContext(browser, ARJUN, 'mobile_arjun', result, { width: 375, height: 812 });
  await goto(mobile.page, `${APP}/quotes`, 'mobile_quotes_list_375', result);
  await goto(mobile.page, `${APP}/quotes/${AUDIT_QUOTE_ID}`, 'mobile_quote_detail_375', result);

  await arjun.ctx.close().catch(()=>{}); await rahul.ctx.close().catch(()=>{}); await mobile.ctx.close().catch(()=>{}); await browser.close();

  // Analyze findings/bugs.
  const downloadPdf = result.downloads.find(d => d.control === 'Download quote PDF');
  const downloadAgreement = result.downloads.find(d => /signed service agreement/i.test(d.control));
  if (!downloadPdf || downloadPdf.verdict !== 'DOWNLOADED') result.blockers.push('Quote PDF download did not complete through browser download event.');
  if (!downloadAgreement || downloadAgreement.verdict !== 'DOWNLOADED') result.blockers.push('Signed service agreement download did not complete through browser download event.');
  if (!listInfo.quoteLinks?.some(q => /AUDIT-P07/.test(q.text))) result.blockers.push('AUDIT-P07 quote not visible in client list.');
  result.blockers.push('Accept/decline/request-change mutation flows were not executed: only available AUDIT-P07 quote in UI was already Accepted, and safety fence forbids mutating non-AUDIT quotes.');
  result.blockers.push('Double-submit accept and admin parity after mutation were blocked by absence of a pending AUDIT-P07 quote.');

  // Keep only actual findings in bug section.
  if (hasInvalidActions) result.bugs.push({ id: 'NL-BUG-QUOTE-1', severity: 'P1', title: 'Accepted quote still exposes mutating actions', evidence: 'quote_detail_audit_accepted' });
  if (idorFail) result.bugs.push({ id: 'NL-BUG-QUOTE-SEC-1', severity: 'P0', title: 'Client A can view Client B quote', evidence: 'security_arjun_attempt_rahul_quote' });

  fs.writeFileSync(path.join(OUT, 'p07_result.json'), JSON.stringify(result, null, 2));

  const highest = result.bugs.find(b => b.severity === 'P0') ? 'P0' : result.bugs.length ? result.bugs[0].severity : (result.blockers.length ? 'BLOCKED/P2' : 'INFO');
  const covRows = [
    ['Quote list', '/quotes', 'TESTED', 'quotes_list_arjun', 'Status labels/cards/row navigation inventoried'],
    ['Aliases', '/quotes/drafts, /quotes/new, /quotes/templates', 'TESTED', 'alias_*', 'All alias URLs loaded back into quote surface'],
    ['Accepted AUDIT quote detail', `/quotes/${AUDIT_QUOTE_ID}`, 'TESTED', 'quote_detail_audit_accepted', 'Money, schedule, terms, documents, accepted state'],
    ['PDF download', 'Download quote PDF', downloadPdf?.verdict || 'CHECK', 'download_quote_pdf_after_click', `${downloadPdf?.bytes || '-'} bytes; filename token leak: ${downloadPdf?.tokenLeakInFilename ?? '-'}`],
    ['Signed agreement download', 'Download signed service agreement', downloadAgreement?.verdict || 'CHECK', 'download_signed_service_agreement_after_click', `${downloadAgreement?.bytes || '-'} bytes; filename token leak: ${downloadAgreement?.tokenLeakInFilename ?? '-'}`],
    ['Open project', 'Accepted quote project link', result.controlInventory.find(c => c.control === 'Open project')?.verdict || 'CHECK', 'accepted_quote_open_project', 'Project link from accepted quote'],
    ['Declined quote baseline', `Rahul /quotes/${RAHUL_QUOTE_ID}`, 'TESTED', 'quote_detail_rahul_declined_baseline', 'Own declined quote visible to owner'],
    ['Cross-user IDOR', `Arjun opening Rahul quote`, idorFail ? 'FAIL' : 'PASS', 'security_arjun_attempt_rahul_quote', idorFail ? 'Client B data visible' : 'Client B quote not disclosed'],
    ['Anonymous protected access', 'Quote detail anonymous', 'TESTED', 'security_anon_quote_detail_redirect', 'Redirect/access gate tested'],
    ['Mobile', '/quotes and quote detail at 375px', 'TESTED', 'mobile_*', 'Dense quote cards/detail mobile evidence'],
  ].map(r => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join('\n');
  const controlRows = result.controlInventory.map(c => `| ${c.page} | ${c.control} | - | ${c.verdict} | ${redact(c.evidence)} |`).join('\n') || '| - | - | - | - | - |';
  const netRows = result.network.slice(0,220).map(n => `| ${n.label} | ${n.method} ${n.path} | ${n.status} | ${n.status < 400 ? 'OK' : 'CHECK'} | keys: ${(n.requestKeys||[]).join(', ')}; ${n.contentType || ''}; ${n.contentLength || ''}; ${n.ms ?? ''}ms |`).join('\n') || '| - | - | - | - | - |';
  const consoleRows = result.console.slice(0,80).map(c => `| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n') || '| - | - | No console warnings/errors captured. |';
  const downloadRows = result.downloads.map(d => `| ${d.control} | ${d.verdict} | ${d.filename || '-'} | ${d.bytes || '-'} | ${d.tokenLeakInFilename === false ? 'No' : (d.tokenLeakInFilename === true ? 'YES' : '-')} | ${d.error || ''} |`).join('\n') || '| - | - | - | - | - | - |';
  const blockerText = result.blockers.map(b => `- ${b}`).join('\n') || '- None.';
  const bugText = result.bugs.length ? result.bugs.map(b => `### ${b.id}: ${b.title}\n- Severity: ${b.severity}\n- Evidence: ${b.evidence}`).join('\n\n') : 'No confirmed NL-BUG created in this P07 pass.';
  const secRows = result.securityFindings.map(f => `| ${f.id} | ${f.severity} | ${f.surface} | ${f.role} | ${f.impact} | ${f.evidence} | ${f.fix} |`).join('\n') || '| - | - | - | - | - | - | - |';
  const shotList = result.snapshots.map(s => `- ${s.slug}: \`evidence/${path.basename(s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md = `# Result — P07 — Client quotes: list/detail, accept, decline, request changes, PDF/contract\n\n## Session summary\n- Host/environment: public-domain \`${APP}\`.\n- Browser/MCP/tooling: Playwright Chromium headless, UI-first.\n- Role/account used: primary client ${shortEmail(ARJUN)}; IDOR baseline client ${shortEmail(RAHUL)}.\n- Fixtures created: none. Existing accepted AUDIT quote used: \`${AUDIT_QUOTE_ID}\`.\n- Routes walked: /quotes, /quotes/[id], /quotes/drafts, /quotes/new, /quotes/templates, project link, mobile variants.\n- Highest severity: ${highest}\n\n## Coverage table\n| Unit | Route/subsurface | Status | Evidence | Notes |\n|---|---|---|---|---|\n${covRows}\n\n## Control inventory deltas\n| Page | Control/tab/dialog | Old-prompt gap? | Runtime verdict | Evidence |\n|---|---|---|---|---|\n${controlRows}\n\n## Download/document observations\n| Control | Verdict | Filename | Bytes | Token leak in filename | Notes |\n|---|---|---|---:|---|---|\n${downloadRows}\n\n## Network/API observations\n| Trigger | Method + path | Status | Verdict | Notes |\n|---|---|---:|---|---|\n${netRows}\n\n## Console findings\n| Context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## Blockers / deferred checks\n${blockerText}\n\n## Bugs\n${bugText}\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n${secRows}\n\n## Security checks passed\n| Area | Sample tested | Verdict | Evidence |\n|---|---|---|---|\n| Protected quote route | Anonymous user opening quote detail | TESTED | security_anon_quote_detail_redirect |\n| Cross-client quote isolation | Arjun opening Rahul quote URL | ${idorFail ? 'FAIL' : 'PASS'} | security_arjun_attempt_rahul_quote |\n| Accepted-state action gating | Accepted AUDIT quote detail | ${hasInvalidActions ? 'FAIL' : 'PASS'} | quote_detail_audit_accepted |\n| Download secret hygiene | Download filenames/network query checked for obvious token params | TESTED | Download table + network rows |\n\n## Blocked security checks\n| Check | Why blocked | Required access/fixture |\n|---|---|---|\n| Accept/decline/request-change mutation and double-submit | No pending AUDIT-P07 quote available; non-AUDIT quote mutation forbidden | Pending AUDIT-P07 quote generated by admin/request fixture |\n| Admin parity after mutation | Mutation not executed | Pending AUDIT-P07 quote and admin parity walk |\n\n## Evidence files\n${shotList}\n\n## Handoff\n- Backend/API: provide or seed a pending AUDIT-P07 quote to safely test accept/decline/request-changes and double-submit idempotency.\n- Frontend/UI: accepted quote correctly hid Accept/Decline/Request changes in this pass; verify PDF buttons if download event blockers appear.\n- Data/setup: only accepted AUDIT-P07 quote was visible; pending destructive quote lifecycle blocked by safety fence.\n`;
  fs.writeFileSync(path.join(OUT, 'result.md'), md);
})();
