'use strict';
/* ui_sweep.js — Playwright walk of every code-derived frontend route on
 * landing / web (client portal) / admin, with the correct demo session.
 * Captures: final URL, HTTP status, title, console errors, page errors,
 * failed requests, h1/error-state detection, screenshot.
 * Feeds reports for P01–P47 and S06/S07-style UI security checks.
 *
 * Usage: node ui_sweep.js [--app landing|web|admin] [--limit N] [--headful]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { HOSTS, ACCOUNTS, outDir, writeJson, sleep } = require('./lib/http');

const ROUTE_MAP = path.join(__dirname, '..', '02-source-inventories', 'frontend-route-map.md');
const OUT = outDir('ui');
const SHOTS = outDir('ui/screenshots');

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const ONLY_APP = getArg('--app', null);
const LIMIT = Number(getArg('--limit', '0')) || 0;

function parseRoutes() {
  const lines = fs.readFileSync(ROUTE_MAP, 'utf8').split('\n');
  let app = null;
  const routes = [];
  for (const line of lines) {
    const a = line.match(/^##\s+(\w[\w-]*)/);
    if (a) { app = a[1].trim(); continue; }
    const m = line.match(/^-\s+`([^`]+)`\s+—\s+`([^`]+)`(.*)$/);
    if (m && app) routes.push({ app, route: m[1], source: m[2], note: (m[3] || '').replace(/^\s*—\s*/, '').trim() });
  }
  return routes;
}

// dynamic segment substitution uses ids harvested from the API sweep when present
function loadApiIds() {
  const f = path.join(outDir('api'), 'api-sweep.json');
  const ids = {};
  if (!fs.existsSync(f)) return ids;
  try {
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const r of d.results || []) {
      if (r.idUsed && r.resourceKey) ids[r.resourceKey.replace(/^admin\//, '')] = r.idUsed;
    }
  } catch (_) { /* ignore */ }
  return ids;
}

function hostFor(app) {
  if (app === 'landing') return HOSTS.landing;
  if (app === 'admin') return HOSTS.admin;
  return HOSTS.web;
}

function fill(route, ids) {
  const dyn = route.match(/\[[^\]]+\]/g);
  if (!dyn) return { url: route, dynamic: false, resolved: true };
  let out = route;
  const resource = route.split('/').filter(Boolean)[0];
  for (const token of dyn) {
    const name = token.replace(/[[\]().]/g, '').toLowerCase();
    let v = ids[resource] || ids[resource.replace(/s$/, '')] || null;
    if (!v && /slug/.test(name)) v = null;
    if (!v) return { url: route, dynamic: true, resolved: false };
    out = out.replace(token, v);
  }
  return { url: out, dynamic: true, resolved: true };
}

