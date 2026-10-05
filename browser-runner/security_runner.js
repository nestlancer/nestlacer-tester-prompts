'use strict';
/* security_runner.js — executes the S01-S12 defensive security prompt family.
 * Authorized, defensive, demo-data only: no destructive payload persistence,
 * no third-party targets, no real payment rails.
 *
 *   node security_runner.js            # all S## prompts
 *   node security_runner.js S02 S08    # selected
 *
 * Evidence: $NL_OUT/evidence/<ID>.json
 */
const { HOSTS, ACCOUNTS, Session, anon, rawRequest, outDir, writeJson } = require('./lib/http');
const { SEC } = require('./lib/prompts');
const { discover } = require('./lib/fixtures');
const catalog = require('./lib/catalog');
const path = require('path');

const log = (...a) => console.log(...a);
const STAMP = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const B = HOSTS.apiBase;

/* --------------------------------------------------------------- probes */
const probes = {};

probes.surface = async () => {
  const ops = catalog.loadOperations();
  const byTag = {};
  for (const o of ops) byTag[o.tag] = (byTag[o.tag] || 0) + 1;
  const rows = [];
  for (const [label, url] of [
    ['api gateway', `${B}/health`], ['landing', HOSTS.landing], ['web portal', HOSTS.web],
    ['admin portal', HOSTS.admin], ['ws gateway', `${HOSTS.api}/ws/socket.io/?EIO=4&transport=polling`],
  ]) {
    const r = await rawRequest(url);
    rows.push({ surface: label, url, status: r.status, server: String(r.headers.server || '-'),
      exposes: Object.keys(r.headers).filter((h) => /^x-(powered|aspnet|runtime)/.test(h)).join(',') || 'none' });
  }
  return { attackSurface: { totalOperations: ops.length,
    adminOperations: ops.filter((o) => catalog.isAdminPath(o.path)).length,
    writeOperations: ops.filter((o) => !catalog.isReadOnly(o.method)).length,
    tags: Object.keys(byTag).length, byTag }, reachability: rows };
};

probes.headers = async () => {
  const want = ['strict-transport-security', 'content-security-policy', 'x-content-type-options',
    'x-frame-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy',
    'x-xss-protection', 'cross-origin-resource-policy'];
  const rows = [];
  for (const [label, url] of [['api', `${B}/health`], ['landing', HOSTS.landing],
    ['web', `${HOSTS.web}/login`], ['admin', `${HOSTS.admin}/login`]]) {
    const r = await rawRequest(url);
    const h = r.headers;
    const row = { surface: label, status: r.status };
    for (const w of want) row[w] = h[w] ? String(h[w]).slice(0, 110) : 'MISSING';
    row.missing = want.filter((w) => !h[w]);
    row.cspUnsafe = /unsafe-inline|unsafe-eval/.test(h['content-security-policy'] || '') ? 'YES' : 'no';
    rows.push(row);
  }
  return { securityHeaders: rows };
};

probes.tls = async () => {
  const rows = [];
  for (const [label, host] of [['api', 'api.nestlancer.com'], ['web', 'app.nestlancer.com'],
    ['admin', 'admin.nestlancer.com'], ['landing', 'nestlancer.com']]) {
    const r = await rawRequest(`http://${host}/`, { redirect: 'manual' });
    rows.push({ surface: label, httpStatus: r.status, redirectsTo: r.headers.location || null,
      verdict: (r.status >= 300 && r.status < 400 && /^https:/.test(r.headers.location || '')) ? 'PASS-HTTPS-REDIRECT'
        : (r.status === 0 ? 'NO-PLAINTEXT-LISTENER (PASS)' : 'REVIEW') });
  }
  return { tlsTransport: rows };
};

probes.authz = async (ctx) => {
  const rows = [];
  const adminOps = catalog.loadOperations()
    .filter((o) => catalog.isAdminPath(o.path) && catalog.isReadOnly(o.method) && !o.path.includes('{'));
  for (const o of adminOps.slice(0, 40)) {
    const p = o.path.replace(/^\/api\/v1/, '');
    const a = await anon.call('GET', p);
    const c = await ctx.sessions.clientA.call('GET', p);
    rows.push({ path: p, anonStatus: a.status, clientStatus: c.status,
      verdict: ([401, 403].includes(a.status) && [401, 403].includes(c.status)) ? 'PASS' : 'FAIL-PRIVESC' });
  }
  return { adminEndpointAuthz: rows };
};

