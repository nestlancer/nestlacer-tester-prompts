'use strict';
/* api_runner.js — executes the A01-A20 API prompt family against the public
 * demo-production gateway and writes structured evidence per prompt.
 *
 *   node api_runner.js                 # all A## prompts
 *   node api_runner.js A01 A06         # selected prompts
 *
 * Evidence: $NL_OUT/evidence/<ID>.json
 */
const { HOSTS, ACCOUNTS, Session, anon, rawRequest, outDir, writeJson, sleep } = require('./lib/http');
const catalog = require('./lib/catalog');
const { API } = require('./lib/prompts');
const { discover, fillPath } = require('./lib/fixtures');
const path = require('path');

const MUTATE = process.env.NL_MUTATE === '1';     // run AUDIT lifecycle flows
const STAMP = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const log = (...a) => console.log(...a);

function verdict(row) {
  const { status, method, path: p, role } = row;
  const adminPath = catalog.isAdminPath(p);
  if (status === 0) return 'ERROR';
  if (role === 'anon' && adminPath) return status === 401 || status === 403 ? 'PASS' : 'FAIL';
  if (role === 'clientA' && adminPath) return status === 401 || status === 403 ? 'PASS' : 'FAIL';
  if (status === 501) return 'NOT-IMPLEMENTED';
  if (status >= 500) return 'FAIL';
  if (status === 404) return 'NOT-FOUND';
  if (status === 401 || status === 403) return 'DENIED';
  if (status >= 400) return 'CLIENT-ERR';
  return 'PASS';
}

/** Catalog paths carry the /api/v1 prefix; apiBase already includes it. */
const rel = (p) => p.replace(/^\/api\/v1/, '');

async function probe(sessions, role, method, p, fx, extra = {}) {
  const filled = fillPath(rel(p), fx);
  if (filled.unresolved) {
    return { role, method, path: p, status: null, verdict: 'SKIP-NO-FIXTURE', note: 'no demo id available' };
  }
  const s = sessions[role];
  const res = await s.call(method, filled.path, extra);
  const row = {
    role, method, path: filled.path, template: p, status: res.status, ms: res.ms,
    requestId: res.requestId, correlationId: res.correlationId,
    envelope: res.json ? Object.keys(res.json) : null,
    code: res.json && (res.json.code || (res.json.error && res.json.error.code)) || null,
    message: res.json && (res.json.message || (res.json.error && res.json.error.message)) || null,
    bytes: res.bytes, error: res.error || null,
  };
  row.verdict = verdict(row);
  return row;
}

/* ------------------------------------------------------------- A17 : BFF */
async function bffChecks() {
  const rows = [];
  const targets = [
    ['web', `${HOSTS.web}/api/v1/health`], ['web', `${HOSTS.web}/api/auth/login`],
    ['admin', `${HOSTS.admin}/api/v1/health`], ['admin', `${HOSTS.admin}/api/auth/login`],
    ['landing', `${HOSTS.landing}/api/v1/services`],
    ['web-webhook-guard', `${HOSTS.web}/api/webhooks/razorpay`],
    ['admin-absent', `${HOSTS.admin}/users/bulk`], ['admin-absent', `${HOSTS.admin}/quotes/library`],
    ['admin-absent', `${HOSTS.admin}/nl-absent`],
    ['landing-redirect', `${HOSTS.landing}/blog`], ['landing-redirect', `${HOSTS.landing}/portfolio`],
    ['landing-redirect', `${HOSTS.landing}/terms`], ['landing-redirect', `${HOSTS.landing}/privacy`],
  ];
  for (const [label, url] of targets) {
    const res = await rawRequest(url, { method: 'GET', redirect: 'manual' });
    rows.push({
      label, url, status: res.status, ms: res.ms,
      location: res.headers.location || null,
      csp: res.headers['content-security-policy'] ? 'present' : 'absent',
      nonce: /nonce-/.test(res.headers['content-security-policy'] || '') ? 'yes' : 'no',
      setCookie: res.headers['set-cookie'] ? 'present' : 'absent',
      requestId: res.requestId, verdict: res.status === 0 ? 'ERROR' : 'OBSERVED',
    });
  }
  return rows;
}