async function loginUi(context, app) {
  if (app === 'landing') return { loggedIn: false, note: 'public app' };
  const acct = app === 'admin' ? ACCOUNTS.admin : ACCOUNTS.clientA;
  const page = await context.newPage();
  const base = hostFor(app);
  try {
    await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.fill('input[type="email"], input[name="email"]', acct.email);
    await page.fill('input[type="password"], input[name="password"]', acct.password);
    await Promise.all([
      page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(4000);
    const url = page.url();
    const loggedIn = !/\/login/.test(url);
    await page.screenshot({ path: path.join(SHOTS, `login-${app}.png`), fullPage: false }).catch(() => {});
    await page.close();
    return { loggedIn, finalUrl: url, account: acct.email };
  } catch (e) {
    await page.close().catch(() => {});
    return { loggedIn: false, error: String(e.message || e), account: acct.email };
  }
}

async function visit(context, app, route, target) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failed = [];
  const apiCalls = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => pageErrors.push(String(e.message).slice(0, 300)));
  page.on('requestfailed', (r) => failed.push(`${r.method()} ${r.url().slice(0, 160)} :: ${(r.failure() || {}).errorText}`));
  page.on('response', (r) => {
    const u = r.url();
    if (/\/api\/(v1|auth)\//.test(u) && r.status() >= 400) apiCalls.push(`${r.status()} ${r.request().method()} ${u.slice(0, 160)}`);
  });
  const url = hostFor(app) + target;
  const started = Date.now();
  let status = 0; let finalUrl = url; let title = ''; let h1 = ''; let bodyFlags = [];
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    status = resp ? resp.status() : 0;
    await page.waitForTimeout(2500);
    finalUrl = page.url();
    title = (await page.title().catch(() => '')) || '';
    h1 = (await page.locator('h1').first().innerText({ timeout: 3000 }).catch(() => '')) || '';
    const body = (await page.locator('body').innerText({ timeout: 5000 }).catch(() => '')) || '';
    const checks = [
      [/404|not found/i, 'NOT_FOUND_TEXT'],
      [/something went wrong|unexpected error|application error/i, 'ERROR_BOUNDARY'],
      [/failed to (load|fetch)|unable to load/i, 'LOAD_FAILURE_TEXT'],
      [/access denied|unauthorized|forbidden/i, 'ACCESS_DENIED_TEXT'],
      [/no data|nothing here|empty/i, 'EMPTY_STATE'],
    ];
    bodyFlags = checks.filter(([re]) => re.test(body)).map(([, f]) => f);
    const shot = path.join(SHOTS, `${app}${target.replace(/[^a-z0-9]+/gi, '_') || '_root'}.png`.slice(0, 180));
    await page.screenshot({ path: shot }).catch(() => {});
    var screenshot = path.basename(shot);
  } catch (e) {
    bodyFlags.push('NAV_ERROR');
    var navError = String(e.message || e).slice(0, 200);
  }
  await page.close().catch(() => {});

  const flags = [...bodyFlags];
  if (status >= 500) flags.push('HTTP_5XX');
  if (status === 404) flags.push('HTTP_404');
  if (pageErrors.length) flags.push('JS_PAGE_ERROR');
  if (apiCalls.length) flags.push('API_4XX_5XX');
  if (/\/login/.test(finalUrl) && !/\/login/.test(target)) flags.push('REDIRECT_TO_LOGIN');
  const verdict = flags.some((f) => ['HTTP_5XX', 'JS_PAGE_ERROR', 'ERROR_BOUNDARY', 'NAV_ERROR'].includes(f)) ? 'FAIL'
    : flags.length ? 'REVIEW' : 'PASS';

  return {
    app, route, target, status, finalUrl, title, h1, ms: Date.now() - started,
    consoleErrors: consoleErrors.slice(0, 5), pageErrors: pageErrors.slice(0, 3),
    failedRequests: failed.slice(0, 5), apiErrors: apiCalls.slice(0, 8),
    flags, verdict, screenshot: typeof screenshot !== 'undefined' ? screenshot : null,
    navError: typeof navError !== 'undefined' ? navError : null,
  };
}

(async () => {
  const ids = loadApiIds();
  let routes = parseRoutes();
  if (ONLY_APP) routes = routes.filter((r) => r.app === ONLY_APP);
  if (LIMIT) routes = routes.slice(0, LIMIT);
  console.log(`[ui] ${routes.length} routes; ids harvested: ${Object.keys(ids).length}`);

  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const outFile = path.join(OUT, 'ui-sweep.json');
  // merge mode: keep results from apps not being swept this run
  let prev = null;
  try { prev = JSON.parse(require('fs').readFileSync(outFile, 'utf8')); } catch (_) { prev = null; }
  const sweptApps = new Set(routes.map((r) => r.app));
  const results = ((prev && Array.isArray(prev.results)) ? prev.results : []).filter((r) => !sweptApps.has(r.app));
  const sessions = (prev && prev.sessions) || {};
  const apps = [...new Set(routes.map((r) => r.app))];

  for (const app of apps) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
    const auth = await loginUi(context, app);
    sessions[app] = auth;
    console.log(`[ui] ${app} login:`, JSON.stringify(auth));
    const appRoutes = routes.filter((r) => r.app === app);
    let n = 0;
    for (const r of appRoutes) {
      n += 1;
      const f = fill(r.route, ids);
      if (!f.resolved) {
        results.push({ app, route: r.route, target: r.route, verdict: 'SKIPPED_NO_ID', flags: ['DYNAMIC_ID_UNRESOLVED'], source: r.source });
        continue;
      }
      const res = await visit(context, app, r.route, f.url);
      res.source = r.source; res.note = r.note;
      results.push(res);
      console.log(`  [${app} ${n}/${appRoutes.length}] ${f.url} -> ${res.status} ${res.verdict} ${res.flags.join(',')}`);
      writeJson(outFile, { generatedAt: new Date().toISOString(), hosts: HOSTS, sessions, results });
      await sleep(150);
    }
    await context.close();
  }
  await browser.close();

  writeJson(outFile, {
    generatedAt: new Date().toISOString(), hosts: HOSTS, sessions,
    totals: {
      routes: results.length,
      pass: results.filter((r) => r.verdict === 'PASS').length,
      review: results.filter((r) => r.verdict === 'REVIEW').length,
      fail: results.filter((r) => r.verdict === 'FAIL').length,
      skipped: results.filter((r) => r.verdict === 'SKIPPED_NO_ID').length,
    },
    results,
  });
  console.log('[done] wrote', path.join(OUT, 'ui-sweep.json'));
})();