probes.idor = async (ctx) => {
  const { fx, sessions } = ctx;
  const rows = [];
  // direction 1: clientA reading clientB-owned resources (true cross-tenant fixtures)
  for (const [kind, base, id] of [['quote(B)', '/quotes/', fx.quoteIdB], ['request(B)', '/requests/', fx.requestIdB]]) {
    if (!id) { rows.push({ resource: kind, verdict: 'SKIP-NO-FIXTURE' }); continue; }
    const r = await sessions.clientA.call('GET', base + id);
    rows.push({ resource: kind, path: base + id, status: r.status, bytes: r.bytes, owner: 'clientB', reader: 'clientA',
      verdict: [403, 404].includes(r.status) ? 'PASS' : 'FAIL-CROSS-USER-READ' });
  }
  // direction 2: clientB reading clientA-owned resources
  for (const [kind, base, id] of [['project(A)', '/projects/', fx.projectId], ['quote(A)', '/quotes/', fx.quoteId],
      ['request(A)', '/requests/', fx.requestId], ['payment(A)', '/payments/', fx.paymentId], ['media(A)', '/media/', fx.mediaId]]) {
    if (!id) { rows.push({ resource: kind, verdict: 'SKIP-NO-FIXTURE' }); continue; }
    const r = await sessions.clientB.call('GET', base + id);
    rows.push({ resource: kind, path: base + id, status: r.status, bytes: r.bytes, owner: 'clientA', reader: 'clientB',
      verdict: [403, 404].includes(r.status) ? 'PASS' : 'FAIL-CROSS-USER-READ' });
  }
  // direction 3: clientA reading an admin-listed project, only if it is not clientA's own (ownership ambiguity guard)
  if (fx.adminProjectId && fx.adminProjectId !== fx.projectId) {
    const r = await sessions.clientA.call('GET', '/projects/' + fx.adminProjectId);
    rows.push({ resource: 'project(admin-listed)', path: '/projects/' + fx.adminProjectId, status: r.status,
      owner: 'unknown(admin list)', reader: 'clientA',
      verdict: [403, 404].includes(r.status) ? 'PASS' : 'REVIEW-FOREIGN-READ' });
  } else {
    rows.push({ resource: 'project(admin-listed)', verdict: 'SKIP-FIXTURE-COLLISION (admin first == clientA first; ownership not provable foreign)' });
  }
  const guess = await sessions.clientA.call('GET', '/projects/00000000-0000-7000-8000-000000000001');
  rows.push({ resource: 'guessed-uuid', path: '/projects/0000...0001', status: guess.status,
    verdict: [403, 404, 400].includes(guess.status) ? 'PASS' : 'REVIEW' });
  return { idor: rows };
};

probes.session = async () => {
  const rows = [];
  const s = new Session('throwaway', ACCOUNTS.clientA);
  const login = await s.login();
  const sc = login.headers['set-cookie'] || '';
  rows.push({ check: 'login token delivery',
    detail: login.json && login.json.data ? Object.keys(login.json.data).join(',') : '-',
    setCookie: sc ? 'present' : 'ABSENT (bearer-in-body)',
    httpOnly: /httponly/i.test(sc) ? 'yes' : 'n/a', secure: /secure/i.test(sc) ? 'yes' : 'n/a',
    sameSite: (sc.match(/samesite=(\w+)/i) || [, 'n/a'])[1],
    verdict: sc ? 'COOKIE-MODE' : 'BEARER-MODE — token is JS-readable; verify portal keeps it in memory, not localStorage' });
  try {
    const p = JSON.parse(Buffer.from(s.accessToken.split('.')[1], 'base64').toString());
    rows.push({ check: 'access token TTL',
      detail: `${p.exp - p.iat}s aud=${p.aud} iss=${p.iss} portal=${p.portal} kid-header only verify`,
      verdict: (p.exp - p.iat) <= 3600 ? 'PASS' : 'REVIEW-LONG-TTL' });
    rows.push({ check: 'JWT claim hygiene', detail: `claims=${Object.keys(p).join(',')}`,
      verdict: /password|secret|token/i.test(Object.keys(p).join(',')) ? 'FAIL' : 'PASS' });
  } catch (_) { /* noop */ }
  const before = await s.call('GET', '/users/profile');
  const out = await s.call('POST', '/auth/logout', { body: {} });
  const after = await rawRequest(`${B}/users/profile`,
    { headers: { authorization: `Bearer ${s.accessToken}`, origin: HOSTS.web } });
  rows.push({ check: 'logout invalidates access token',
    detail: `before=${before.status} logout=${out.status} after=${after.status}`,
    verdict: after.status === 401 ? 'PASS' : 'OBSERVED-STATELESS (JWT valid until exp — expected if tokens not denylisted)' });
  return { sessionSecurity: rows };
};

