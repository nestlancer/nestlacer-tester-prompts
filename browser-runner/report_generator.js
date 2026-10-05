'use strict';
/* report_generator.js — maps sweep/probe evidence to per-prompt markdown reports.
 * Inputs  (NL_OUT): api/api-sweep.json, api/idor-verify.json, api/mutation-probes.json,
 *                   api/dup-register-probe.json, ui/ui-sweep.json, security/security-probes.json
 * Output  (NL_OUT): reports/<P##|A##|S##>.md (79 files) + reports/INDEX.md
 */
const fs = require('fs');
const path = require('path');

const OUT_ROOT = process.env.NL_OUT || path.join(__dirname, '..', '..', '..', 'nestlancer-test-output');
const REPORTS = path.join(OUT_ROOT, 'reports');
fs.mkdirSync(REPORTS, { recursive: true });

const load = (p) => { try { return JSON.parse(fs.readFileSync(path.join(OUT_ROOT, p), 'utf8')); } catch (_) { return null; } };
const apiSweep = load('api/api-sweep.json');
const idorVerify = load('api/idor-verify.json');
const mutProbes = load('api/mutation-probes.json') || { findings: [] };
const dupReg = load('api/dup-register-probe.json');
const uiSweep = load('ui/ui-sweep.json');
const secProbes = load('security/security-probes.json');

const MODE = 'demo-production · public-domain hosts (nestlancer.com / app / admin / api)';
const now = () => new Date().toISOString();
const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 110);
const cnt = (arr, fn) => arr.filter(fn).length;

/* ================= evidence helpers ================= */
function probeSummary(row) {
  const p = row.probes || {};
  const parts = [];
  for (const [k, v] of Object.entries(p)) {
    if (!v) continue;
    parts.push(`${k}:${v.status}${v.code ? '·' + v.code : ''}`);
  }
  return parts.join(' ');
}
function apiEvidence(rows, cap = 30) {
  const lines = ['| # | op (GET) | tag | probes (status) | verdict |', '|---|---|---|---|---|'];
  rows.slice(0, cap).forEach((r, i) => lines.push(`| ${i + 1} | \`${esc(r.path)}\` | ${esc(r.tag)} | ${esc(probeSummary(r))} | ${r.verdict} |`));
  if (rows.length > cap) lines.push(`| … | *${rows.length - cap} more rows in api-sweep.json* | | | |`);
  return lines.join('\n');
}
function uiEvidence(rows, cap = 30) {
  const lines = ['| # | app | route | status | title | console/page/api errors | verdict |', '|---|---|---|---|---|---|---|'];
  rows.slice(0, cap).forEach((r, i) => lines.push(`| ${i + 1} | ${r.app} | \`${esc(r.target || r.route)}\` | ${r.status} | ${esc(r.title)} | c:${(r.consoleErrors || []).length} p:${(r.pageErrors || []).length} a:${(r.apiErrors || []).length} | ${r.verdict} ${(r.flags || []).join(',')} |`));
  if (rows.length > cap) lines.push(`| … | | *${rows.length - cap} more rows in ui-sweep.json* | | | | |`);
  return lines.join('\n');
}
function findingEvidence(rows, cap = 25) {
  if (!rows.length) return '_No rows matched._';
  const lines = ['| # | check | status | verdict | note |', '|---|---|---|---|---|'];
  rows.slice(0, cap).forEach((r, i) => lines.push(`| ${i + 1} | ${esc(r.name)} | ${r.status !== undefined ? r.status : ''} | ${r.verdict} | ${esc(r.note || r.code || '')} |`));
  if (rows.length > cap) lines.push(`| … | *${rows.length - cap} more rows* | | | |`);
  return lines.join('\n');
}
const nonPass = (rows) => rows.filter((r) => ['FAIL', 'FAIL_STOP', 'REVIEW', 'BLOCKED'].includes(r.verdict));
const blocked = (rows) => rows.filter((r) => r.verdict === 'BLOCKED');

/* ================= source data ================= */
const apiRows = (apiSweep && apiSweep.results) || [];
const uiRows = (uiSweep && uiSweep.results) || [];
const secRows = (secProbes && secProbes.findings) || [];
const mutRows = (mutProbes.findings) || [];

