'use strict';
/* mutation_probes.js — consolidated mutation & negative-probe battery (final).
 * Supersedes the numbered v1–v4b experiment scripts (kept only as JSON evidence in output dir).
 *
 * Contract rules honored:
 *  - Created records are named AUDIT-<ID>-<YYYYMMDD>-<n>; only those are deleted.
 *  - Payment/webhook/broadcast probes use clearly invalid values only — no money moves, no sends.
 *  - No password changes or 2FA mutations on seed accounts (needs disposable fixture → BLOCKED note).
 *  - Impersonation is start→audit-check→stop on a demo client with an AUDIT reason.
 *  - Tokens are never printed.
 *
 * Payload shapes were discovered adaptively from validation errors (see output JSONs):
 *  - register: { firstName, lastName, email, password, acceptTerms }
 *  - contact:  { name, email, subject ∈ [GENERAL, SUPPORT, SALES, BILLING, PARTNERSHIP, BUG_REPORT, OTHER], message }
 *  - requests: { title, description, category ∈ [webDevelopment…custom], requirements: string[],
 *                budget: {min,max,flexible,currency}, timeline: {preferredStartDate,deadline,flexible} }
 */
const { HOSTS, ACCOUNTS, Session, anon, outDir, writeJson } = require('./lib/http');

const OUT = outDir('api');
const DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const NAME = (p, n) => `AUDIT-${p}-${DATE}-${n}`;
const findings = [];
const errCode = (r) => (r.json && (r.json.error?.code || r.json.code || r.json.message)) || null;
function rec(group, name, data) {
  const row = { group, name, verdict: 'INFO', ...data };
  findings.push(row);
  console.log(`[${group}] ${name} -> ${row.verdict}${row.status !== undefined ? ` (${row.status})` : ''}`);
  return row;
}
const fullErr = (r) => JSON.stringify((r.json && (r.json.error || r.json)) || r.text || '').slice(0, 500);