probes.jwt = async (ctx) => {
  const s = ctx.sessions.clientA;
  await s.ensure();
  const [h, p, sig] = s.accessToken.split('.');
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const payload = JSON.parse(Buffer.from(p, 'base64').toString());
  const rows = [];
  const variants = [
    ['alg=none', `${b64({ alg: 'none', typ: 'JWT' })}.${p}.`],
    ['alg=HS256 forged', `${b64({ alg: 'HS256', typ: 'JWT' })}.${p}.c2ln`],
    ['role escalated to ADMIN', `${h}.${b64({ ...payload, role: 'ADMIN' })}.${sig}`],
    ['sub swapped to missing user', `${h}.${b64({ ...payload, sub: '00000000-0000-7000-8000-000000000000' })}.${sig}`],
    ['expired exp', `${h}.${b64({ ...payload, exp: 1000000 })}.${sig}`],
    ['signature stripped', `${h}.${p}.`],
    ['garbage token', 'nl.invalid.token'],
  ];
  for (const [name, token] of variants) {
    const r = await rawRequest(`${B}/users/profile`,
      { headers: { authorization: `Bearer ${token}`, origin: HOSTS.web } });
    rows.push({ attack: name, status: r.status,
      verdict: (r.status === 401 || r.status === 403) ? 'PASS' : 'FAIL-TOKEN-FORGERY-ACCEPTED' });
  }
  const esc = await s.call('GET', '/admin/users?limit=1');
  rows.push({ attack: 'client token on admin path', status: esc.status,
    verdict: [401, 403].includes(esc.status) ? 'PASS' : 'FAIL-PRIVESC' });
  return { jwtAttacks: rows };
};

probes.ratelimit = async () => {
  const t0 = Date.now();
  let codes = [];
  for (let i = 0; i < 12; i++) {
    const r = await rawRequest(`${B}/auth/login`, {
      method: 'POST', headers: { 'content-type': 'application/json', origin: HOSTS.web },
      body: JSON.stringify({ email: 'ratelimit@nestlancer.example', password: 'invalid-credential-probe' }),
    });
    codes.push(r.status);
  }
  const ms = Date.now() - t0;
  return { authRateLimit: [{ endpoint: 'POST /auth/login', attempts: 12, inMs: ms,
    statuses: codes.join(','),
    verdict: codes.includes(429) ? 'PASS — throttled' : 'REVIEW — no 429 within 12 bad attempts' }] };
};


/* ---- S03: injection / XSS / redirect / CSRF ------------------------- */
probes.injection = async (ctx) => {
  const rows = [];
  const payloads = ["' OR '1'='1", "1; DROP TABLE users--", "${7*7}", "../../../etc/passwd", "%00", {"$ne":null}];
  for (const p of payloads) {
    const q = encodeURIComponent(typeof p === 'string' ? p : JSON.stringify(p));
    const r = await ctx.sessions.clientA.call('GET', '/projects?search=' + q);
    const leaked = /syntax error|pg_|sql|mongo|BSON|stack/i.test((r.text || '').slice(0, 500));
    rows.push({ payload: String(typeof p === 'string' ? p : 'nosql-json'), status: r.status,
      errorLeak: leaked, verdict: (r.status < 500 && !leaked) ? 'PASS' : 'FAIL' });
  }
  return { injection: rows };
};

probes.xss = async (ctx) => {
  // reflected-only checks against search/query echo surfaces — nothing persisted
  const rows = [];
  const marker = 'nlXSSPROBE7';
  for (const [label, path] of [['project search', `/projects?search=${marker}<img>`],
    ['post search', `/posts?search=${marker}<svg>`], ['anon 404 echo path', `/${marker}<script>`]]) {
    const r = await anon.call('GET', path);
    const echoed = (r.text || '').includes(marker) && /<img>|<svg>|<script>/.test(r.text || '');
    rows.push({ surface: label, status: r.status, reflectedUnescaped: echoed,
      contentType: String(r.headers['content-type'] || '-'),
      verdict: !echoed ? 'PASS' : 'FAIL-REFLECTED-XSS' });
  }
  return { reflectiveXss: rows };
};