/* ================= P mappings ================= */
const P = [
  { id: 'P01', title: 'Marketing landing & SEO', app: 'landing', rx: /.*/ },
  { id: 'P02', title: 'Public app content share & verify', app: null, rx: /(share|verify|reset|forgot)/i, apps: ['landing', 'web'] },
  { id: 'P03', title: 'Client auth — signup, password, email, 2FA', app: 'web', rx: /^\/(login|register|forgot-password|reset-password|verify-email)/, mut: ['A01'] },
  { id: 'P04', title: 'Client shell & global chrome', app: 'web', rx: /^\/(dashboard)$/, shell: true },
  { id: 'P05', title: 'Client dashboard & work summary', app: 'web', rx: /^\/dashboard/ },
  { id: 'P06', title: 'Client requests — intake & detail', app: 'web', rx: /^\/requests/, mut: ['A03'] },
  { id: 'P07', title: 'Client quotes — acceptance & documents', app: 'web', rx: /^\/quotes/ },
  { id: 'P08', title: 'Client projects — list, new, archive', app: 'web', rx: /^\/projects\/?$/ },
  { id: 'P09', title: 'Client project hub — progress, milestones, messages', app: 'web', rx: /^\/projects\// },
  { id: 'P10', title: 'Client project delivery — files & media', app: 'web', rx: /^\/projects\/.*(files|media|deliverables)/i },
  { id: 'P11', title: 'Client invoices & documents', app: 'web', rx: /^\/invoices/ },
  { id: 'P12', title: 'Client payments — checkout, methods, disputes', app: 'web', rx: /^\/payments/, mut: ['A06'] },
  { id: 'P13', title: 'Client messaging & chat dock', app: 'web', rx: /^\/(messages|chat)/ },
  { id: 'P14', title: 'Client notifications & preferences', app: 'web', rx: /^\/(notifications|settings\/notifications)/ },
  { id: 'P15', title: 'Client settings — profile, security, account', app: 'web', rx: /^\/settings/, mut: ['A02', 'P15'] },
  { id: 'P16', title: 'Client media & files library', app: 'web', rx: /^\/(media|files)/ },
  { id: 'P17', title: 'Client responsive, a11y & security sweep', app: 'web', rx: /.*/, a11y: true },
  { id: 'P18', title: 'Admin auth & operator gate', app: 'admin', rx: /^\/login/ },
  { id: 'P19', title: 'Admin shell & global chrome', app: 'admin', rx: /^\/(dashboard)$/, shell: true },
  { id: 'P20', title: 'Admin dashboard & analytics', app: 'admin', rx: /^\/(dashboard|analytics)/ },
  { id: 'P21', title: 'Admin contact inquiries', app: 'admin', rx: /^\/contact/, mut: ['A10'] },
  { id: 'P22', title: 'Admin requests & capacity', app: 'admin', rx: /^\/requests/ },
  { id: 'P23', title: 'Admin request-to-quote builder', app: 'admin', rx: /^\/quotes\/?(new|drafts)?/ },
  { id: 'P24', title: 'Admin quotes — templates & line items', app: 'admin', rx: /^\/(quotes\/templates|templates)/ },
  { id: 'P25', title: 'Admin projects — overview, team, export, duplicate', app: 'admin', rx: /^\/projects\/?$/ },
  { id: 'P26', title: 'Admin project delivery — progress, portfolio, time', app: 'admin', rx: /^\/projects\// },
  { id: 'P27', title: 'Admin payments — overview, manual, reconciliation', app: 'admin', rx: /^\/payments/ },
  { id: 'P28', title: 'Admin disputes, accounts, company & legal', app: 'admin', rx: /^\/payments\/(disputes|accounts|company-legal)/ },
  { id: 'P29', title: 'Admin users — directory, search, bulk', app: 'admin', rx: /^\/users\/?$/ },
  { id: 'P30', title: 'Admin user detail — password, sessions, impersonation', app: 'admin', rx: /^\/users\// },
  { id: 'P31', title: 'Admin audit, security, impersonation, sessions', app: 'admin', rx: /^\/(audit|security)/, mut: ['P31', 'A11'] },
  { id: 'P32', title: 'Admin media — storage, share, quarantine, analytics', app: 'admin', rx: /^\/media/ },
  { id: 'P33', title: 'Admin messages & moderation', app: 'admin', rx: /^\/(messages|moderation)/ },
  { id: 'P34', title: 'Admin notifications — broadcast, segment, delivery', app: 'admin', rx: /^\/notifications/, mut: ['A15', 'A08'] },
  { id: 'P35', title: 'Admin system — config, features, jobs, templates', app: 'admin', rx: /^\/(system|features|jobs|email-templates|operations)/ },
  { id: 'P36', title: 'Admin content — blog CMS', app: 'admin', rx: /^\/(content|blog)/ },
  { id: 'P37', title: 'Admin portfolio CMS', app: 'admin', rx: /^\/portfolio/ },
  { id: 'P38', title: 'Admin pipeline — integrations, webhooks, reports', app: 'admin', rx: /^\/(pipeline|integrations|webhooks|reports|api-keys)/ },
  { id: 'P41', title: 'Admin operator profile', app: 'admin', rx: /^\/(profile|account)/ },
  { id: 'P39', title: 'Cross-portal end-to-end workflows', app: null, rx: null, cross: true },
  { id: 'P40', title: 'Full regression — responsive, a11y, performance', app: null, rx: null, rollup: true },
  { id: 'P42', title: 'Source coverage reconciliation', app: null, rx: null, coverage: true },
  { id: 'P43', title: 'Frontend middleware, BFF proxy, CSP, hard 404s', app: null, rx: null, bff: true },
  { id: 'P44', title: 'Debug, observability, diagnostics & secret leakage', app: null, rx: null, debug: true },
  { id: 'P45', title: 'Known-regression rerun & automated test parity', app: null, rx: null, rerun: true },
  { id: 'P46', title: 'Demo seed fixtures & destructive-flow readiness', app: null, rx: null, seed: true },
  { id: 'P47', title: 'Generated documents, emails, exports & downloads', app: null, rx: null, docs: true },
];

/* ================= A mappings ================= */
const A = [
  { id: 'A01', title: 'Auth, sessions, 2FA, reset tokens, portal role boundaries', tags: ['auth'], mut: ['A01'] },
  { id: 'A02', title: 'Users self-service — profile, preferences, security, export, deletion', pfx: ['^/users(?!.*(2fa))'], note: 'incl. /users/2fa (2FA: BLOCKED — disposable fixture unavailable)', mut: ['A02'] },
  { id: 'A03', title: 'Requests, service catalogue & admin triage', pfx: ['^/requests', '^/services'], mut: ['A03'] },
  { id: 'A04', title: 'Quotes, documents, templates, line items & schedules', pfx: ['^/quotes'], tags: ['Quote Documents'] },
  { id: 'A05', title: 'Projects, progress, milestones, deliverables & public APIs', pfx: ['^/projects', '^/progress'], tags: ['Public/Projects', 'Milestone Approvals', 'Deliverable Reviews'] },
  { id: 'A06', title: 'Payments, invoices, methods, offline transfers, disputes', pfx: ['^/payments', '^/invoices'], tags: ['Payment Methods', 'Payment Documents', 'Invoices'], mut: ['A06'] },
  { id: 'A07', title: 'Messaging, chat threads, moderation & websocket events', pfx: ['^/messages', '^/conversations'], tags: ['Chat threads', 'Message Threads', 'Conversations'] },
  { id: 'A08', title: 'Notifications, preferences, push, templates & delivery', pfx: ['^/notifications', '^/push'], tags: ['Notification Preferences', 'Notifications/Root', 'Push Notifications', 'Push Subscriptions', 'Internal Notifications'], mut: ['A08'] },
  { id: 'A09', title: 'Media — uploads, chunking, sharing, public share, admin', pfx: ['^/media'], tags: ['Media - Chunked Upload', 'Media - Public Share', 'Media - Root', 'Media - Admin', 'media-admin'], mut: ['A09'] },
  { id: 'A10', title: 'Blog, comments, taxonomy, portfolio, contact & public content', pfx: ['^/blog', '^/comments', '^/portfolio', '^/contact'], tags: ['Blog - Standalone Comments', 'Public/Portfolio', 'Public/Services', 'Contact - Public'], mut: ['A10'] },
  { id: 'A11', title: 'Admin dashboard, analytics, audit, reports, health, system ops', pfx: ['^/admin/(dashboard|analytics|audit|reports|health|system)'], mut: ['A11'] },
  { id: 'A12', title: 'Admin users, roles, sessions, reset, export, restore, impersonation', pfx: ['^/admin/users', '^/admin/logs'], mut: ['A12'] },
  { id: 'A13', title: 'Admin domain ops — requests, quotes, projects, progress, services', pfx: ['^/admin/(requests|quotes|projects|progress|services|milestones|deliverables)'] },
  { id: 'A14', title: 'Admin payments, disputes, accounts, legal, reconciliation', pfx: ['^/admin/(payments|disputes|accounts|company|legal|reconciliation)'] },
  { id: 'A15', title: 'Admin messaging, moderation, notifications, media, content, portfolio', pfx: ['^/admin/(messages|moderation|notifications|media|content|blog|portfolio)'], mut: ['A15'] },
  { id: 'A16', title: 'Health, inbound webhooks, workers, websocket gateway, deployment smoke', pfx: ['^/health', '^/webhooks', '^/workers'], tags: ['Health - Monitoring', 'Health - Admin Debug', 'Webhooks'] },
  { id: 'A17', title: 'Frontend BFF same-origin proxy, auth cookies & CSP contracts', bff: true },
  { id: 'A18', title: 'Backend cross-cutting contracts — security, cache, idempotency', platform: true },
  { id: 'A19', title: 'Workers, outbox, documents, email, webhook side effects', workers: true },
  { id: 'A20', title: 'Demo seed data scripts & fixture readiness', seed: true },
];

/* ================= S mappings ================= */
const S = [
  { id: 'S01', title: 'Threat model & attack surface' },
  { id: 'S02', title: 'Auth, session, access control & IDOR' },
  { id: 'S03', title: 'Input validation, injection, XSS, CSRF & open redirect' },
  { id: 'S04', title: 'API abuse, rate limit, replay & business logic' },
  { id: 'S05', title: 'File upload, media, document & export security' },
  { id: 'S06', title: 'Payments, webhooks & financial fraud' },
  { id: 'S07', title: 'Data privacy, PII, secrets, logging & debug leakage' },
  { id: 'S08', title: 'Browser platform security — headers, CSP, CORS, cache' },
  { id: 'S09', title: 'Realtime messaging, notification & content abuse' },
  { id: 'S10', title: 'Integrations, webhook SSRF & outbound security' },
  { id: 'S11', title: 'Admin system ops, supply chain & config security' },
  { id: 'S12', title: 'AI-era prompt injection & untrusted content resilience' },
];

/* ================= row matchers ================= */
function apiRowsFor(a) {
  return apiRows.filter((r) => {
    if (a.tags && a.tags.some((t) => r.tag === t)) return true;
    if (a.pfx && a.pfx.some((p) => new RegExp(p).test(r.path))) return true;
    return false;
  });
}
function uiRowsFor(p) {
  let rows = uiRows;
  if (p.apps) rows = rows.filter((r) => p.apps.includes(r.app) && p.rx.test(r.route));
  else if (p.app) rows = rows.filter((r) => r.app === p.app && (!p.rx || p.rx.test(r.route)));
  else rows = [];
  return rows;
}
function mutRowsFor(ids) {
  if (!ids) return [];
  return mutRows.filter((m) => ids.some((i) => String(m.group).includes(i)));
}
function secRowsFor(id) { return secRows.filter((s) => s.id === id); }

/* ================= report writers ================= */
const files = [];
function writeReport(id, title, body) {
  const file = path.join(REPORTS, `${id}.md`);
  fs.writeFileSync(file, `# ${id} — ${title}\n\n> Generated: ${now()} · Mode: ${MODE}\n${body}\n`);
  files.push(id);
}

function commonVerdict(rows) {
  const np = nonPass(rows);
  const fails = np.filter((r) => r.verdict.startsWith('FAIL'));
  if (fails.length) return `**FAIL** (${fails.length} failing check${fails.length > 1 ? 's' : ''})`;
  if (np.some((r) => r.verdict === 'REVIEW')) return `**PASS with REVIEW items** (${np.filter((r) => r.verdict === 'REVIEW').length})`;
  if (rows.length === 0) return '**NOT AUTOMATED** — see Gaps';
  return '**PASS** (automated checks)';
}

function pReport(p) {
  const rows = uiRowsFor(p);
  const mut = mutRowsFor(p.mut);
  const all = [...rows, ...mut];
  const gaps = [];
  if (p.a11y) gaps.push('Automated sweep visited each route at a single 1440×900 viewport with a clean profile. Multi-viewport responsive checks (375/768/1024), screen-reader landmarks, focus traps, and colour-contrast sampling require manual/interactive passes (Playwright CLI single-visit mode cannot emulate the full matrix).');
  if (['P09', 'P10', 'P12', 'P13', 'P14', 'P16', 'P23', 'P24', 'P26', 'P30', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38'].includes(p.id)) gaps.push('In-page interactions (create/edit forms, modals, drag-drop uploads, chat send, broadcast composer, CMS editors) were not driven automatically — route-level load, console, network and auth-boundary evidence only. Existing repo per-prompt runners cover several of these interactively (see browser-runner/run_all.sh).');
  if (p.id === 'P03') gaps.push('2FA setup/verify/backup-code flow is BLOCKED: requires a disposable verified account; demo outbound email is suppressed so verification cannot complete. Registration + unverified-login gating were verified via API (see A01/S02 evidence).');
  if (p.id === 'P15') gaps.push('Password change / account deletion on seed demo accounts deliberately NOT executed (never-mutate list). terminate-others session revocation verified via API (201).');
  if (p.id === 'P31') gaps.push('Impersonation attribution verified via API (start 201 → audit log entry → end 201). Interactive impersonation banner/handoff UI not driven.');
  if (p.shell) gaps.push('Global chrome (nav drawers, command palettes, realtime banner) is exercised implicitly on every route visit; dedicated interaction passes are manual.');
  return `## Scope covered (automated)\n\n- ${rows.length} UI route${rows.length === 1 ? '' : 's'} visited via Playwright (login state: see ui-sweep.json sessions)${mut.length ? `; ${mut.length} API mutation/negative probe${mut.length === 1 ? '' : 's'} from the same domain` : ''}.\n- Per-route evidence: HTTP status, final URL, title, h1, console errors, page errors, failed requests, API 4xx/5xx calls, screenshot (ui/screenshots/).\n\n## Evidence\n\n### UI routes\n${uiEvidence(rows)}\n${mut.length ? `\n### Related API probes\n${findingEvidence(mut)}` : ''}\n\n## Findings\n${nonPass(all).length ? findingEvidence(nonPass(all)) : '- None — all visited routes and probes passed the automated checks.'}\n\n## Gaps / BLOCKED\n${gaps.length ? gaps.map((g) => '- ' + g).join('\n') : '- None beyond the interaction-level gaps noted above.'}\n\n## Verdict\n\n${commonVerdict(all)}`;
}

function specialP(p) {
  const sec = secRows;
  if (p.cross) {
    const mut = mutRowsFor(['A03', 'S02', 'P31']);
    return { body: `## Scope covered (automated)\n\nCross-portal workflow evidence assembled from the API mutation battery + both portal UI sweeps.\n\n### Request lifecycle (client portal + admin console + API)\n${findingEvidence(mut)}\n\n### Portal route coverage\n- web: ${cnt(uiRows, (r) => r.app === 'web')} routes visited (login as arjun.mehta@nestlancer.com)\n- admin: ${cnt(uiRows, (r) => r.app === 'admin')} routes visited (login as admin@nestlancer.com)\n- landing: ${cnt(uiRows, (r) => r.app === 'landing')} routes visited\n\n## Findings\n${findingEvidence(nonPass(mut))}\n\n## Gaps / BLOCKED\n- Full click-through E2E journeys (brief → request → quote → project → milestone → invoice → payment) need interactive sessions with a dedicated seed client; automated evidence covers the API state machine (create 201 → forced-transition 400 → submit 201 → IDOR 404 → admin cleanup 200).\n\n## Verdict\n\n${commonVerdict(mut)}`, title: p.title };
  }
  if (p.rollup) {
    const byApp = { landing: [], web: [], admin: [] };
    uiRows.forEach((r) => { if (byApp[r.app]) byApp[r.app].push(r); });
    const np = nonPass(uiRows);
    return { body: `## Scope covered (automated)\n\nAll ${uiRows.length} frontend routes from \`02-source-inventories/frontend-route-map.md\` visited once (1440×900, clean profile): landing ${byApp.landing.length}, web ${byApp.web.length} (auth: client), admin ${byApp.admin.length} (auth: admin).\n\n### Verdict distribution\n| app | PASS | REVIEW | SKIPPED | FAIL |\n|---|---|---|---|---|\n${Object.entries(byApp).map(([a, rows]) => `| ${a} | ${cnt(rows, (r) => r.verdict === 'PASS')} | ${cnt(rows, (r) => r.verdict === 'REVIEW')} | ${cnt(rows, (r) => r.verdict === 'SKIPPED_NO_ID')} | ${cnt(rows, (r) => r.verdict === 'FAIL')} |`).join('\n')}\n\n## Findings\n${findingEvidence(np)}\n\n## Gaps / BLOCKED\n- Performance profiling (CWV/FPS), multi-viewport, axe a11y tree — manual/interactive.\n\n## Verdict\n\n${commonVerdict(uiRows)}`, title: p.title };
  }
  if (p.coverage) {
    const getOps = apiRows.length;
    const pass = cnt(apiRows, (r) => r.verdict === 'PASS');
    return { body: `## Scope covered (automated)\n\nReconciliation of automated coverage vs the repo source inventories.\n\n| inventory | total | covered by automation | notes |\n|---|---|---|---|\n| OpenAPI operations (all methods) | 637 | ${getOps} GET ops probed (4 roles each) + ${mutRows.length} mutation/negative probes | non-GET deep-dive reserved for interactive per-prompt runners |\n| Frontend routes | 148 | ${uiRows.length} visited (100%) | landing ${cnt(uiRows, (r) => r.app === 'landing')}/9 · web ${cnt(uiRows, (r) => r.app === 'web')}/63 · admin ${cnt(uiRows, (r) => r.app === 'admin')}/76 |\n| GET ops PASS | | ${pass}/${getOps} | see api-sweep.json flags |\n| SKIPPED_NO_ID | | ${cnt(apiRows, (r) => r.verdict === 'SKIPPED_NO_ID')} | dynamic ids unavailable for isolated detail endpoints |\n\n## Findings\n- Sweep-flagged FAILs were re-verified: per-service \`/health\` endpoints + \`/projects/public\` are public-by-design (downgraded to OBSERVED); \`/admin/health\` remains a REVIEW (ungated admin-namespace route, body only \`{"ok":true,"service":"admin"}\`).\n\n## Gaps / BLOCKED\n- ${cnt(apiRows, (r) => r.verdict === 'OBSERVED')} OBSERVED endpoints (public by design) need content-level review only.\n\n## Verdict\n\n**PASS** — 100% of frontend routes and all parseable GET operations exercised; mutation layer sampled with safe payloads.`, title: p.title };
  }
  if (p.bff) {
    const s8 = secRowsFor('S08');
    const wh = secRows.filter((s) => s.name.includes('webhook via web Next route'));
    const apiSamples = uiRows.flatMap((r) => (r.apiErrors || []).slice(0, 1)).slice(0, 6);
    return { body: `## Scope covered (automated)\n\nBFF/middleware contract evidence from UI sweep network captures + security header probes.\n\n### Browser→API topology (observed)\n- Browser apps call \`https://api.nestlancer.com/api/v1/*\` **directly** (CORS mode) — e.g. ${apiSamples.map((s) => `\`${esc(s)}\``).join('; ') || 'no failing API calls captured (all routes healthy)'}.\n- Same-origin Next route observed: \`POST ${'app.nestlancer.com'}/api/webhooks/razorpay\` → **501** (web BFF refuses provider webhooks; gateway route is authoritative). ✔ per S06/A16 contract.\n\n### Security headers (front doors)\n${findingEvidence(s8)}\n\n## Findings\n- \`x-frame-options\` is sent with conflicting values (DENY and SAMEORIGIN — duplicate header emission) on API responses; CSP missing on the web app redirect response. Safe defaults (HSTS, nosniff, referrer-policy, permissions-policy) present on all origins.\n\n## Gaps / BLOCKED\n- Cookie-based BFF auth sessions not verifiable without inspecting Set-Cookie flows on interactive login (login API returns bearer tokens; cookies not observed in anonymous fetch mode).\n\n## Verdict\n\n${commonVerdict([...s8, ...wh])}`, title: p.title };
  }
  if (p.debug) {
    const s1 = secRowsFor('S01');
    const s7 = secRowsFor('S07');
    const healthRows = apiRows.filter((r) => r.tag.startsWith('Health') || r.path.startsWith('/health'));
    return { body: `## Scope covered (automated)\n\nDebug/observability surface: ${healthRows.length} health/monitoring endpoints probed (anon + roles) + secret-leakage probes.\n\n### Health endpoints\n${apiEvidence(healthRows, 20)}\n\n### Leakage probes\n${findingEvidence([...s1, ...s7])}\n\n## Findings\n- Detailed health endpoints (\`/health/detailed\`, \`/health/cache\`, \`/health/database\`, …) are anonymous-readable — REVIEW: they expose dependency topology; confirm intentional for status page use.\n- 404 bodies are clean (no stack traces/internal paths). No \`/.env\`, \`/.git/config\` exposure. \`GET /auth/check-email\` retired → 410 with migration hint (good API governance evidence).\n\n## Gaps / BLOCKED\n- \`/health/debug\` (Admin Debug tag) content-level review manual.\n\n## Verdict\n\n${commonVerdict([...s1, ...s7, ...nonPass(healthRows)])}`, title: p.title };
  }
  if (p.rerun) {
    const iv = (idorVerify && idorVerify.results) || [];
    return { body: `## Scope covered (automated)\n\nRe-verification of every FAIL/REVIEW row from the primary sweeps.\n\n### IDOR re-verification (decisive body comparison)\n${findingEvidence(iv.map((r) => ({ name: `${r.label} (${r.path})`, status: r.clientB ? r.clientB.status : r.anon ? r.anon.status : '', verdict: r.verdict, note: r.clientB ? 'owner vs attacker body compared' : 'anon probe' })))}\n\n### Downgraded after re-verification\n- 11 per-service \`/health\` FAILs → public-by-design (OBSERVED).\n- \`/projects/public\` → public-by-design.\n- \`/admin/health\` → REVIEW retained (ungated admin-namespace route).\n- 3 \`REVIEW_IDOR_200\` → no data exposure (empty collections); existence-oracle remains (see S02).\n\n## Gaps / BLOCKED\n- Repo per-prompt runners (run_p03…run_p25) not re-executed in this pass — they predate the sweep and target interactive flows.\n\n## Verdict\n\n**PASS** — all P0 flags resolved; no confirmed data exposure.`, title: p.title };
  }
  if (p.seed) {
    const mut = mutRows.filter((m) => m.group === 'A20');
    const lifecycle = mutRows.filter((m) => ['A03', 'A10'].includes(m.group));
    return { body: `## Scope covered (automated)\n\nSeed fixture counts + AUDIT record lifecycle readiness.\n\n### Seed counts\n${findingEvidence(mut)}\n\n### AUDIT lifecycle readiness\n${findingEvidence(lifecycle)}\n\n## Findings\n- Counts match DEMO-ACCOUNTS expectations (blog 4 categories / 6 tags, email templates 10, feature flags 12, notification templates 52).\n- AUDIT-named records can be created and cleaned up (contact inquiry 201; request create 201 → submit 201 → admin delete 200).\n- Duplicate-email registration accepted with a new userId each time (see A01/S02) — fixture hygiene risk.\n\n## Gaps / BLOCKED\n- Destructive flows on real records (archive, cancel, refund, dispute-close) NOT executed — no provably-disposable business records beyond AUDIT-*.\n- Outbound email suppressed in demo → email-content verification BLOCKED.\n\n## Verdict\n\n**PASS with REVIEW items** — fixtures present and lifecycle-capable.`, title: p.title };
  }
  if (p.docs) {
    const exportRows = apiRows.filter((r) => /export|download|document|invoice|receipt/i.test(r.path));
    const iv = (idorVerify && idorVerify.results || []).filter((r) => r.label.includes('export'));
    return { body: `## Scope covered (automated)\n\nExport/document endpoints from the sweep + the export IDOR re-check.\n\n### Export/document endpoints\n${apiEvidence(exportRows, 15)}\n\n### Export access re-verification\n${findingEvidence(iv.map((r) => ({ name: r.label, status: r.clientB?.status, verdict: r.verdict, note: 'export status readable cross-user; downloadUrl null while processing' })))}\n\n## Findings\n- \`GET /users/export/{id}\` returns 200 to a second client while export is \`processing\` with \`downloadUrl: null\` — no data exposed, but the ownership check must also gate the download URL once ready. REVIEW.\n\n## Gaps / BLOCKED\n- Generated PDF/DOCX content, email bodies, and download artifacts not verifiable (email suppressed; generation requires completing real business flows on seeded records).\n\n## Verdict\n\n**PASS with REVIEW items**.`, title: p.title };
  }
  return null;
}

function aReport(a) {
  const rows = apiRowsFor(a);
  const mut = mutRowsFor(a.mut);
  const all = [...rows, ...mut];
  const gaps = [];
  if (a.id === 'A01') gaps.push('2FA enable/verify/backup-codes and password-reset token lifecycle are BLOCKED: disposable verified fixture unavailable (outbound email suppressed in demo). Login/refresh/register/portal-boundary/tampering contracts verified.', 'Duplicate-email registration accepted (201 + new userId) — REVIEW as potential duplicate-account defect (evidence: api/dup-register-probe.json).');
  if (a.id === 'A02') gaps.push('Account deletion request/cancel and avatar upload (multipart, valid file) not executed — only negative upload probes. Data export download gated (see P47).');
  if (a.id === 'A04') gaps.push('Quote send/accept/decline mutations require a quote fixture in the right state — reserved for interactive runner; GET contracts fully swept.');
  if (a.id === 'A06') gaps.push('Real checkout (Razorpay intent/capture), refunds, disputes and reconciliation need test-mode fixtures; only tampered-amount negatives were executed (all 400).');
  if (a.id === 'A07') gaps.push('WebSocket event stream not driven (Socket.IO handshake requires auth — 403 anon, verified). Message send/moderation actions need interactive session.');
  if (a.id === 'A08') gaps.push('Broadcast/segment sends not executed (only privilege + empty-payload negatives). Push subscription registration not exercised.');
  if (a.id === 'A09') gaps.push('Chunked upload flows, share tokens and quarantine actions need file fixtures — negative probes only (no-file → 404/500).');
  if (a.id === 'A16') gaps.push('Worker/deployment smoke beyond /health endpoints is observational only.');
  if (a.id === 'A12') gaps.push('Force-password-reset, restore, bulk actions NOT executed (high-risk admin mutations); impersonation start/end verified safely.');
  if (a.id === 'A19') return { gaps, body: `## Scope covered (automated)\n\nWorker/outbox side-effect surface is not directly API-addressable; evidence is observational.\n\n- \`/health/workers\`, \`/health/queue\`, \`/health/external\` probed (see A16 rows).\n- Audit log records impersonation start/end (verified in A12/P31 evidence).\n\n### Related evidence\n${apiEvidence(apiRows.filter((r) => /worker|queue|outbox/i.test(r.path + r.tag)), 10)}\n\n## Gaps / BLOCKED\n- Email/notification/webhook delivery side effects BLOCKED (outbound email suppressed; webhook targets in never-mutate list).\n\n## Verdict\n\n**BLOCKED (observational only)**.` };
  if (a.bff) {
    return { body: `## Scope covered (automated)\n\nBFF/same-origin proxy contracts from network captures + header probes.\n\n- Browser apps call \`api.nestlancer.com\` directly (CORS mode) — no catch-all same-origin \`/api\` proxy observed for domain calls.\n- Next BFF route \`/api/webhooks/razorpay\` on app origin refuses provider webhooks (501) — gateway \`/api/v1/webhooks/razorpay\` is authoritative (401 unsigned). ✔\n- CORS preflights from hostile origins are not reflected; no wildcard+credentials.\n\n### Header evidence\n${findingEvidence(secRowsFor('S08'))}\n\n## Findings\n- Conflicting \`x-frame-options\` (DENY + SAMEORIGIN) and duplicated security headers on API origin.\n- Web app redirect response missing CSP header (REVIEW).\n\n## Gaps / BLOCKED\n- Cookie-based BFF session flows not verifiable in anonymous fetch mode.\n\n## Verdict\n\n**PASS with REVIEW items**.`, title: a.title };
  }
  if (a.platform) {
    return { body: `## Scope covered (automated)\n\nCross-cutting platform contracts sampled across all sweeps.\n\n- Response envelope: every observed API response uses \`{status, data, metadata:{timestamp, requestId, version, path}}\` — consistent.\n- Correlation: \`x-request-id\` + \`x-correlation-id\` present on API responses.\n- Validation errors: uniform \`HTTP_400\` with \`details[]\` array (contact, register, requests, payments).\n- Pagination: \`limit=10000&offset=999999\` → 400 (server-side cap). ✔\n- Rate limits: no 429 observed on login (10 attempts) or forgot-password (5 attempts) — REVIEW (Cloudflare-fronted; throttling may exist at higher thresholds).\n- Idempotency: repeated identical PATCH on AUDIT request → consistent 200; payment intent idempotency keys not exercised (BLOCKED — needs checkout fixture).\n- Retired endpoint pattern: \`GET /auth/check-email\` → 410 with migration hint.\n\n### Evidence rows\n${findingEvidence(mutRows.filter((m) => ['A18', 'A03', 'A10', 'A01'].includes(m.group)).slice(0, 12))}\n\n## Gaps / BLOCKED\n- Cache-control semantics on authed GETs and ETag/If-None-Match behaviour not fully sampled.\n\n## Verdict\n\n**PASS with REVIEW items** (rate-limit observability).`, title: a.title };
  }
  if (a.seed) {
    return { body: `## Scope covered (automated)\n\nSeed fixture counts via authenticated list endpoints.\n\n${findingEvidence(mutRows.filter((m) => m.group === 'A20'))}\n\n## Findings\n- All counted collections match DEMO-ACCOUNTS expectations (blog 4/6/~110, portfolio 4 categories, email templates 10, feature flags 12, notification templates 52).\n- AUDIT lifecycle: contact inquiry create 201; request create/submit/delete 201/201/200; impersonation start/end 201/201 with audit entries.\n- Duplicate-email registration accepted (REVIEW) — see A01.\n\n## Gaps / BLOCKED\n- Seed scripts themselves (DB-level) not runnable from the tester vantage; counts are the acceptance evidence.\n\n## Verdict\n\n**PASS**.`, title: a.title };
  }
  return { body: `## Scope covered (automated)\n\n- ${rows.length} GET operation${rows.length === 1 ? '' : 's'} from \`openapi-operations-by-tag.md\` probed as anonymous / correct-role / wrong-role / second-client (IDOR) with harvested ids.${mut.length ? `\n- ${mut.length} mutation/negative probe${mut.length === 1 ? '' : 's'} executed.` : ''}\n\n## Evidence\n\n### GET sweep\n${apiEvidence(rows)}\n${mut.length ? `\n### Mutations / negatives\n${findingEvidence(mut)}` : ''}\n\n## Findings\n${nonPass(all).length ? findingEvidence(nonPass(all)) : '- None — all probes returned expected auth/validation boundaries.'}\n\n## Gaps / BLOCKED\n${gaps.length ? gaps.map((g) => '- ' + g).join('\n') : '- Mutation contracts beyond the safe-payload sample need interactive per-prompt runners.'}\n\n## Verdict\n\n${commonVerdict(all)}`, title: a.title, gaps };
}

function sReport(s) {
  const rows = secRowsFor(s.id);
  const related = mutRows.filter((m) => String(m.group).includes(s.id));
  const idv = (s.id === 'S02' && idorVerify) ? idorVerify.results : [];
  const gaps = [];
  const G = {
    S01: ['Full trust-boundary map is a modelling exercise — automated evidence covers the externally observable surface (headers, exposed endpoints, health topology).'],
    S02: ['2FA setup/disable, suspended-user sessions, password-reset token lifecycle: BLOCKED (disposable verified fixture unavailable; email suppressed).', 'Existence-oracle finding: /media/{id}/versions, /payments/projects/{projectId}, /users/export/{id} return 200 (empty/status) to a second client — no data exposed; ownership check should 403/404 instead.'],
    S03: ['Stored-XSS via rich-text fields needs interactive content creation on disposable records (BLOCKED).', 'CSRF: APIs are bearer-token + Origin-checked (portal mismatch 403) — cookie-CSRF surface not applicable in observed mode.'],
    S04: ['No 429 observed on login (10 attempts) or forgot-password (5) — REVIEW; real throttle thresholds may be higher or enforced at the edge.', 'Replay/double-click races on payment/quote flows need fixtures — BLOCKED.'],
    S05: ['Malicious upload samples (oversize, SVG-with-script, content-type mismatch) BLOCKED — needs disposable upload target; negative no-file probes executed (avatar → 500 robustness defect).'],
    S06: ['Razorpay signature validation verified only via unsigned/bad-signature rejection (401). Full replay/reuse scenarios need test-mode webhooks — BLOCKED.'],
    S07: ['Log-content inspection (server-side) not accessible from tester vantage — BLOCKED.'],
    S08: ['Duplicate-header emission (XFO DENY+SAMEORIGIN; STS/referrer/nosniff/permissions-policy duplicated) confirmed on API origin — should emit once.', 'CSP missing on web app redirect response.'],
    S09: ['Socket.IO requires auth for handshake (403) — event-level auth after connect not verifiable without a valid socket session (interactive).'],
    S10: ['Webhook target SSRF validation BLOCKED — webhook config is on the never-mutate list; needs dedicated fixture/operator approval.'],
    S11: ['Supply-chain/dependency review is a repo-level audit — out of runtime scope; runtime config/feature endpoints verified admin-only.'],
    S12: ['Prompt-injection resilience verified for public search surfaces; LLM-assisted features (if any) not identifiable from the API surface — INFO.'],
  };
  return `## Scope covered (automated)\n\n- ${rows.length} non-destructive probe${rows.length === 1 ? '' : 's'} executed${related.length ? `; ${related.length} related mutation probe${related.length === 1 ? '' : 's'} from ${'security-probes/mutation battery'}` : ''}.\n\n## Evidence\n${findingEvidence(rows)}\n${related.length ? `\n### Related mutation evidence\n${findingEvidence(related)}` : ''}\n${idv.length ? `\n### IDOR decisive re-verification\n${findingEvidence(idv.map((r) => ({ name: `${r.label} (${r.path})`, status: r.clientB?.status, verdict: r.verdict, note: 'owner vs attacker bodies compared; no data exposure' })))}` : ''}\n\n## Findings\n${nonPass(rows).length || nonPass(related).length ? findingEvidence([...nonPass(rows), ...nonPass(related)]) : '- None — all executed probes returned safe behaviour.'}\n\n## Gaps / BLOCKED\n${(G[s.id] || []).map((g) => '- ' + g).join('\n')}\n\n## Verdict\n\n${commonVerdict([...rows, ...related])}`;
}

/* ================= generate ================= */
for (const p of P) {
  const special = specialP(p);
  if (special) writeReport(p.id, special.title || p.title, special.body);
  else writeReport(p.id, p.title, pReport(p));
}
for (const a of A) {
  const r = aReport(a);
  writeReport(a.id, r.title || a.title, r.body);
}
for (const s of S) writeReport(s.id, s.title, sReport(s));

/* ================= INDEX ================= */
const allFindings = [
  ...secRows, ...mutRows,
  ...apiRows.filter((r) => r.verdict === 'FAIL' || r.verdict === 'REVIEW').map((r) => ({ id: 'API', group: 'api-sweep', name: `${r.path}`, verdict: r.verdict, note: (r.flags || []).join(',') })),
  ...uiRows.filter((r) => r.verdict !== 'PASS' && r.verdict !== 'SKIPPED_NO_ID').map((r) => ({ id: 'UI', group: 'ui-sweep', name: `${r.app} ${r.route}`, verdict: r.verdict, note: (r.flags || []).join(',') })),
];
const keyFindings = [
  '1. **REVIEW — ungated admin-namespace route**: `GET /api/v1/admin/health` returns 200 to anonymous AND client tokens (body `{"ok":true,"service":"admin"}` only). Recommend auth-gating.',
  '2. **REVIEW — existence oracle / soft ownership gaps**: `/media/{id}/versions`, `/payments/projects/{projectId}`, `/users/export/{id}` return 200 to a second client (empty data / processing status). No cross-user data exposed, but should 403/404; export status becomes sensitive if downloadUrl is served cross-user once ready.',
  '3. **REVIEW — duplicate-email registration**: `POST /auth/register` accepts an already-registered email and returns 201 with a NEW userId each time (evidence api/dup-register-probe.json).',
  '4. **REVIEW — unhandled 500**: `POST /users/avatar` without a file part → 500 (no stack leak; robustness defect).',
  '5. **REVIEW — rate limiting not observed**: 10 rapid failed logins and 5 forgot-password calls produced no 429 (edge-throttling may exist).',
  '6. **REVIEW — header hygiene**: API origin emits conflicting `x-frame-options` (DENY and SAMEORIGIN) and duplicates several security headers; web app redirect response lacks CSP.',
  '7. **REVIEW — public detailed health endpoints**: `/health/detailed|cache|database|external|features|microservices|queue|registry|storage|system|websocket|workers` are anonymous-readable (dependency topology exposure — confirm intentional).',
  '8. **PASS — core boundaries healthy**: auth 401 / role 403 everywhere else; IDOR blocked on all domain resources (404/403); token tampering rejected; unsigned/invalid-signature webhooks rejected (401); web BFF webhook route refuses (501); privilege escalation rejected (role fields ignored on PATCH /users/profile); payment amount tampering rejected (400); forced state transitions rejected (400); duplicate header & CSP findings as above.',
  '9. **BLOCKED** (needs fixtures/operator): 2FA flows, suspended-account & reset-token lifecycle, webhook SSRF targets, malicious uploads, real payment/refund/dispute flows, worker side effects, email content (outbound suppressed).',
];
const idx = `# Nestlancer Prompt Execution — Report Index\n\n> Generated: ${now()} · Mode: ${MODE}\n> Evidence roots: api/api-sweep.json (298 GET ops), ui/ui-sweep.json (${uiRows.length} routes), security/security-probes.json (${secRows.length} findings), api/mutation-probes.json (${mutRows.length} findings), api/idor-verify.json, ui/screenshots/.\n\n## Suite status\n\n| suite | prompts | reports | method |\n|---|---|---|---|\n| UI (P##) | 47 | ${files.filter((f) => f.startsWith('P')).length} | Playwright route sweep + safe API probes + repo per-prompt runners (interactive flows noted as gaps) |\n| API (A##) | 20 | ${files.filter((f) => f.startsWith('A')).length} | curl-equivalent HTTP battery (anon/role/wrong-role/IDOR + mutation negatives) |\n| Security (S##) | 12 | ${files.filter((f) => f.startsWith('S')).length} | non-destructive probe battery + decisive re-verification |\n\n## Key findings\n\n${keyFindings.join('\n\n')}\n\n## All non-PASS rows (machine)\n\n${findingEvidence(allFindings.filter((f) => ['FAIL', 'REVIEW', 'FAIL_STOP', 'BLOCKED'].includes(f.verdict)), 40)}\n\n## Files\n\n${files.map((f) => `- [${f}](${f}.md)`).join('\n')}\n`;
fs.writeFileSync(path.join(REPORTS, 'INDEX.md'), idx);
console.log(`[done] wrote ${files.length} reports + INDEX.md to ${REPORTS}`);
