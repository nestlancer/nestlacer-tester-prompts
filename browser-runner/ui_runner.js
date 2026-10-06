'use strict';
/* ui_runner.js — executes the P01-P47 UI prompt family with Playwright.
 * Walks every unique (app, role, route) once at desktop 1366x768 and again
 * at mobile 375x812, capturing: document status, final URL, console/page
 * errors, failed network requests, API traffic, a quick a11y scan and a
 * screenshot. Per-prompt evidence is then projected from the shared walk.
 *
 *   node ui_runner.js            # all P prompts
 *   node ui_runner.js P04 P05    # selected
 *
 * Evidence: $NL_OUT/evidence/ui-walk.json + $NL_OUT/evidence/<PID>.json
 * Screenshots: $NL_OUT/screenshots/
 */
const path = require('path');
const { chromium } = require('playwright');
const { HOSTS, ACCOUNTS, outDir, writeJson } = require('./lib/http');
const { UI } = require('./lib/prompts');

const log = (...a) => console.log(...a);
const DESKTOP = { width: 1366, height: 768 };
const MOBILE = { width: 375, height: 812 };
const SHOTS = outDir('screenshots');

const redactStr = (s) => String(s)
  .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer <redacted>')
  .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '<jwt>')
  .replace(/Brick2@Build/g, '<password>');

const routeSlug = (r) => r.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'root';

/* ------------------------------------------------------- route helpers */
const PUBLIC_HINTS = ['/login', '/register', '/forgot-password', '/reset-password',
  '/verify-email', '/verify', '/terms', '/privacy', '/contact', '/about', '/blog',
  '/portfolio', '/services', '/pricing', '/work', '/share/', '/.well-known', '/llms', '/'];

function isLikelyPublic(route) {
  return PUBLIC_HINTS.some((h) => route === h || route.startsWith(h.trimEnd('/')));
}

/** Plain XML/text machine docs — browser chrome often scrolls wider than viewport. */
function isPlainDocumentRoute(route) {
  return /\.(xml|txt|json|csv|webmanifest)$/i.test(route)
    || /\/(robots\.txt|sitemap\.xml)$/i.test(route)
    || /\/\.well-known\//i.test(route);
}

/** Form-based login against the real portal login page. */
async function uiLogin(page, base, email, password) {
  await page.goto(base + '/login', { waitUntil: 'domcontentloaded', timeout: 25000 });
  const emailSel = 'input[type="email"], input[name="email"], input[autocomplete="username"], input#email, input[placeholder*="mail" i]';
  await page.waitForSelector(emailSel, { timeout: 10000 });
  await page.fill(emailSel, email);
  await page.fill('input[type="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null),
    page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Continue")'),
  ]);
  await page.waitForTimeout(1500);
  const url = page.url();
  if (/\/(2fa|mfa|verify-email|verify-otp)/i.test(url)) return '2FA-PROMPT';
  return url.includes('/login') ? 'FAIL' : 'OK';
}

/* ------------------------------------------------------------- a11y */
const a11yScript = `(() => {
  const doc = document;
  return {
    lang: doc.documentElement.lang || null,
    title: doc.title || null,
    h1Count: doc.querySelectorAll('h1').length,
    mainCount: doc.querySelectorAll('main, [role="main"]').length,
    imgsNoAlt: [...doc.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    inputsNoLabel: [...doc.querySelectorAll('input,select,textarea')].filter((el) => {
      if (el.type === 'hidden') return false;
      if (el.labels && el.labels.length) return false;
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
      if (el.id && doc.querySelector('label[for="' + el.id + '"]')) return false;
      return true;
    }).length,
    linksNoName: [...doc.querySelectorAll('a')].filter((a) => !a.textContent.trim()
      && !a.getAttribute('aria-label')).length,
    buttonsNoName: [...doc.querySelectorAll('button')].filter((b) => !b.textContent.trim()
      && !b.getAttribute('aria-label')).length,
  };
})()`;