probes.redirect = async () => {
  const rows = [];
  for (const u of ['https://evil.example', '//evil.example', 'https://nestlancer.com.evil.example']) {
    const r = await rawRequest(`${HOSTS.web}/login?returnTo=${encodeURIComponent(u)}`, { redirect: 'manual' });
    const loc = String(r.headers.location || '');
    rows.push({ payload: u, status: r.status, location: loc || null,
      verdict: /evil\.example/.test(loc) ? 'FAIL-OPEN-REDIRECT' : 'PASS' });
  }
  return { openRedirect: rows };
};

probes.csrf = async (ctx) => {
  // cross-origin write without Origin header / with hostile Origin.
  // captures the original value first and restores it after the probe.
  const rows = [];
  const sess = ctx.sessions.clientA;
  await sess.ensure();
  const before = await sess.call('GET', '/users/profile');
  const original = ((before.json || {}).data || {}).firstName;
  const hostile = await rawRequest(`${B}/users/profile`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${sess.accessToken}`,
      'content-type': 'application/json', origin: 'https://evil.example' },
    body: JSON.stringify({ firstName: `AUDIT-CSRF-${STAMP}` }),
  });
  let restored = 'n/a';
  if (hostile.status === 200 && original) {
    const back = await sess.call('PATCH', '/users/profile', { body: { firstName: original } });
    restored = back.status === 200 ? 'yes' : 'FAILED-status-' + back.status;
  }
  rows.push({ surface: 'PATCH /users/profile', hostileOriginStatus: hostile.status, restoredOriginalValue: restored,
    verdict: [401, 403].includes(hostile.status) ? 'PASS-CORS-REJECT'
      : (hostile.status === 200 ? 'REVIEW — bearer auth honored cross-origin (Origin not checked); mitigated: no auth cookies exist, CORS blocks response reads'
      : 'PASS (not honored)') });
  return { csrf: rows };
};

/* ---- S04: replay / mass privilege ----------------------------------- */
probes.replay = async (ctx) => {
  const rows = [];
  const idem = `nl-replay-${STAMP}`;
  const mk = () => rawRequest(`${B}/requests`, {
    method: 'POST',
    headers: { authorization: `Bearer ${ctx.sessions.clientA.accessToken}`,
      'content-type': 'application/json', origin: HOSTS.web, 'idempotency-key': idem },
    body: JSON.stringify({ title: `AUDIT-S04-${STAMP}-null`, description: 'replay probe (invalid-contract)',
      category: 'OTHER' }),
  });
  const r1 = await mk(); const r2 = await mk();
  rows.push({ idempotencyKey: idem, first: r1.status, second: r2.status,
    verdict: (r1.status === r2.status && r1.status !== 201) ? 'PASS (contract rejected twice, no duplicate)' : 'REVIEW' });
  return { replay: rows };
};

probes.masspriv = async (ctx) => {
  // client attempting admin-only write scopes
  const rows = [];
  for (const [label, method, p, body] of [
    ['create post', 'POST', '/posts', { title: 'x', slug: `x-${STAMP}`, content: {} }],
    ['flag toggle', 'PATCH', `/admin/feature-flags/00000000-0000-7000-8000-000000000000`, { enabled: true }],
    ['user role escalate', 'PATCH', '/users/' + ctx.sessions.clientA.userId, { role: 'ADMIN' }],
  ]) {
    const r = await ctx.sessions.clientA.call(method, p, { body });
    rows.push({ surface: label, status: r.status,
      verdict: [401, 403, 404, 400].includes(r.status) ? 'PASS' : 'FAIL-PRIVESC-WRITE' });
  }
  return { massPrivilege: rows };
};

/* ---- S05: upload / share / traversal -------------------------------- */
probes.upload = async (ctx) => {
  const rows = [];
  // presign contract probe with hostile content type — never completes a real upload
  for (const [label, contentType, fileName] of [
    ['html as document', 'text/html', `audit-${STAMP}.html`],
    ['svg script carrier', 'image/svg+xml', `audit-${STAMP}.svg`],
    ['exe payload', 'application/x-msdownload', `audit-${STAMP}.exe`],
  ]) {
    const r = await ctx.sessions.clientA.call('POST', '/media/presign',
      { body: { fileName, contentType, fileSize: 128 } });
    rows.push({ label, status: r.status, verdict: [400, 415, 403, 404].includes(r.status) ? 'PASS-REJECTED'
      : (r.status === 200 || r.status === 201 ? 'OBSERVED-PRESIGNED (review allow-list)' : 'REVIEW') });
  }
  return { uploadSecurity: rows };
};

probes.share = async (ctx) => {
  const rows = [];
  for (const path of ['/files/00000000-0000-7000-8000-000000000000', '/media/00000000-0000-7000-8000-000000000000',
    '/documents/00000000-0000-7000-8000-000000000000', '/quotes/00000000-0000-7000-8000-000000000000/pdf']) {
    const r = await anon.call('GET', path);
    rows.push({ path, status: r.status, verdict: [401, 403, 404].includes(r.status) ? 'PASS' : 'FAIL-UNAUTH-FILE' });
  }
  return { unauthFileAccess: rows };
};

probes.traversal = async (ctx) => {
  const rows = [];
  for (const p of ['/media/..%2f..%2fetc%2fpasswd', '/files/..%252f..%252fwindows%252fwin.ini',
    '/media/%2e%2e%2f%2e%2e%2fpackage.json']) {
    const r = await ctx.sessions.clientA.call('GET', p);
    const leak = /root:|daemon:|\[fonts\]|"dependencies"/i.test(r.text || '');
    rows.push({ path: p, status: r.status, leakedContent: leak, verdict: !leak && r.status < 500 ? 'PASS' : 'FAIL' });
  }
  return { pathTraversal: rows };
};

/* ---- S06: payments / webhook signatures ----------------------------- */
probes.payments = async (ctx) => {
  const rows = [];
  // negative / tampered amount on a quote payment intent (never completes; test-mode only)
  for (const [label, amount] of [['negative amount', -100], ['zero amount', 0]]) {
    const r = await ctx.sessions.clientA.call('POST', '/payments/intent',
      { body: { quoteId: '00000000-0000-7000-8000-000000000000', amount, currency: 'INR' } });
    rows.push({ label, status: r.status, verdict: [400, 404, 422, 403].includes(r.status) ? 'PASS' : 'FAIL-AMOUNT-ACCEPTED' });
  }
  const tamper = await ctx.sessions.clientA.call('GET', '/payments/00000000-0000-7000-8000-000000000000');
  rows.push({ label: 'read missing payment', status: tamper.status,
    verdict: [404, 400, 403].includes(tamper.status) ? 'PASS' : 'REVIEW' });
  return { paymentAbuse: rows };
};

probes.webhooksig = async () => {
  const rows = [];
  for (const [name, p, body, key] of [
    ['razorpay unsigned', '/webhooks/razorpay', JSON.stringify({ event: 'payment.captured' }), null],
    ['razorpay bad signature', '/webhooks/razorpay', JSON.stringify({ event: 'payment.captured' }), 'x-razorpay-signature: deadbeef'],
    ['stripe unsigned', '/webhooks/stripe', JSON.stringify({ type: 'payment_intent.succeeded' }), null],
    ['github unsigned', '/webhooks/github', JSON.stringify({ action: 'opened' }), null],
  ]) {
    const h = { 'content-type': 'application/json' };
    if (key) { const [k, v] = key.split(': '); h[k] = v; }
    const r = await rawRequest(`${B}${p}`, { method: 'POST', headers: h, body });
    rows.push({ endpoint: name, status: r.status,
      verdict: [400, 401, 403].includes(r.status) ? 'PASS-REJECTED-UNSIGNED'
        : (r.status === 501 ? 'NOT-CONFIGURED' : 'FAIL-UNSIGNED-ACCEPTED') });
  }
  return { webhookSignatures: rows };
};

/* ---- S07: leakage / debug / PII ------------------------------------- */
probes.leakage = async () => {
  const rows = [];
  for (const p of ['/api/v1/openapi.json', '/api/v1/swagger.json', '/.git/config', '/.env',
    '/api/v1/.env', '/api/v1/config', '/api/v1/debug', '/api/v1/metrics', '/api/v1/actuator',
    '/api/v1/server-status', '/api/v1/pnpm-lock.yaml', '/api/v1/package.json']) {
    const r = await anon.call('GET', p.replace('/api/v1', ''));
    const body = r.text || '';
    const leaked = /secret|password|private_key|BEGIN [A-Z]+ PRIVATE KEY|mongodb\+srv|redis:\/\/|signingKey/i.test(body);
    rows.push({ path: p, status: r.status, bytes: r.bytes, leakPatternHit: leaked,
      verdict: leaked ? 'FAIL-SECRET-LEAK' : ([404, 401, 403].includes(r.status) ? 'PASS' : (r.status === 200 && r.bytes < 4000 ? 'OBSERVED (review content)' : 'REVIEW')) });
  }
  return { leakage: rows };
};

probes.debug = async (ctx) => {
  const rows = [];
  // trigger a 500-class error and check for stack traces
  const r = await ctx.sessions.clientA.call('GET', '/projects/%ff%fe%ff');
  const stack = /at\s+\S+\s+\(\S+:\d+:\d+\)|node_modules\/|\/app\/src\//.test(r.text || '');
  rows.push({ surface: 'malformed-id GET', status: r.status, stackTraceLeaked: stack,
    verdict: !stack ? 'PASS' : 'FAIL-STACK-LEAK' });
  const fwd = await anon.call('GET', '/health/dependencies');
  rows.push({ surface: 'health/dependencies anon', status: fwd.status,
    verdict: [401, 403].includes(fwd.status) ? 'PASS' : 'FAIL-INFRA-LEAK' });
  return { debugLeakage: rows };
};

probes.pii = async (ctx) => {
  const rows = [];
  // paginated user list as a normal client should never expose other users' PII
  const r = await ctx.sessions.clientA.call('GET', '/users?limit=5');
  const body = (r.text || '').slice(0, 3000);
  rows.push({ surface: 'GET /users as client', status: r.status,
    verdict: [401, 403, 404].includes(r.status) ? 'PASS' : (r.status === 200 ? 'FAIL-PII-LIST-EXPOSED' : 'REVIEW') });
  // email enumeration via login error message
  const missing = await rawRequest(`${B}/auth/login`, { method: 'POST',
    headers: { 'content-type': 'application/json', origin: HOSTS.web },
    body: JSON.stringify({ email: 'no-such-user-3902@nestlancer.example', password: 'Brick2@Build' }) });
  const badpass = await rawRequest(`${B}/auth/login`, { method: 'POST',
    headers: { 'content-type': 'application/json', origin: HOSTS.web },
    body: JSON.stringify({ email: 'arjun.mehta@nestlancer.com', password: 'Wrong@Passw0rd1' }) });
  const msgA = ((missing.json && (missing.json.message || (missing.json.error || {}).message)) || '');
  const msgB = ((badpass.json && (badpass.json.message || (badpass.json.error || {}).message)) || '');
  rows.push({ surface: 'login error enumeration', missingUserStatus: missing.status, badPasswordStatus: badpass.status,
    missingUserMsg: msgA.slice(0, 60), badPasswordMsg: msgB.slice(0, 60),
    verdict: (missing.status === badpass.status && msgA === msgB) ? 'PASS' : 'REVIEW-ENUMERATION-GAP' });
  return { piiExposure: rows };
};

/* ---- S08: cors / cache / cookies ------------------------------------ */
probes.cors = async (ctx) => {
  const rows = [];
  for (const origin of ['https://evil.example', 'https://app.nestlancer.com.evil.example', 'null']) {
    const r = await rawRequest(`${B}/users/profile`, {
      headers: { authorization: `Bearer ${ctx.sessions.clientA.accessToken}`, origin },
    });
    const acao = String(r.headers['access-control-allow-origin'] || '-');
    rows.push({ origin, status: r.status, acao,
      verdict: (acao === origin || acao === '*') ? 'FAIL-CORS-WILDCARD' : 'PASS' });
  }
  const good = await rawRequest(`${B}/users/profile`, {
    headers: { authorization: `Bearer ${ctx.sessions.clientA.accessToken}`, origin: HOSTS.web } });
  rows.push({ origin: HOSTS.web, status: good.status,
    acao: String(good.headers['access-control-allow-origin'] || '-'), verdict: 'BASELINE (expect reflect app host)' });
  return { cors: rows };
};

probes.cache = async (ctx) => {
  const rows = [];
  const r = await ctx.sessions.clientA.call('GET', '/users/profile');
  const cc = String(r.headers['cache-control'] || '-');
  rows.push({ surface: 'GET /users/profile', cacheControl: cc,
    pragma: String(r.headers.pragma || '-'),
    verdict: /no-store|no-cache/.test(cc) || cc === '-' ? 'PASS/REVIEW' : 'FAIL-AUTH-CACHEABLE' });
  return { cacheControls: rows };
};

probes.cookies = async (ctx) => {
  // exercised inside session probe; re-declare a find-the-cookie check on portal HTML
  const rows = [];
  for (const [label, url] of [['web login', `${HOSTS.web}/login`], ['admin login', `${HOSTS.admin}/login`]]) {
    const r = await rawRequest(url, { redirect: 'manual' });
    const sc = r.headers['set-cookie'] || '';
    const cookieName = (sc.match(/^\s*([^=;]+)=/) || [,'unknown'])[1];
    const sensitive = /(token|session|auth|jwt|refresh)/i.test(cookieName);
    rows.push({ surface: label, setCookiePresent: !!sc, cookieName: sc ? cookieName : null,
      flags: sc ? Object.entries({ httpOnly: /httponly/i, secure: /secure/i, sameSite: /samesite=(\w+)/i })
        .map(([k, re]) => `${k}:${re.test(sc) ? 'yes' : 'NO'}`).join(' ') : 'n/a',
      verdict: !sc ? 'PASS-NO-COOKIES (bearer mode)'
        : (sensitive && !/httponly/i.test(sc) ? 'FAIL-COOKIE-FLAGS (sensitive cookie readable by JS)'
        : (sensitive ? 'PASS' : 'PASS-INFO (non-sensitive cookie; HttpOnly not required)')) });
  }
  return { cookieFlags: rows };
};

/* ---- S09: realtime / content abuse ---------------------------------- */
probes.realtime = async (ctx) => {
  const rows = [];
  const r = await rawRequest(`${HOSTS.api}/ws/socket.io/?EIO=4&transport=polling`);
  rows.push({ surface: 'socket.io anon handshake', status: r.status,
    bodySnippet: (r.text || '').slice(0, 120),
    verdict: r.status >= 400 ? 'PASS-AUTH-REQUIRED' : 'REVIEW (handshake then per-channel auth expected)' });
  // cross-tenant conversation read as clientA on clientB conversation is covered by api_runner A12 evidence
  const conv = ctx.fx.conversationIdB || ctx.fx.conversationId;
  if (conv) {
    const x = await ctx.sessions.clientA.call('GET', `/messages/conversations/${conv}`);
    rows.push({ surface: 'cross-portal conversation read', status: x.status,
      verdict: [403, 404].includes(x.status) ? 'PASS' : 'REVIEW' });
  }
  return { realtime: rows };
};

probes.contentabuse = async (ctx) => {
  const rows = [];
  // oversize body guard
  const big = 'x'.repeat(2_100_000);
  const r = await rawRequest(`${B}/auth/login`, { method: 'POST',
    headers: { 'content-type': 'application/json', origin: HOSTS.web },
    body: JSON.stringify({ email: big + '@nl.example', password: 'x' }) });
  rows.push({ surface: 'oversize login body (2MB)', status: r.status,
    verdict: [400, 413].includes(r.status) ? 'PASS' : 'REVIEW' });
  return { contentAbuse: rows };
};

/* ---- S10: SSRF / outbound ------------------------------------------- */
probes.ssrf = async (ctx) => {
  const rows = [];
  for (const [label, path, body] of [
    ['inbound webhook target', '/webhooks/inbound/00000000-0000-7000-8000-000000000000', null],
    ['url-fetch-style field in request create', '/requests',
      { title: `AUDIT-S10-${STAMP}`, description: 'http://169.254.169.254/latest/meta-data (contract probe, invalid schema)', category: 'OTHER' }],
  ]) {
    const r = await ctx.sessions.clientA.call(body ? 'POST' : 'POST', path, body ? { body } : { body: { url: 'http://169.254.169.254/' } });
    rows.push({ surface: label, status: r.status,
      verdict: [400, 401, 403, 404, 422].includes(r.status) ? 'PASS (rejected/missing target)' : 'REVIEW' });
  }
  const cid = await ctx.sessions.admin.call('GET', '/health/dependencies');
  rows.push({ surface: 'admin health/dependencies (infra IP disclosure)', status: cid.status,
    verdict: [401, 403, 404].includes(cid.status) ? 'PASS' : 'REVIEW' });
  return { ssrf: rows };
};

probes.outbound = async (ctx) => {
  // verify webhook target allow-list on any configurable outbound endpoint (contract-level)
  const rows = [];
  const r = await ctx.sessions.admin.call('GET', '/admin/config');
  rows.push({ surface: 'admin /admin/config', status: r.status,
    verdict: [404, 401, 403].includes(r.status) ? 'N/A-ENDPOINT' : 'REVIEW' });
  const flags = await ctx.sessions.admin.call('GET', '/admin/feature-flags?limit=5');
  rows.push({ surface: 'feature flags readable as admin', status: flags.status,
    verdict: flags.status === 200 ? 'BASELINE' : 'REVIEW' });
  return { outboundSecurity: rows };
};

/* ---- S11: admin ops / supply chain ---------------------------------- */
probes.adminops = async (ctx) => {
  const rows = [];
  for (const p of ['/admin/health', '/health/system', '/health/workers', '/admin/audit-logs?limit=1',
    '/admin/kill-switch', '/admin/feature-flags?limit=1']) {
    const a = await anon.call('GET', p);
    const c = await ctx.sessions.clientA.call('GET', p);
    const adm = await ctx.sessions.admin.call('GET', p);
    rows.push({ path: p, anon: a.status, client: c.status, admin: adm.status,
      verdict: ([401, 403, 404].includes(a.status) && [401, 403, 404].includes(c.status)) ? 'PASS' : 'FAIL-ADMIN-SURFACE-OPEN' });
  }
  return { adminOps: rows };
};

probes.supplychain = async (ctx) => {
  const rows = [];
  // version disclosure in API responses
  const r = await anon.call('GET', '/health');
  const hdr = r.headers;
  const versions = ['x-powered-by', 'server', 'x-api-version']
    .filter((k) => hdr[k]).map((k) => `${k}=${String(hdr[k]).slice(0, 40)}`);
  rows.push({ surface: 'health response version disclosure', details: versions.join(' | ') || 'none',
    verdict: hdr['x-powered-by'] ? 'FAIL' : 'PASS (framework not disclosed)' });
  // static asset probing for source maps
  for (const label of ['web', 'admin']) {
    const host = HOSTS[label];
    const page = await rawRequest(host + '/');
    const js = ((page.text || '').match(/src="([^"]+\.js)"/) || [])[1];
    if (js) {
      const mapUrl = new URL(js + '.map', host).href;
      const m = await rawRequest(mapUrl);
      rows.push({ surface: `${label} sourcemap`, status: m.status,
        verdict: m.status === 200 && (m.text || '').includes('sourcesContent') ? 'FAIL-SOURCEMAP-PUBLIC' : 'PASS' });
    }
  }
  return { supplyChain: rows };
};

/* ---- S12: prompt injection / untrusted content ---------------------- */
probes.promptinjection = async (ctx) => {
  const rows = [];
  // probe any AI-assist style endpoints; non-destructive contract check
  for (const p of ['/ai/assist', '/assistant/chat', '/ai/generate', '/admin/ai/prompts?limit=1']) {
    const r = await anon.call('GET', p);
    rows.push({ surface: p, status: r.status,
      verdict: [404, 401, 403, 405].includes(r.status) ? 'NOT-EXPOSED/AUTH-REQUIRED (PASS)' : 'REVIEW' });
  }
  return { promptInjectionSurface: rows };
};

probes.untrusted = async (ctx) => {
  const rows = [];
  // content rendering sanitation: fetch a public post and confirm HTML is sanitized server-side
  const slug = ctx.fx.postSlug;
  if (slug) {
    const r = await anon.call('GET', `/posts/slug/${slug}`);
    const body = r.text || '';
    const dangerous = /<script|onerror=|javascript:/.test(body) && !/application\/json/.test(String(r.headers['content-type'] || ''));
    rows.push({ surface: `public post ${slug}`, status: r.status, dangerousMarkup: dangerous,
      verdict: r.status === 200 ? (dangerous ? 'FAIL-UNSANITIZED' : 'PASS (JSON content, renderer-side duty)') : 'REVIEW' });
  }
  return { untrustedContent: rows };
};

async function main() {
  const all = Object.keys(SEC);
  const selected = process.argv.slice(2).map((x) => x.toUpperCase());
  const runList = selected.length ? all.filter((id) => selected.includes(id)) : all;
  if (!runList.length) { console.error('No matching S ids:', selected.join(' ')); process.exit(64); }

  log('== login ==');
  const sessions = {};
  for (const role of ['clientA', 'clientB', 'admin']) {
    sessions[role] = new Session(role, ACCOUNTS[role]);
    const r = await sessions[role].login();
    log(`  ${role} status=${r.status}`);
  }
  const fx = await discover(sessions);
  const ctx = { sessions, fx };

  for (const id of runList) {
    const entry = SEC[id];
    log(`\n== ${id} — ${entry.title} ==`);
    const sections = {};
    const errors = [];
    for (const group of entry.probes) {
      const fn = probes[group];
      if (!fn) { errors.push(`no probe implemented for group "${group}"`); continue; }
      try {
        Object.assign(sections, await fn(ctx));
        log(`  probe "${group}" ok`);
      } catch (e) { errors.push(`probe ${group}: ${e.message}`); }
    }
    const evidence = { id, title: entry.title, generatedAt: new Date().toISOString(),
      stamp: STAMP, errors, ...sections };
    const file = path.join(outDir('evidence'), `${id}.json`);
    writeJson(file, evidence);
    log(`  -> ${path.basename(file)}`);
  }
  log('\nDone. Evidence in ' + outDir('evidence'));
}

main().catch((e) => { console.error(e); process.exit(1); });
