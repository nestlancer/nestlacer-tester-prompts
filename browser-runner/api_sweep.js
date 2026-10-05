'use strict';
/* api_sweep.js — safe, read-only sweep of every OpenAPI GET operation across
 * anon / client / admin roles, plus auth-boundary + IDOR evidence.
 * Feeds reports for A01–A20 and S01–S12.
 *
 * Usage: node api_sweep.js [--limit N] [--tag "substring"]
 */
const fs = require('fs');
const path = require('path');
const { HOSTS, ACCOUNTS, Session, anon, outDir, writeJson, sleep } = require('./lib/http');

const INVENTORY = path.join(__dirname, '..', '02-source-inventories', 'openapi-operations-by-tag.md');
const OUT = outDir('api');

function parseOperations() {
  const lines = fs.readFileSync(INVENTORY, 'utf8').split('\n');
  let tag = 'untagged';
  const ops = [];
  for (const line of lines) {
    const t = line.match(/^##\s+(.+?)\s*\(\d+\)\s*$/);
    if (t) { tag = t[1].trim(); continue; }
    const m = line.match(/^-\s+`([A-Z]+)\s+(\/[^`]*)`(?:\s+—\s+(.*))?/);
    if (m) ops.push({ method: m[1], path: m[2].replace(/^\/api\/v1/, ''), tag, summary: (m[3] || '').trim() });
  }
  return ops;
}

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const LIMIT = Number(getArg('--limit', '0')) || 0;
const TAGF = getArg('--tag', null);

function roleFor(p) {
  if (p.startsWith('/admin')) return 'admin';
  if (/^\/(auth|health|public|blog|portfolio|contact|services|share|verify)/.test(p)) return 'public';
  return 'client';
}

// collected ids by resource keyword
const idPool = new Map();
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function harvestIds(key, json) {
  if (!json) return;
  const bucket = idPool.get(key) || [];
  const walk = (node, depth) => {
    if (bucket.length >= 3 || depth > 5 || !node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.slice(0, 5).forEach((n) => walk(n, depth + 1)); return; }
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'id' || k === '_id') && typeof v === 'string' && UUID.test(v)) { if (!bucket.includes(v)) bucket.push(v); }
      else if ((k === 'slug') && typeof v === 'string') { const sb = idPool.get(key + ':slug') || []; if (!sb.includes(v)) sb.push(v); idPool.set(key + ':slug', sb.slice(0, 3)); }
      else walk(v, depth + 1);
    }
  };
  walk(json, 0);
  if (bucket.length) idPool.set(key, bucket.slice(0, 3));
}

function resourceKey(p) {
  const seg = p.split('/').filter(Boolean);
  if (seg[0] === 'admin') return seg.slice(0, 2).join('/');
  return seg.slice(0, 1).join('/');
}

function fillParams(p, key) {
  const params = p.match(/\{[^}]+\}|:[A-Za-z]+/g);
  if (!params) return { path: p, resolved: true, used: null };
  let out = p;
  let used = null;
  for (const token of params) {
    const name = token.replace(/[{}:]/g, '').toLowerCase();
    let val = null;
    if (/slug/.test(name)) val = (idPool.get(key + ':slug') || [])[0];
    if (!val) val = (idPool.get(key) || [])[0];
    if (!val && /userid/.test(name)) val = (idPool.get('admin/users') || [])[0];
    if (!val) return { path: p, resolved: false, used: null };
    used = val;
    out = out.replace(token, val);
  }
  return { path: out, resolved: true, used };
}

(async () => {
  const sessions = {
    admin: new Session('admin', ACCOUNTS.admin),
    clientA: new Session('clientA', ACCOUNTS.clientA),
    clientB: new Session('clientB', ACCOUNTS.clientB),
  };
  const loginEvidence = {};
  for (const [name, s] of Object.entries(sessions)) {
    const res = await s.login();
    loginEvidence[name] = { status: res.status, ms: res.ms, requestId: res.requestId, hasToken: !!s.accessToken, userId: s.userId };
    console.log(`[login] ${name} status=${res.status} token=${!!s.accessToken}`);
  }

  let ops = parseOperations().filter((o) => o.method === 'GET');
  if (TAGF) ops = ops.filter((o) => o.tag.toLowerCase().includes(TAGF.toLowerCase()));
  // parameterless first so IDs get harvested
  ops.sort((a, b) => (a.path.includes('{') ? 1 : 0) - (b.path.includes('{') ? 1 : 0));
  if (LIMIT) ops = ops.slice(0, LIMIT);
  console.log(`[sweep] ${ops.length} GET operations`);

  const results = [];
  let i = 0;
  for (const op of ops) {
    i += 1;
    const key = resourceKey(op.path);
    const want = roleFor(op.path);
    const filled = fillParams(op.path, key);
    const row = { ...op, resourceKey: key, expectedRole: want, requestPath: filled.path, paramResolved: filled.resolved, idUsed: filled.used, probes: {} };

    if (!filled.resolved) {
      row.verdict = 'SKIPPED_NO_ID';
      results.push(row);
      continue;
    }

    const primary = want === 'admin' ? sessions.admin : want === 'client' ? sessions.clientA : null;
    // anonymous probe (always)
    const a = await anon.call('GET', filled.path, { origin: want === 'admin' ? HOSTS.admin : HOSTS.web });
    row.probes.anon = { status: a.status, ms: a.ms, bytes: a.bytes, requestId: a.requestId, code: a.json && a.json.error && a.json.error.code };

    if (primary) {
      const r = await primary.call('GET', filled.path);
      row.probes[primary.name] = { status: r.status, ms: r.ms, bytes: r.bytes, requestId: r.requestId, code: r.json && r.json.error && r.json.error.code };
      if (r.status === 200) harvestIds(key, r.json);
      // wrong-role probe
      const wrong = want === 'admin' ? sessions.clientA : sessions.admin;
      const w = await wrong.call('GET', filled.path);
      row.probes[`wrong:${wrong.name}`] = { status: w.status, ms: w.ms, bytes: w.bytes, code: w.json && w.json.error && w.json.error.code };
      // IDOR probe: second client against the same object path
      if (want === 'client' && filled.used) {
        const b = await sessions.clientB.call('GET', filled.path);
        row.probes['idor:clientB'] = { status: b.status, ms: b.ms, bytes: b.bytes, code: b.json && b.json.error && b.json.error.code };
      }
    } else if (a.status === 200) {
      harvestIds(key, a.json);
    }

    // verdicts
    const fl = [];
    const pr = row.probes;
    const authed = pr[primary ? primary.name : 'anon'];
    if (want !== 'public' && pr.anon && pr.anon.status === 200) fl.push('P0_UNAUTH_200');
    if (want === 'admin' && pr['wrong:clientA'] && pr['wrong:clientA'].status === 200) fl.push('P0_CLIENT_READS_ADMIN');
    if (pr['idor:clientB'] && pr['idor:clientB'].status === 200 && authed && authed.status === 200 && filled.used) fl.push('REVIEW_IDOR_200');
    if (authed && authed.status >= 500) fl.push('SERVER_5XX');
    if (authed && (authed.status === 404) && !filled.used) fl.push('ROUTE_404');
    row.flags = fl;
    row.verdict = fl.some((f) => f.startsWith('P0')) ? 'FAIL' : fl.includes('SERVER_5XX') ? 'FAIL' : fl.length ? 'REVIEW' : (authed && authed.status < 400 ? 'PASS' : 'OBSERVED');
    results.push(row);
    if (i % 25 === 0) { console.log(`  ..${i}/${ops.length}`); writeJson(path.join(OUT, 'api-sweep.json'), { loginEvidence, results }); }
    await sleep(60);
  }

  writeJson(path.join(OUT, 'api-sweep.json'), {
    generatedAt: new Date().toISOString(), hosts: HOSTS, loginEvidence,
    totals: {
      operations: results.length,
      pass: results.filter((r) => r.verdict === 'PASS').length,
      fail: results.filter((r) => r.verdict === 'FAIL').length,
      review: results.filter((r) => r.verdict === 'REVIEW').length,
      skipped: results.filter((r) => r.verdict === 'SKIPPED_NO_ID').length,
    },
    results,
  });
  console.log('[done] wrote', path.join(OUT, 'api-sweep.json'));
})();