/* -------------------------------------------------------------- visit */
async function visit(v, contexts) {
  const out = { app: v.app, role: v.role, route: v.route, prompts: [...v.prompts].sort() };
  for (const kind of ['desktop', 'mobile']) {
    const entry = await getCtx(contexts, v.app, v.role, kind);
    if (!entry.ready) {
      out[kind] = { blocked: true, reason: entry.loginError || 'context not ready' };
      continue;
    }
    const page = await entry.ctx.newPage();
    await page.setViewportSize(kind === 'desktop' ? DESKTOP : MOBILE);
    const col = { console: [], warns: [], pageErrors: [], failed: [], httpErr: [], api: [], prefetchAbort: 0 };
    page.on('console', (m) => {
      const t = m.type(); const msg = redactStr(m.text()).slice(0, 300);
      if (t === 'error') col.console.push(msg); else if (t === 'warning') col.warns.push(msg);
    });
    page.on('pageerror', (e) => col.pageErrors.push(redactStr(e).slice(0, 300)));
    page.on('requestfailed', (r) => {
      const url = redactStr(r.url()).slice(0, 200);
      const err = (r.failure() || {}).errorText || '';
      // Next.js RSC prefetch and BFF auth probes aborted on navigation are
      // artifacts, not asset failures — track separately, keep evidence.
      if (err === 'net::ERR_ABORTED' && (/_rsc=/.test(url) || /\/api\/auth\//.test(url))) {
        col.prefetchAbort = (col.prefetchAbort || 0) + 1;
        return;
      }
      col.failed.push({ url, error: err });
    });
    page.on('response', (r) => {
      try {
        const u = new URL(r.url());
        if (u.hostname === 'api.nestlancer.com') {
          col.api.push({ m: r.request().method(), p: u.pathname, s: r.status() });
        } else if (r.status() >= 400) {
          col.httpErr.push({ url: redactStr(r.url()).slice(0, 200), s: r.status() });
        }
      } catch (_) { /* noop */ }
    });
    const t0 = Date.now();
    let resp = null;
    try {
      resp = await page.goto(HOSTS[v.app] + v.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('load', { timeout: 10000 }).catch(() => null);
    } catch (e) {
      out[kind] = { error: redactStr(e.message).split('\n')[0], blocked: false };
      await page.close().catch(() => null);
      continue;
    }
    await page.waitForTimeout(750);
    const rec = {
      status: resp ? resp.status() : 0,
      finalUrl: redactStr(page.url()),
      timingMs: Date.now() - t0,
      consoleErrors: [...new Set(col.console)].slice(0, 50),
      consoleWarnings: [...new Set(col.warns)].slice(0, 20),
      pageErrors: [...new Set(col.pageErrors)].slice(0, 20),
      failedRequests: col.failed.slice(0, 30),
      httpErrors: col.httpErr.slice(0, 30),
      apiCalls: col.api.slice(0, 60),
      prefetchAborts: col.prefetchAbort || 0,
      a11y: await page.evaluate(a11yScript).catch(() => null),
    };
    if (kind === 'mobile') {
      rec.horizontalOverflow = await page.evaluate(
        'document.scrollingElement.scrollWidth > document.documentElement.clientWidth').catch(() => null);
    }
    const ct = (resp && resp.headers()['content-type']) || '';
    const plainDoc = isPlainDocumentRoute(v.route)
      || /^(text\/(plain|xml)|application\/(xml|json|rss\+xml|atom\+xml))/i.test(ct);
    const shot = `${v.app}-${routeSlug(v.route)}-${kind}.png`;
    try { await page.screenshot({ path: path.join(SHOTS, shot), fullPage: kind === 'desktop' }); rec.screenshot = shot; }
    catch (_) { /* noop */ }
    rec.verdict = (() => {
      if (rec.status >= 500) return 'FAIL-5XX';
      if (rec.status >= 400) return /(nl-unknown-404|nl-invalid)/.test(v.route) ? 'PASS-EXPECTED-4XX' : 'FAIL-4XX';
      // Authenticated roles must not silently land on the login page.
      if (v.role !== 'anon' && /\/(login|register)(\?|$)/i.test(rec.finalUrl)) return 'FAIL-AUTH-REDIRECT';
      if (v.role === 'anon' && !isLikelyPublic(v.route) && /\/(login|register)/.test(rec.finalUrl)) return 'REDIRECT-TO-LOGIN (PASS)';
      if (rec.pageErrors.length) return 'PAGE-ERROR';
      if (rec.failedRequests.length) return 'ASSET-BLOCKED';
      if (rec.consoleErrors.length) {
        // Intentional hard-404 probes log a browser "Failed to load resource: 404".
        if (/(nl-unknown-404|nl-invalid)/.test(v.route)
          && rec.consoleErrors.every((e) => /status of 404|404 \(/.test(String(e)))) {
          /* ignore expected 404 console noise */
        } else {
          return 'CONSOLE-ERRORS';
        }
      }
      if (rec.horizontalOverflow && !plainDoc) return 'OVERFLOW-X';
      return 'PASS';
    })();
    out[kind] = rec;
    await page.close().catch(() => null);
  }
  return out;
}

const loginState = { done: {} };
async function getCtx(contexts, app, role, _kind) {
  // One browser context per app|role. Viewport is switched per visit so
  // HttpOnly session cookies (Playwright expires:-1) stay intact — cloning
  // via storageState drops them and authenticated walks land on /login.
  const key = [app, role].join('|');
  if (contexts.has(key)) return contexts.get(key);
  const base = HOSTS[app];
  const entry = { ctx: null, ready: false, loginError: null };
  contexts.set(key, entry);
  entry.ctx = await getCtx.browser.newContext({
    viewport: DESKTOP,
    baseURL: base,
  });
  if (role === 'anon') {
    entry.ready = true;
    return entry;
  }
  const lk = app + '|' + role;
  loginState.done[lk] = { result: 'FAIL', error: null };
  const page = await entry.ctx.newPage();
  try {
    const acc = ACCOUNTS[role];
    const r = await uiLogin(page, base, acc.email, acc.password);
    loginState.done[lk] = {
      result: r === 'FAIL' ? 'FAIL' : 'OK',
      error: r === '2FA-PROMPT' ? '2fa page' : null,
    };
    if (r === 'OK') entry.ready = true;
    else {
      entry.loginError = r === '2FA-PROMPT'
        ? 'login landed on 2FA/verify screen'
        : 'form login did not leave /login';
    }
  } catch (e) {
    loginState.done[lk] = { result: 'FAIL', error: redactStr(e.message).split('\n')[0] };
    entry.loginError = loginState.done[lk].error;
  }
  await page.close().catch(() => null);
  return entry;
}

/* --------------------------------------------------------------- main */
function reclassifyRow(row) {
  for (const kind of ['desktop', 'mobile']) {
    const r = row[kind];
    if (!r || r.blocked || r.error) continue;
    const aborts = (r.failedRequests || []).filter((f) => f.error === 'net::ERR_ABORTED'
      && (/_rsc=/.test(f.url || '') || /\/api\/auth\//.test(f.url || '')));
    if (aborts.length) {
      r.prefetchAborts = (r.prefetchAborts || 0) + aborts.length;
      r.failedRequests = (r.failedRequests || []).filter((f) => !aborts.includes(f));
    }
    if ((r.failedRequests || []).length && r.verdict === 'PASS') r.verdict = 'ASSET-BLOCKED';
    // Plain XML/text machine docs: drop false-positive mobile OVERFLOW-X.
    if (r.verdict === 'OVERFLOW-X' && isPlainDocumentRoute(row.route)) r.verdict = 'PASS';
    // Intentional hard-404 probes: browser console 404 noise is expected.
    if (r.verdict === 'CONSOLE-ERRORS' && /(nl-unknown-404|nl-invalid)/.test(row.route)
      && (r.consoleErrors || []).every((e) => /status of 404|404 \(/.test(String(e)))) {
      r.verdict = r.status >= 400 ? 'PASS-EXPECTED-4XX' : 'PASS';
    }
    // Auth roles redirected to login are failures (missed session / cookie).
    if (row.role !== 'anon' && r.finalUrl && /\/(login|register)(\?|$)/i.test(r.finalUrl)
      && !['FAIL-AUTH-REDIRECT', 'BLOCKED', 'NAV-ERROR'].includes(r.verdict)) {
      r.verdict = 'FAIL-AUTH-REDIRECT';
    }
  }
  return row;
}

function projectPrompts(rows, runList) {
  const { outDir } = require('./lib/http');
  for (const pid of runList) {
    const mine = rows.filter((r) => r.prompts.includes(pid));
    const summary = {};
    for (const r of mine) for (const kind of ['desktop', 'mobile']) {
      const v = r[kind]?.verdict || (r[kind]?.blocked ? 'BLOCKED' : (r[kind]?.error ? 'NAV-ERROR' : 'NONE'));
      summary[v] = (summary[v] || 0) + 1;
    }
    writeJson(path.join(outDir('evidence'), `${pid}.json`),
      { id: pid, title: UI[pid].title, app: UI[pid].app, role: UI[pid].role || 'anon',
        generatedAt: new Date().toISOString(), verdictSummary: summary, routes: mine });
  }
}

async function main() {
  // reproject-only mode: reuse ui-walk.json, reclassify, rewrite per-prompt files
  if (process.argv.includes('--reproject')) {
    const fs = require('fs');
    const wf = path.join(outDir('evidence'), 'ui-walk.json');
    const walk = JSON.parse(fs.readFileSync(wf, 'utf8'));
    const all = Object.keys(UI).filter((id) => UI[id].routes && UI[id].routes.length);
    walk.rows = walk.rows.map(reclassifyRow);
    writeJson(wf, walk);
    projectPrompts(walk.rows, all);
    log('reprojected ' + all.length + ' per-prompt evidence files from existing walk');
    return;
  }
  const selected = process.argv.slice(2).filter((x) => !x.startsWith('-')).map((x) => x.toUpperCase());
  const all = Object.keys(UI).filter((id) => UI[id].routes && UI[id].routes.length);
  const runList = selected.length ? all.filter((id) => selected.includes(id)) : all;
  if (!runList.length) { console.error('No matching P ids with routes:', selected.join(' ')); process.exit(64); }

  // unique visit index: app|role|route -> prompts
  const visits = new Map();
  for (const pid of runList) {
    const e = UI[pid];
    const role = e.role || 'anon';
    for (const route of e.routes) {
      const k = [e.app, role, route].join('|');
      if (!visits.has(k)) visits.set(k, { app: e.app, role, route, prompts: new Set() });
      visits.get(k).prompts.add(pid);
    }
  }
  log(`prompts: ${runList.length}, unique visits: ${visits.size} (x2 viewports)`);

  getCtx.browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
  const contexts = new Map();
  const rows = [];
  let i = 0;
  for (const v of visits.values()) {
    i++;
    const row = await visit(v, contexts);
    rows.push(row);
    log(`[${i}/${visits.size}] ${v.app} ${v.role} ${v.route}  d=${row.desktop?.verdict || row.desktop?.error || row.desktop?.reason} m=${row.mobile?.verdict || row.mobile?.error || row.mobile?.reason}`);
  }
  await getCtx.browser.close().catch(() => null);

  // merge with any existing walk so subset runs never truncate the full picture
  let prev = { rows: [] };
  const walkFile = path.join(outDir('evidence'), 'ui-walk.json');
  try { prev = JSON.parse(require('fs').readFileSync(walkFile, 'utf8')); } catch (_) { /* noop */ }
  const fresh = new Map(rows.map((r) => [[r.app, r.role, r.route].join('|'), r]));
  const merged = [];
  for (const pr of prev.rows || []) {
    const k = [pr.app, pr.role, pr.route].join('|');
    merged.push(fresh.has(k) ? fresh.get(k) : pr);
    fresh.delete(k);
  }
  for (const r of fresh.values()) merged.push(r);
  const walk = { generatedAt: new Date().toISOString(),
    viewports: { desktop: DESKTOP, mobile: MOBILE },
    logins: loginState.done, visitCount: merged.length, rows: merged };
  writeJson(walkFile, walk);

  // project per-prompt evidence from the merged walk so subset runs keep
  // previously walked routes in their evidence
  for (const pid of runList) {
    const mine = walk.rows.filter((r) => r.prompts.includes(pid));
    const summary = {};
    for (const r of mine) for (const kind of ['desktop', 'mobile']) {
      const v = r[kind]?.verdict || (r[kind]?.blocked ? 'BLOCKED' : (r[kind]?.error ? 'NAV-ERROR' : 'NONE'));
      summary[v] = (summary[v] || 0) + 1;
    }
    writeJson(path.join(outDir('evidence'), `${pid}.json`),
      { id: pid, title: UI[pid].title, app: UI[pid].app, role: UI[pid].role || 'anon',
        generatedAt: walk.generatedAt, verdictSummary: summary, routes: mine });
  }
  log('\nDone. Evidence in ' + outDir('evidence') + ', screenshots in ' + SHOTS);
}

main().catch((e) => { console.error(e); process.exit(1); });
