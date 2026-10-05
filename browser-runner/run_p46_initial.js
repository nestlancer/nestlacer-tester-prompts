const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/home/bhumukul-raj/Music/nestlacer-test-output/reports/P46';
const EVID = path.join(OUT, 'evidence');
fs.mkdirSync(EVID, { recursive: true });

const RUN_DATE = '20261005';
const hosts = {
  landing: 'https://nestlancer.com',
  app: 'https://app.nestlancer.com',
  admin: 'https://admin.nestlancer.com',
};
const creds = {
  adminEmail: 'admin@nestlancer.com',
  clientEmail: 'arjun.mehta@nestlancer.com',
  password: process.env.NESTLANCER_DEMO_PASSWORD || 'Brick2@Build',
};

function sanitizeUrl(u) {
  try {
    const url = new URL(u);
    for (const key of [...url.searchParams.keys()]) {
      if (/^x-amz-/i.test(key) || /token|code|otp|password|secret|signature|key|auth|session|cookie|credential|expires|signed/i.test(key)) {
        url.searchParams.set(key, '<redacted>');
      }
    }
    // Keep host/path for ordinary evidence, but never preserve signed/private object query credentials or private-media object keys.
    if (/s3\.nestlancer\.com$/i.test(url.hostname) && /private/i.test(url.pathname)) {
      url.pathname = '/<private-media-object-redacted>';
      url.search = '';
    }
    return url.toString();
  } catch { return String(u).replace(creds.password, '<redacted>'); }
}
function redact(s) {
  return String(s ?? '')
    .replaceAll(creds.password, '<redacted-password>')
    .replace(/([A-Za-z0-9._%+-]+)@nestlancer\.com/g, '<demo-email>@nestlancer.com')
    .replace(/(token|otp|code|secret|password|signature|cookie|authorization)(["'\s:=]+)([^\s"']+)/gi, '$1$2<redacted>')
    .slice(0, 12000);
}
async function attachCollectors(page, label, result) {
  const started = new Map();
  page.on('request', req => { started.set(req, Date.now()); });
  page.on('response', async res => {
    const req = res.request();
    const url = sanitizeUrl(res.url());
    const isInteresting = /nestlancer\.com/.test(url) && (req.resourceType() === 'document' || /\/api\//.test(url) || /auth|login|logout|requests|quotes|projects|payments|users|media|notifications|system|portfolio|blog|contact/i.test(url));
    if (!isInteresting) return;
    result.network.push({
      label, method: req.method(), url, path: (() => { try { const uu = new URL(url); return uu.pathname + uu.search; } catch { return url; } })(),
      status: res.status(), type: req.resourceType(), ms: started.has(req) ? Date.now() - started.get(req) : null,
    });
  });
  page.on('console', msg => {
    if (['error','warning'].includes(msg.type())) result.console.push({ label, type: msg.type(), text: redact(msg.text()) });
  });
  page.on('pageerror', err => result.console.push({ label, type: 'pageerror', text: redact(err.message || err.toString()) }));
}
async function snapshot(page, slug, result, extra = {}) {
  await page.waitForTimeout(750).catch(()=>{});
  const file = path.join(EVID, `${slug}.png`);
  await page.screenshot({ path: file, fullPage: true }).catch(e => result.notes.push(`Screenshot failed for ${slug}: ${e.message}`));
  const title = await page.title().catch(()=> '');
  const url = sanitizeUrl(page.url());
  const text = redact(await page.locator('body').innerText({ timeout: 3000 }).catch(()=>''));
  fs.writeFileSync(path.join(EVID, `${slug}.txt`), `URL: ${url}\nTITLE: ${title}\n\n${text}`);
  const visibleStats = await page.evaluate(() => {
    const bodyText = document.body?.innerText || '';
    const links = [...document.querySelectorAll('a[href]')].slice(0,80).map(a => ({ text: (a.textContent||'').trim().slice(0,80), href: a.getAttribute('href') }));
    const buttons = [...document.querySelectorAll('button, [role="button"]')].slice(0,80).map(b => (b.textContent||b.getAttribute('aria-label')||'').trim().slice(0,80)).filter(Boolean);
    const inputs = [...document.querySelectorAll('input, textarea, select')].slice(0,60).map(i => ({ tag: i.tagName, type: i.getAttribute('type'), name: i.getAttribute('name'), placeholder: i.getAttribute('placeholder'), aria: i.getAttribute('aria-label') }));
    const cards = document.querySelectorAll('article, [data-testid*=card], .card, [class*=Card], li').length;
    const tables = document.querySelectorAll('table').length;
    return { h1: document.querySelector('h1')?.textContent?.trim() || '', bodyChars: bodyText.length, links, buttons, inputs, cards, tables };
  }).catch(e => ({ error: e.message }));
  result.snapshots.push({ slug, file, title, url, visibleStats, ...extra });
  return { title, url, text, visibleStats };
}
async function gotoSnap(page, url, slug, result, opts={}) {
  const rec = { slug, requestedUrl: url, ok: false };
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: opts.timeout || 45000 });
    rec.status = res ? res.status() : null;
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
    const snap = await snapshot(page, slug, result, { requestedUrl: url, status: rec.status });
    rec.finalUrl = snap.url; rec.title = snap.title; rec.ok = !!res && rec.status < 500;
  } catch (e) {
    rec.error = e.message;
    try { await snapshot(page, `${slug}_error`, result, { requestedUrl: url, error: e.message }); } catch {}
  }
  result.visits.push(rec);
  return rec;
}
async function fillByCandidates(page, candidates, value) {
  for (const sel of candidates) {
    const loc = page.locator(sel).first();
    if (await loc.count().catch(()=>0)) {
      try { await loc.fill(value, { timeout: 3000 }); return sel; } catch {}
    }
  }
  return null;
}
async function clickLogin(page) {
  const candidates = [
    'button[type="submit"]',
    'button:has-text("Sign in")', 'button:has-text("Login")', 'button:has-text("Log in")',
    'input[type="submit"]'
  ];
  for (const sel of candidates) {
    const loc = page.locator(sel).first();
    if (await loc.count().catch(()=>0)) {
      try { await loc.click({ timeout: 3000 }); return sel; } catch {}
    }
  }
  await page.keyboard.press('Enter').catch(()=>{});
  return 'keyboard Enter';
}
async function login(page, base, email, label, result) {
  const loginUrl = `${base}/login`;
  await gotoSnap(page, loginUrl, `${label}_login_before`, result);
  // Remove cookie banner if it blocks pointer/focus.
  for (const text of ['Accept', 'Dismiss']) {
    try {
      const b = page.getByRole('button', { name: text }).first();
      if (await b.isVisible({ timeout: 700 })) await b.click({ timeout: 1000 });
    } catch {}
  }
  const emailSel = await fillByCandidates(page, ['input[type="email"]', 'input[name="email"]', 'input[autocomplete="email"]', 'input[id*="email" i]'], email);
  const pwSel = await fillByCandidates(page, ['input[type="password"]', 'input[name="password"]', 'input[autocomplete="current-password"]', 'input[id*="password" i]'], creds.password);
  let submitSel = null;
  let postSubmitUrl = page.url();
  if (emailSel && pwSel) {
    const urlWait = page.waitForURL(u => !u.pathname.includes('/login'), { timeout: 25000 }).catch(() => null);
    submitSel = await clickLogin(page);
    await urlWait;
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(()=>{});
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(()=>{});
    await page.waitForTimeout(2000);
    postSubmitUrl = page.url();
  }
  let after = await snapshot(page, `${label}_login_after`, result, { loginEmail: email.replace(/^[^@]+/, '<demo-email>'), emailSel, pwSel, submitSel });
  let success = false;
  try {
    const u = new URL(after.url);
    success = !u.pathname.includes('/login') && !/invalid|incorrect|captcha|turnstile|failed|error/i.test(after.text.slice(0,4000));
  } catch {}
  // Some Next.js login forms set cookies then leave the button in a transient state; prove cookie/session by navigating to dashboard.
  let dashboardProof = null;
  if (!success) {
    await page.goto(`${base}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(()=>{});
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(()=>{});
    await page.waitForTimeout(1500);
    dashboardProof = await snapshot(page, `${label}_dashboard_after_login_probe`, result, { loginEmail: email.replace(/^[^@]+/, '<demo-email>'), emailSel, pwSel, submitSel, postSubmitUrl });
    try {
      const du = new URL(dashboardProof.url);
      success = !du.pathname.includes('/login') && /dashboard|command center|welcome back|operations|client portal/i.test(dashboardProof.text.slice(0,4000));
      after = dashboardProof;
    } catch {}
  }
  result.logins.push({ label, loginUrl, email: email.replace(/^[^@]+/, '<demo-email>'), emailSel, pwSel, submitSel, postSubmitUrl: sanitizeUrl(postSubmitUrl), finalUrl: after.url, title: after.title, success, visibleTextSample: redact(after.text.slice(0,2000)) });
  return success;
}
async function countText(page) {
  const text = await page.locator('body').innerText({ timeout: 5000 }).catch(()=> '');
  return redact(text);
}

(async () => {
  const result = {
    prompt: 'P46',
    generatedAt: new Date().toISOString(),
    mode: 'public-domain authorized by user',
    mutationScope: 'runbook demo-production allowed on confirmed demo/audit data; this initial pass performs no destructive final-confirm actions',
    browser: 'Playwright Chromium headless',
    visits: [], snapshots: [], network: [], console: [], logins: [], seedChecks: [], notes: [], blockers: [], bugs: []
  };
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  await attachCollectors(page, 'main', result);

  // Public portal reachability and seed-visible public content.
  await gotoSnap(page, hosts.landing + '/', 'landing_home', result);
  await gotoSnap(page, hosts.landing + '/blog?audit=P46-' + RUN_DATE, 'landing_blog_redirect', result);
  await gotoSnap(page, hosts.landing + '/portfolio?audit=P46-' + RUN_DATE, 'landing_portfolio_redirect', result);
  await gotoSnap(page, hosts.app + '/', 'app_public_home', result);
  await gotoSnap(page, hosts.app + '/blog?audit=P46-' + RUN_DATE, 'app_blog', result);
  await gotoSnap(page, hosts.app + '/portfolio?audit=P46-' + RUN_DATE, 'app_portfolio', result);
  await gotoSnap(page, hosts.app + '/verify-document', 'app_verify_document', result);

  // Client login and core demo fixture pages.
  const clientOk = await login(page, hosts.app, creds.clientEmail, 'client', result);
  if (clientOk) {
    for (const [slug, route] of Object.entries({
      client_dashboard: '/dashboard', client_requests: '/requests', client_quotes: '/quotes', client_projects: '/projects', client_payments: '/payments', client_invoices: '/invoices', client_messages: '/messages', client_notifications: '/notifications', client_settings_files: '/settings/files'
    })) {
      await gotoSnap(page, hosts.app + route, slug, result);
    }
  } else {
    result.blockers.push('Client login failed or remained on /login; client fixture pages were not walked. See client_login_after evidence.');
  }

  // Separate admin context.
  const adminContext = await browser.newContext({ viewport: { width: 1365, height: 900 }, ignoreHTTPSErrors: true });
  const adminPage = await adminContext.newPage();
  await attachCollectors(adminPage, 'admin', result);
  await gotoSnap(adminPage, hosts.admin + '/', 'admin_gate_home', result);
  const adminOk = await login(adminPage, hosts.admin, creds.adminEmail, 'admin', result);
  if (adminOk) {
    for (const [slug, route] of Object.entries({
      admin_dashboard: '/dashboard', admin_users: '/users', admin_contact: '/contact', admin_requests: '/requests', admin_quotes: '/quotes', admin_projects: '/projects', admin_payments: '/payments', admin_payment_accounts: '/payments/accounts', admin_media: '/media', admin_notifications: '/notifications', admin_system: '/system', admin_system_features: '/system?tab=features', admin_system_templates: '/system?tab=templates', admin_content: '/content', admin_portfolio: '/portfolio', admin_integrations: '/integrations', admin_audit: '/audit'
    })) {
      await gotoSnap(adminPage, hosts.admin + route, slug, result);
    }
  } else {
    result.blockers.push('Admin login failed or remained on /login; admin fixture/catalog pages were not walked. See admin_login_after evidence.');
  }

  // Derive coarse seed/catalog observations from saved body text.
  const expectations = [
    ['Blog posts/categories/tags', 'app_blog.txt', ['blog','category','tag','articles','insights']],
    ['Portfolio categories/items', 'app_portfolio.txt', ['portfolio','case study','projects','view case']],
    ['Client demo work objects', 'client_dashboard.txt', ['project','request','quote','payment','invoice']],
    ['Admin users/demo accounts', 'admin_users.txt', ['admin@nestlancer.com','arjun','rahul','users','client']],
    ['Admin feature flags/templates', 'admin_system_templates.txt', ['template','notification','email','feature']],
    ['Admin payments/accounts', 'admin_payment_accounts.txt', ['payment','account','legal','razorpay']],
    ['Admin media/content', 'admin_media.txt', ['media','storage','quarantine','file']],
  ];
  for (const [category, txtFile, needles] of expectations) {
    const p = path.join(EVID, txtFile);
    if (fs.existsSync(p)) {
      const text = fs.readFileSync(p, 'utf8').toLowerCase();
      const found = needles.filter(n => text.includes(n.toLowerCase()));
      result.seedChecks.push({ category, source: txtFile, signalsFound: found, verdict: found.length ? 'PARTIAL_PASS_VISIBLE_SIGNALS' : 'NO_VISIBLE_SIGNAL' });
    } else {
      result.seedChecks.push({ category, source: txtFile, signalsFound: [], verdict: 'BLOCKED_NO_PAGE_EVIDENCE' });
    }
  }

  fs.writeFileSync(path.join(OUT, 'p46_initial_result.json'), JSON.stringify(result, null, 2));

  // Markdown report.
  const highest = result.blockers.length ? 'BLOCKED/P1' : (result.console.some(c => c.type === 'error' || c.type === 'pageerror') ? 'P2/INFO' : 'INFO');
  const rows = result.visits.map(v => `| ${v.slug} | ${v.status ?? ''} | ${v.ok ? 'PASS' : 'CHECK'} | ${v.finalUrl || ''} | ${v.error ? redact(v.error) : ''} |`).join('\n');
  const loginRows = result.logins.map(l => `| ${l.label} | ${l.success ? 'PASS' : 'BLOCKED'} | ${l.finalUrl} | ${l.emailSel || ''} / ${l.pwSel || ''} / ${l.submitSel || ''} |`).join('\n');
  const seedRows = result.seedChecks.map(s => `| ${s.category} | ${s.source} | ${s.verdict} | ${s.signalsFound.join(', ') || '-'} |`).join('\n');
  const blockers = result.blockers.map(b => `- ${b}`).join('\n') || '- None in initial non-destructive pass.';
  const consoleRows = result.console.slice(0,80).map(c => `| ${c.label} | ${c.type} | ${redact(c.text).replace(/\n/g,' ')} |`).join('\n') || '| - | - | No console warnings/errors captured in limited pass. |';
  const networkRows = result.network.slice(0,120).map(n => `| ${n.label} | ${n.method} | ${n.status} | ${n.type} | ${n.path} | ${n.ms ?? ''} |`).join('\n') || '| - | - | - | - | No network rows captured. |';
  const shotList = result.snapshots.map(s => `- ${s.slug}: \`${path.relative(OUT, s.file)}\` — ${s.title} — ${s.url}`).join('\n');
  const md = `# Result — P46 — Demo seed fixtures and destructive-flow readiness\n\n## Summary\n- Environment: public-domain mode, Nestlancer canonical hosts.\n- Browser/MCP/tooling: Playwright Chromium headless, UI pages only for this initial pass.\n- Role/account used: admin demo + primary client demo; secrets redacted.\n- Mutation mode approved by user: runbook demo-production. Initial run intentionally performed **no final destructive confirmation** until fixture pages and login viability were proven.\n- Highest severity: ${highest}\n\n## Portal/page coverage\n| Unit | HTTP/status | Runtime status | Final URL | Notes |\n|---|---:|---|---|---|\n${rows}\n\n## Login checks\n| Role | Verdict | Final URL | Selectors used |\n|---|---|---|---|\n${loginRows}\n\n## Seed/catalog visible-signal checks\n| Category | Evidence source | Verdict | Signals found |\n|---|---|---|---|\n${seedRows}\n\n## Blockers / gaps before destructive cycles\n${blockers}\n\n## Console findings\n| Page context | Type | Message |\n|---|---|---|\n${consoleRows}\n\n## UI-triggered network observations (redacted)\n| Context | Method | Status | Type | Path | ms |\n|---|---|---:|---|---|---:|\n${networkRows}\n\n## Evidence files\n${shotList}\n\n## Next actions for full P46 closure\n1. If both logins passed, continue within authenticated UI to create AUDIT-P46-20261005 records for request/contact/media/template-safe areas.\n2. Execute destructive cycles only on confirmed AUDIT/demo records, including before/after screenshots and audit-log evidence.\n3. Keep external email/webhook/payment/push checks BLOCKED unless an approved sink/test rail appears in the UI.\n4. Map every P01-P47/A01-A20 prompt to a fixture in the ledger.\n\n## Security findings\n| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |\n|---|---|---|---|---|---|---|\n| - | - | - | - | No exploitable security defect concluded in initial non-destructive pass. | See evidence and console/network observations. | Continue full P46 and S01. |\n\n## Blocked security checks\n| Check | Why blocked | Required access/fixture |\n|---|---|---|\n| External email/webhook/payment/push sink validation | User selected mark blocked unless already available; no external sink/test rail provided. | Approved mail sink, webhook HTTPS sink, payment test rail, push target. |\n`;
  fs.writeFileSync(path.join(OUT, 'result.md'), md);
  await browser.close();
})();