/* --------------------------------------------- A18 : cross-cutting probes */
async function crossCutting(sessions, fx) {
  const rows = [];
  const base = HOSTS.apiBase;
  // envelope + error shape
  for (const [label, url, opts] of [
    ['404 unknown path', `${base}/nl-does-not-exist`, {}],
    ['405 wrong method', `${base}/health`, { method: 'DELETE' }],
    ['400 malformed json', `${base}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{not-json' }],
    ['415 wrong content-type', `${base}/auth/login`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'x' }],
    ['validation error', `${base}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }],
    ['oversized query', `${base}/projects?limit=999999`, {}],
    ['negative paging', `${base}/projects?page=-1&limit=-5`, {}],
    ['unknown filter', `${base}/projects?nlBogusFilter=1`, {}],
  ]) {
    const res = await rawRequest(url, { method: 'GET', ...opts });
    rows.push({
      check: label, url: url.replace(base, ''), method: opts.method || 'GET', status: res.status,
      ms: res.ms, requestId: res.requestId, envelope: res.json ? Object.keys(res.json).join(',') : null,
      body: res.json ? JSON.stringify(res.json).slice(0, 220) : (res.text || '').slice(0, 220),
      stackLeak: /\bat\s+\/|node_modules|\.ts:\d+|\.js:\d+/.test(JSON.stringify(res.json || res.text || '')) ? 'YES' : 'no',
    });
  }
  // cache headers + idempotency
  const h = await rawRequest(`${base}/health`);
  rows.push({ check: 'health cache-control', url: '/health', method: 'GET', status: h.status, ms: h.ms,
    body: `cache-control=${h.headers['cache-control'] || 'none'} vary=${h.headers.vary || 'none'}`, stackLeak: 'no' });
  // idempotency key acceptance
  const idem = await sessions.clientA.call('POST', '/requests', {
    body: { title: `AUDIT-A18-${STAMP}-IDEM`, description: 'idempotency probe', serviceType: 'other' },
    headers: { 'idempotency-key': `nl-a18-${STAMP}-probe` },
  });
  rows.push({ check: 'idempotency-key accepted', url: '/requests', method: 'POST', status: idem.status,
    ms: idem.ms, requestId: idem.requestId, body: JSON.stringify(idem.json || '').slice(0, 220), stackLeak: 'no' });
  return rows;
}

/* --------------------------------------------------- A20 : seed readiness */
async function seedChecks(sessions, fx) {
  const expect = [
    ['blog published posts', 'anon', '/blog/posts?limit=100', 110, 'total'],
    ['blog categories', 'anon', '/blog/categories', 4, 'len'],
    ['blog tags', 'anon', '/blog/tags', 6, 'len'],
    ['portfolio items', 'anon', '/portfolio?limit=100', 8, 'total'],
    ['services', 'anon', '/services', 1, 'len'],
    ['admin users', 'admin', '/admin/users?limit=100', 16, 'total'],
    ['admin projects', 'admin', '/admin/projects?limit=100', 15, 'total'],
    ['email templates', 'admin', '/admin/system/templates', 10, 'len'],
    ['feature flags', 'admin', '/admin/system/features', 12, 'len'],
  ];
  const rows = [];
  for (const [label, role, p, want, kind] of expect) {
    const res = await sessions[role].call('GET', p);
    const d = res.json && res.json.data;
    let actual = null;
    if (d) {
      if (Array.isArray(d)) actual = d.length;
      else actual = d.totalItems ?? d.total ?? d.meta?.total ?? d.pagination?.total ??
        (Array.isArray(d.items) ? d.items.length : null) ??
        (Array.isArray(d.data) ? d.data.length : null);
    }
    rows.push({ fixture: label, path: p, role, status: res.status, expected: want, actual,
      verdict: res.status >= 400 ? 'BLOCKED' : (actual === null ? 'UNKNOWN' : (actual >= want ? 'PASS' : 'SHORT')) });
  }
  return rows;
}

/* -------------------------------------------------------- A19 : workers */
async function workerChecks(sessions) {
  const rows = [];
  for (const p of ['/health', '/health/live', '/health/ready', '/health/detailed',
    '/health/dependencies', '/health/services', '/health/workers', '/health/websocket',
    '/health/registry', '/webhooks/health']) {
    const res = await sessions.anon.call('GET', p);
    rows.push({ path: p, status: res.status, ms: res.ms,
      body: JSON.stringify(res.json || res.text || '').slice(0, 300) });
  }
  for (const p of ['/admin/system/jobs', '/admin/system/cache', '/admin/audit?limit=5', '/admin/reports']) {
    const res = await sessions.admin.call('GET', p);
    rows.push({ path: p, status: res.status, ms: res.ms, role: 'admin',
      body: JSON.stringify(res.json || res.text || '').slice(0, 300) });
  }
  return rows;
}

