'use strict';
/* idor_verify.js — decisive follow-up for REVIEW_IDOR_200 rows from the API sweep.
 * Compares clientA (owner) vs clientB (attacker) response BODIES on the same paths.
 * Read-only. Bodies are redacted by lib/http redact() before printing.
 */
const { HOSTS, ACCOUNTS, Session, anon, outDir, writeJson } = require('./lib/http');

const OUT = outDir('api');

(async () => {
  const clientA = new Session('clientA', ACCOUNTS.clientA);
  const clientB = new Session('clientB', ACCOUNTS.clientB);
  await clientA.login(); await clientB.login();

  const targets = [
    { path: '/media/01a10a2b-b656-718b-8eb0-6bbd97d1bf85/versions', label: 'media versions' },
    { path: '/payments/projects/01a10cbc-edbf-764c-bc51-b35825aea61d', label: 'project payments' },
    { path: '/users/export/01a10d08-2908-761a-948f-ce38dece4777', label: 'user data export' },
    { path: '/admin/health', label: 'admin health (anon probe)', anon: true },
    { path: '/projects/public', label: 'projects public (anon probe)', anon: true },
  ];

  const out = [];
  for (const t of targets) {
    const row = { label: t.label, path: t.path };
    if (t.anon) {
      const r = await anon.call('GET', t.path, { origin: HOSTS.admin });
      row.anon = { status: r.status, body: r.json || r.text };
      row.verdict = r.status === 200 ? 'PUBLIC_BY_DESIGN_REVIEW_BODY' : 'blocked';
    } else {
      const a = await clientA.call('GET', t.path);
      const b = await clientB.call('GET', t.path);
      const bodyA = JSON.stringify(a.json || a.text || '');
      const bodyB = JSON.stringify(b.json || b.text || '');
      row.clientA = { status: a.status, bodySample: bodyA.slice(0, 400) };
      row.clientB = { status: b.status, bodySample: bodyB.slice(0, 400) };
      row.sameBody = bodyA === bodyB;
      const dataB = (() => { try { const d = b.json && b.json.data; return Array.isArray(d) ? { type: 'array', len: d.length } : { type: typeof d }; } catch (_) { return null; } })();
      const dataA = (() => { try { const d = a.json && a.json.data; return Array.isArray(d) ? { type: 'array', len: d.length } : { type: typeof d }; } catch (_) { return null; } })();
      row.dataShape = { owner: dataA, attacker: dataB };
      // real exposure = attacker 200 AND receives non-empty user-scoped content
      const attackerEmpty = dataB && ((dataB.type === 'array' && dataB.len === 0) || dataB.type === 'null' || dataB.type === 'undefined');
      row.verdict = b.status === 200 && !attackerEmpty && bodyB.length > 40 && !/^\{"data":\[\],"/.test(bodyB)
        ? (row.sameBody ? 'CONFIRMED_IDOR_SAME_DATA' : 'REVIEW_DIFFERING_DATA')
        : 'EMPTY_200_NO_DATA_EXPOSED';
    }
    out.push(row);
    console.log(`\n=== ${row.label} (${t.path}) -> ${row.verdict}`);
    if (row.clientA) console.log('clientA:', JSON.stringify(row.clientA).slice(0, 300));
    if (row.clientB) console.log('clientB:', JSON.stringify(row.clientB).slice(0, 300));
    if (row.anon) console.log('anon:', JSON.stringify(row.anon).slice(0, 300));
  }
  writeJson(`${OUT}/idor-verify.json`, { generatedAt: new Date().toISOString(), results: out });
  console.log('\n[done] wrote api/idor-verify.json');
})().catch((e) => { console.error('[fatal]', e); process.exitCode = 1; });