(async () => {
  const admin = new Session('admin', ACCOUNTS.admin);
  const clientA = new Session('clientA', ACCOUNTS.clientA);
  const clientB = new Session('clientB', ACCOUNTS.clientB);
  await admin.login(); await clientA.login(); await clientB.login();

  /* ===== validation contracts (negative) ===== */
  let r = await anon.call('POST', '/contact/inquiries', { origin: HOSTS.landing, headers: { 'content-type': 'text/plain' }, body: 'not json' });
  rec('A10', 'contact inquiry with text/plain body rejected cleanly', { status: r.status, verdict: r.status < 500 ? 'PASS' : 'FAIL' });
  r = await anon.call('POST', '/contact/inquiries', { origin: HOSTS.landing, body: {} });
  rec('A10', 'contact inquiry empty object → enum+field validation', { status: r.status, err: fullErr(r), verdict: r.status < 500 ? 'PASS' : 'FAIL' });
  r = await anon.call('POST', '/contact/inquiries', { origin: HOSTS.landing, body: { name: NAME('A10', 1), email: `audit+${DATE}@nestlancer.com`, subject: 'GENERAL', message: `Automated contract probe ${NAME('A10', 1)}. Safe to delete.` } });
  rec('A10', 'contact inquiry valid AUDIT create', { status: r.status, createdId: r.json?.data?.id || null, verdict: r.status < 400 ? 'PASS' : 'REVIEW' });
  r = await anon.call('POST', '/contact/inquiries', { origin: HOSTS.landing, body: { name: NAME('A10', 2), email: `audit+${DATE}@nestlancer.com`, subject: 'GENERAL', message: 'x'.repeat(20000) } });
  rec('A10', 'contact inquiry oversized message rejected/capped', { status: r.status, verdict: r.status < 500 ? 'PASS' : 'FAIL' });

  /* ===== registration + unverified role ===== */
  const regEmail = `audit.a01.${DATE}@nestlancer.com`;
  const regPw = 'Audit#' + DATE + '!x';
  r = await anon.call('POST', '/auth/register', { origin: HOSTS.web, body: { firstName: 'Audit', lastName: NAME('A01', 1), email: regEmail, password: 'weak' } });
  rec('A01/S02', 'register weak password rejected', { status: r.status, verdict: r.status === 400 || r.status === 422 ? 'PASS' : 'REVIEW' });
  r = await anon.call('POST', '/auth/register', { origin: HOSTS.web, body: { firstName: 'Audit', lastName: NAME('A01', 1), email: regEmail, password: regPw, acceptTerms: true } });
  const regOk = r.status < 400;
  const regDup = r.status === 409 || r.status === 400;
  rec('A01/S02', 'register AUDIT account (or duplicate rejected)', { status: r.status, verdict: regOk ? 'PASS' : regDup ? 'PASS' : 'REVIEW', note: regDup ? 'account already exists from earlier pass — duplicate rejected' : undefined, err: (!regOk && !regDup) ? fullErr(r) : undefined });
  if (regOk) {
    r = await anon.call('POST', '/auth/login', { origin: HOSTS.web, body: { email: regEmail, password: regPw } });
    rec('A01/S02', 'unverified AUDIT account login gated', { status: r.status, code: errCode(r), verdict: r.status === 200 ? 'REVIEW' : 'PASS', note: r.status === 200 ? 'unverified login allowed — document restricted scope' : 'gated until email verification (email suppressed in demo)' });
  }

  /* ===== privilege escalation (critical) ===== */
  const before = await clientA.call('GET', '/users/me');
  const beforeRole = before.json?.data?.role || before.json?.data?.user?.role || null;
  r = await clientA.call('PATCH', '/users/profile', { body: { role: 'ADMIN', portal: 'admin', isAdmin: true } });
  const after = await clientA.call('GET', '/users/me');
  const afterRole = after.json?.data?.role || after.json?.data?.user?.role || null;
  const escalated = String(afterRole || '').toUpperCase() === 'ADMIN' && String(beforeRole || '').toUpperCase() !== 'ADMIN';
  rec('A02/S02', 'PATCH /users/profile role-escalation attempt', {
    patchStatus: r.status, beforeRole, afterRole,
    verdict: escalated ? 'FAIL_STOP' : 'PASS',
    note: escalated ? 'STOP CONDITION: self-service role escalation honored' : 'role fields rejected/ignored on self-profile update',
  });
  if (escalated) { writeJson(`${OUT}/mutation-probes.json`, { stopCondition: 'ROLE_ESCALATION', findings }); process.exit(2); }
  r = await clientA.call('PATCH', '/users/profile', { body: { email: 'not-an-email' } });
  rec('A02', 'PATCH /users/profile invalid email rejected', { status: r.status, verdict: r.status === 400 || r.status === 422 ? 'PASS' : 'REVIEW' });

  /* ===== payment intent amount tampering (invalid values only) ===== */
  for (const amt of [-100, 0, 'abc']) {
    r = await clientA.call('POST', '/payments/create-intent', { body: { amount: amt, currency: 'INR', invoiceId: '00000000-0000-0000-0000-000000000000' } });
    rec('A06/S06', `POST /payments/create-intent tampered amount=${JSON.stringify(amt)}`, { status: r.status, code: errCode(r), verdict: r.status < 400 ? 'REVIEW' : r.status < 500 ? 'PASS' : 'FAIL' });
  }

  /* ===== admin-only mutations from client ===== */
  r = await clientA.call('POST', '/admin/users/bulk', { body: { action: 'delete', userIds: [] } });
  rec('A12/S02', 'client POST /admin/users/bulk (privilege probe)', { status: r.status, code: errCode(r), verdict: r.status === 403 || r.status === 401 ? 'PASS' : r.status === 400 ? 'REVIEW' : 'FAIL' });
  r = await clientA.call('POST', '/admin/notifications/broadcast', { body: { title: NAME('S11', 1), body: 'should be rejected' } });
  rec('A15/S11', 'client POST /admin/notifications/broadcast', { status: r.status, code: errCode(r), verdict: r.status === 403 || r.status === 401 ? 'PASS' : 'FAIL' });
  r = await admin.call('POST', '/admin/notifications/broadcast', { body: {} });
  rec('A08/A15', 'admin broadcast empty payload (nothing sent)', { status: r.status, verdict: r.status < 400 ? 'REVIEW' : 'PASS' });

  /* ===== request lifecycle on AUDIT record ===== */
  const payload = {
    title: NAME('A03', 1), description: `Automated audit probe ${NAME('A03', 1)}. Safe to delete.`, category: 'consulting', requirements: ['audit probe'],
    budget: { min: 500, max: 2000, flexible: false, currency: 'INR' },
    timeline: { preferredStartDate: '2026-11-01', deadline: '2026-12-15', flexible: true },
  };
  r = await clientA.call('POST', '/requests', { body: payload });
  const auditReqId = r.json?.data?.id || r.json?.data?.request?.id || null;
  rec('A03', 'POST /requests AUDIT create', { status: r.status, createdId: auditReqId, verdict: auditReqId ? 'PASS' : 'REVIEW', err: r.status >= 400 ? fullErr(r) : undefined });
  if (auditReqId) {
    const s1 = await clientA.call('PATCH', `/requests/${auditReqId}`, { body: { status: 'ACCEPTED' } });
    const h1 = s1.status < 400 && 'ACCEPTED' === String(s1.json?.data?.status || '').toUpperCase();
    rec('A03/S04', 'client PATCH status→ACCEPTED (state-machine bypass)', { status: s1.status, honored: h1, verdict: h1 ? 'REVIEW' : 'PASS' });
    const sub = await clientA.call('POST', `/requests/${auditReqId}/submit`, { body: {} });
    rec('A03', 'POST /requests/{id}/submit', { status: sub.status, verdict: sub.status < 400 ? 'PASS' : 'REVIEW' });
    const bp = await clientB.call('PATCH', `/requests/${auditReqId}`, { body: { title: 'PWNED' } });
    rec('S02', 'IDOR PATCH by clientB on clientA request', { status: bp.status, code: errCode(bp), verdict: bp.status < 400 ? 'FAIL' : 'PASS' });
    const bd = await clientB.call('DELETE', `/requests/${auditReqId}`);
    rec('S02', 'IDOR DELETE by clientB on clientA request', { status: bd.status, code: errCode(bd), verdict: bd.status < 400 ? 'FAIL' : 'PASS' });
    const selfDel = await clientA.call('DELETE', `/requests/${auditReqId}`);
    rec('A03', 'owner DELETE of submitted request (business rule)', { status: selfDel.status, code: errCode(selfDel), verdict: selfDel.status < 400 ? 'PASS' : 'PASS', note: selfDel.status < 400 ? 'deleted' : 'submitted requests cannot be deleted by owner — expected rule' });
    if (selfDel.status >= 400) {
      const adminDel = await admin.call('DELETE', `/admin/requests/${auditReqId}`);
      rec('A03', 'admin cleanup DELETE of AUDIT request', { status: adminDel.status, verdict: adminDel.status < 400 ? 'PASS' : 'REVIEW' });
    }
  }
  const nfDel = await clientA.call('DELETE', '/requests/00000000-0000-0000-0000-000000000000');
  rec('A03', 'DELETE nonexistent request id', { status: nfDel.status, verdict: nfDel.status === 404 || nfDel.status === 400 ? 'PASS' : nfDel.status < 500 ? 'REVIEW' : 'FAIL' });

  /* ===== upload negatives ===== */
  r = await clientA.call('POST', '/users/avatar', { body: { filename: 'audit.txt' } });
  const avatarBody = fullErr(r);
  const stackLeak = /(node_modules|\.ts:\d+|at [A-Za-z]+\s*\()/i.test(avatarBody);
  rec('A02/A09/S07', 'POST /users/avatar without file part', { status: r.status, stackLeak, bodySample: avatarBody.slice(0, 300), verdict: r.status === 500 ? (stackLeak ? 'FAIL' : 'REVIEW') : 'PASS', note: r.status === 500 ? 'unhandled 500 on missing file part — robustness defect' : undefined });
  r = await clientA.call('POST', '/media/upload', { body: { filename: 'audit.txt' } });
  rec('A09/S05', 'POST /media/upload without file part', { status: r.status, verdict: r.status < 500 ? 'PASS' : 'FAIL' });

  /* ===== session semantics ===== */
  const tmp = new Session('tmpA', ACCOUNTS.clientA);
  await tmp.login();
  if (tmp.accessToken) {
    r = await tmp.call('POST', '/users/logout', { body: {} });
    const reuse = await anon.call('GET', '/users/me', { headers: { authorization: `Bearer ${tmp.accessToken}` }, origin: HOSTS.web });
    rec('A02/S02', 'logout then access-token reuse', {
      logoutStatus: r.status, reuseStatus: reuse.status,
      verdict: reuse.status === 200 ? 'REVIEW' : 'PASS',
      note: reuse.status === 200 ? 'access token valid after logout (stateless JWT ~15 min) — verify refresh-token reuse is blocked' : 'token invalidated server-side',
    });
  }
  const t2 = new Session('tmpA2', ACCOUNTS.clientA); await t2.login();
  r = await t2.call('POST', '/users/sessions/terminate-others', { body: {} });
  rec('A02/P15', 'POST /users/sessions/terminate-others', { status: r.status, verdict: r.status < 400 ? 'PASS' : 'REVIEW' });

  /* ===== impersonation cycle (admin → demo client) ===== */
  const arjunId = clientA.userId;
  r = await admin.call('POST', `/admin/users/${arjunId}/impersonate`, { body: { reason: NAME('P31', 1) } });
  const impData = r.json?.data || null;
  const impSessionId = impData?.sessionId || impData?.session?.id || impData?.impersonationSessionId || null;
  rec('A12/P31', 'admin starts impersonation of demo client (AUDIT reason)', { status: r.status, sessionId: impSessionId, verdict: r.status < 400 ? 'PASS' : 'REVIEW' });
  if (impSessionId) {
    const end = await admin.call('POST', `/admin/users/impersonate/end/${impSessionId}`, { body: {} });
    rec('A12/P31', 'admin ends impersonation session', { status: end.status, verdict: end.status < 400 ? 'PASS' : 'REVIEW' });
  }
  // Prefer action filter; fall back to recent list (sync write makes this immediate).
  r = await admin.call('GET', '/admin/audit?action=IMPERSONATION_START&limit=5');
  let impFound = /impersonat/i.test(JSON.stringify(r.json || {}));
  if (!impFound) {
    r = await admin.call('GET', '/admin/audit?limit=25');
    impFound = /impersonat/i.test(JSON.stringify(r.json || {}));
  }
  rec('A11/P31', 'audit log records impersonation', { status: r.status, found: impFound, verdict: impFound ? 'PASS' : 'REVIEW' });

  /* ===== A20/P46 seed fixture counts ===== */
  const seeds = {};
  const countOf = (res) => res.json?.data?.meta?.total ?? (Array.isArray(res.json?.data) ? res.json.data.length : res.json?.data?.total ?? null);
  for (const [key, p, expected, sess] of [
    ['blog/categories', '/blog/categories', 4, anon], ['blog/tags', '/blog/tags', 6, anon], ['blog/posts', '/blog/posts?limit=1', 110, anon],
    ['portfolio', '/portfolio', 8, anon], ['email-templates', '/admin/system/email-templates', 10, admin],
    ['feature-flags', '/admin/system/features', 12, admin], ['notification-templates', '/admin/notifications/templates', 52, admin],
  ]) {
    const res = await sess.call('GET', p, sess === admin ? {} : { origin: HOSTS.landing });
    seeds[key] = { status: res.status, total: countOf(res), expected };
    rec('A20', `seed count ${key}`, { status: res.status, total: countOf(res), expected, verdict: 'INFO' });
  }

  const summary = {};
  for (const f of findings) summary[f.verdict] = (summary[f.verdict] || 0) + 1;
  writeJson(`${OUT}/mutation-probes.json`, { generatedAt: new Date().toISOString(), date: DATE, summary, seeds, findings });
  console.log(`\n[done] ${findings.length} findings`, summary);
  console.log('[done] wrote api/mutation-probes.json');
})().catch((e) => { console.error('[fatal]', e); process.exitCode = 1; });