/* ============================================================== MAIN ==== */
async function main() {
  const want = process.argv.slice(2).filter((a) => /^A\d\d$/.test(a));
  const ids = want.length ? want : Object.keys(API);
  const sessions = {
    anon,
    clientA: new Session('clientA', ACCOUNTS.clientA),
    clientB: new Session('clientB', ACCOUNTS.clientB),
    admin: new Session('admin', ACCOUNTS.admin),
  };
  log('== login ==');
  for (const r of ['clientA', 'clientB', 'admin']) {
    const res = await sessions[r].login();
    log(`  ${r.padEnd(8)} status=${res.status} token=${sessions[r].accessToken ? 'yes' : 'NO'} userId=${sessions[r].userId || '-'}`);
  }
  log('== fixture discovery ==');
  const fx = await discover(sessions, log);
  const evDir = outDir('evidence');
  writeJson(path.join(evDir, '_fixtures.json'), fx);

  for (const id of ids) {
    const spec = API[id];
    const started = Date.now();
    log(`\n== ${id} — ${spec.title} ==`);
    const out = { id, title: spec.title, startedAt: new Date().toISOString(), rows: [], extra: {} };

    if (spec.special === 'bff') out.extra.bff = await bffChecks();
    else if (spec.special === 'crosscutting') out.extra.crossCutting = await crossCutting(sessions, fx);
    else if (spec.special === 'workers') out.extra.workers = await workerChecks(sessions);
    else if (spec.special === 'seed') out.extra.seed = await seedChecks(sessions, fx);
    // flatten special sections into the uniform rows shape for report generation
    for (const [section, items] of Object.entries(out.extra)) {
      if (!Array.isArray(items)) continue;
      for (const it of items) {
        if (!it || typeof it !== 'object') continue;
        const verdict = it.verdict || (it.status === 200 ? 'PASS' : (it.status >= 500 ? 'FAIL' : 'OBSERVED'));
        out.rows.push({ kind: 'special-' + section, role: it.label || it.check || section,
          method: it.method || '-', path: it.url || it.path || it.check || section,
          status: it.status != null ? it.status : '-', verdict,
          message: it.message || it.envelope || it.location || it.csp || it.detail || null });
      }
    }

    if (spec.pathRe || spec.tags.length) {
      const ops = catalog.loadOperations().filter((o) =>
        (spec.pathRe && spec.pathRe.test(o.path)) || spec.tags.includes(o.tag));
      const reads = ops.filter((o) => catalog.isReadOnly(o.method));
      const writes = ops.filter((o) => !catalog.isReadOnly(o.method));
      log(`  ops matched: ${ops.length} (read ${reads.length} / write ${writes.length})`);

      for (const o of reads) {
        const adminOp = catalog.isAdminPath(o.path);
        const primary = adminOp ? 'admin' : 'clientA';
        out.rows.push({ ...(await probe(sessions, primary, o.method, o.path, fx)), summary: o.summary, tag: o.tag });
        // role-boundary: anon on everything authenticated; client on admin paths
        out.rows.push({ ...(await probe(sessions, 'anon', o.method, o.path, fx)), summary: o.summary, tag: o.tag, kind: 'role-boundary' });
        if (adminOp) out.rows.push({ ...(await probe(sessions, 'clientA', o.method, o.path, fx)), summary: o.summary, tag: o.tag, kind: 'role-boundary' });
      }
      // IDOR: client A requesting client B owned ids
      const idorPairs = [
        ['/projects/{id}', fx.projectIdB], ['/quotes/{id}', fx.quoteIdB],
        ['/requests/{id}', fx.requestIdB], ['/payments/{id}', fx.paymentIdB],
      ].filter(([tpl, v]) => v && spec.pathRe && spec.pathRe.test(tpl));
      for (const [tpl, otherId] of idorPairs) {
        const p = tpl.replace('{id}', otherId);
        const res = await sessions.clientA.call('GET', p);
        out.rows.push({ role: 'clientA', kind: 'IDOR', method: 'GET', path: p, template: tpl,
          status: res.status, ms: res.ms, requestId: res.requestId,
          verdict: (res.status === 403 || res.status === 404) ? 'PASS' : 'FAIL-CROSS-USER',
          note: 'client A requesting client B resource' });
      }
      // write ops: contract probe with non-existent id (no side effect) + authz
      for (const o of writes) {
        const probePath = rel(o.path).replace(/\{\w+\}/g, '00000000-0000-7000-8000-000000000000');
        const adminOp = catalog.isAdminPath(o.path);
        const r1 = await sessions[adminOp ? 'admin' : 'clientA'].call(o.method, probePath, { body: {} });
        out.rows.push({ role: adminOp ? 'admin' : 'clientA', kind: 'write-contract', method: o.method,
          path: probePath, template: o.path, status: r1.status, ms: r1.ms, requestId: r1.requestId,
          code: r1.json && r1.json.code, summary: o.summary, tag: o.tag,
          verdict: r1.status === 501 ? 'NOT-IMPLEMENTED' : r1.status >= 500 ? 'FAIL' : (r1.status === 404 || r1.status === 400 || r1.status === 422 ? 'PASS' : (r1.status < 300 ? 'UNEXPECTED-2XX' : 'OBSERVED')) });
        const r2 = await anon.call(o.method, probePath, { body: {} });
        out.rows.push({ role: 'anon', kind: 'write-authz', method: o.method, path: probePath,
          template: o.path, status: r2.status, ms: r2.ms, tag: o.tag,
          verdict: (r2.status === 401 || r2.status === 403) ? 'PASS' : (r2.status < 300 ? (/\/view$/.test(o.path) ? 'ANON-WRITE-ALLOWED-PUBLIC-COUNTER' : 'FAIL-ANON-WRITE') : 'OBSERVED') });
      }
    }

    out.finishedAt = new Date().toISOString();
    out.durationMs = Date.now() - started;
    const counts = {};
    for (const r of out.rows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
    out.counts = counts;
    writeJson(path.join(evDir, `${id}.json`), out);
    log(`  rows=${out.rows.length} ${JSON.stringify(counts)} (${Math.round(out.durationMs / 1000)}s)`);
  }
  log('\nDone. Evidence in ' + evDir);
}

main().catch((e) => { console.error(e); process.exit(1); });
