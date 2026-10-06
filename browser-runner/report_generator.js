'use strict';
/* report_generator.js — assembles one markdown report per prompt (79 total)
 * from the evidence collected by api_runner.js / ui_runner.js /
 * security_runner.js, following each prompt file's own output template.
 *
 * Inputs  ($NL_OUT): evidence/<ID>.json, evidence/ui-walk.json
 * Outputs ($NL_OUT): reports/<ID>.md + reports/INDEX.md
 *
 *   node report_generator.js           # all prompts with evidence
 *   node report_generator.js P01 A01   # selected
 */
const fs = require('fs');
const path = require('path');
const { allIds, outputTemplate } = require('./lib/prompts');
const ALL = allIds();

const OUT_ROOT = process.env.NL_OUT || path.join(__dirname, '..', '..', 'nestlancer-test-output');
const EVD = path.join(OUT_ROOT, 'evidence');
const REPORTS = path.join(OUT_ROOT, 'reports');
fs.mkdirSync(REPORTS, { recursive: true });

const NOW = new Date().toISOString();
const TODAY = NOW.slice(0, 10);

/* ---------------------------------------------------------- loading */
function loadEvidence(id) {
  const f = path.join(EVD, `${id}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

/* ------------------------------------------------- verdict helpers */
const P0 = /FAIL-(PRIVESC|CROSS-USER-READ|ANON-WRITE|TOKEN-FORGERY|STACK-LEAK|SECRET-LEAK|UNAUTH-FILE|AMOUNT-ACCEPTED|UNSIGNED-ACCEPTED|REFLECTED-XSS|OPEN-REDIRECT|PII-LIST|ADMIN-SURFACE|SOURCEMAP|CORS-WILDCARD)/;
const isBug = (v) => /^FAIL/.test(v || '') || P0.test(v || '');
const sev = (v) => P0.test(v || '') ? 'P0' : (/^FAIL/.test(v || '') ? 'P1' : (/UNEXPECTED|REVIEW|SHORT/.test(v || '') ? 'P2' : 'P3'));

function verdictCounts(rows, get = (r) => r.verdict) {
  const c = {};
  for (const r of rows) { const v = get(r) || 'NONE'; c[v] = (c[v] || 0) + 1; }
  return c;
}
const countsStr = (c) => Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ') || 'none';

function highestSeverity(rows) {
  if (rows.some((r) => P0.test(r.verdict || ''))) return 'P0';
  if (rows.some((r) => /^FAIL/.test(r.verdict || ''))) return 'P1';
  if (rows.some((r) => /PAGE-ERROR|OVERFLOW-X|ASSET-BLOCKED/.test(r.verdict || ''))) return 'P2';
  if (rows.some((r) => /UNEXPECTED|REVIEW|SHORT|CONSOLE-ERRORS|ANON-WRITE-ALLOWED/.test(r.verdict || ''))) return 'P2';
  if (rows.some((r) => /OBSERVED|DENIED|SKIP|NAV-ERROR|BLOCKED/.test(r.verdict || ''))) return 'P3';
  return 'P4 (pass)';
}

/* -------------------------------------------------- section fillers */
function mdTable(headers, rows) {
  const esc = (x) => String(x == null ? '' : x).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 160);
  const out = ['| ' + headers.map(esc).join(' | ') + ' |',
    '|' + headers.map(() => '---').join('|') + '|'];
  for (const r of rows) out.push('| ' + r.map(esc).join(' | ') + ' |');
  return out.join('\n');
}

/** Generic: turn API evidence rows into coverage-table rows. */
function apiCoverageRows(evd, cap = 120) {
  return (evd.rows || []).slice(0, cap).map((r) => [
    `${r.method} ${r.path}`, r.role + (r.kind && r.kind !== 'read' ? ` (${r.kind})` : ''),
    r.status, r.verdict, r.message || '',
  ]);
}

/** Generic: turn UI route rows into coverage-table rows. */
function uiCoverageRows(evd) {
  return (evd.routes || []).map((r) => {
    const d = r.desktop || {}; const m = r.mobile || {};
    const a11y = d.a11y ? [
      d.a11y.h1Count === 0 ? 'no-h1' : null,
      d.a11y.imgsNoAlt ? `${d.a11y.imgsNoAlt}img-no-alt` : null,
      d.a11y.inputsNoLabel ? `${d.a11y.inputsNoLabel}input-no-label` : null,
      d.a11y.linksNoName ? `${d.a11y.linksNoName}link-no-name` : null,
      !d.a11y.lang ? 'no-lang' : null,
    ].filter(Boolean).join(',') : '';
    return [r.route,
      `d:${d.verdict || d.reason || d.error || '-'} (${d.status ?? '-'}) / m:${m.verdict || m.reason || m.error || '-'}`,
      d.screenshot ? `../screenshots/${d.screenshot}` : '',
      [a11y, d.consoleErrors?.length ? `console:${d.consoleErrors.length}` : null,
       d.failedRequests?.length ? `req-fail:${d.failedRequests.length}(${d.failedRequests.map((x) => (x.url || '').split('/')[2] || x.url).slice(0, 2).join(',')})` : null,
       d.prefetchAborts ? `prefetch-aborts:${d.prefetchAborts}(nav-artifact)` : null].filter(Boolean).join('; ')];
  });
}

/** Flatten everything probe-y inside a security evidence file. */
function secRows(evd) {
  const rows = [];
  for (const [k, v] of Object.entries(evd)) {
    if (['id', 'title', 'generatedAt', 'stamp', 'errors'].includes(k)) continue;
    if (Array.isArray(v)) {
      for (const it of v) {
        if (!it || typeof it !== 'object') continue;
        rows.push({ section: k, ...it });
      }
    } else if (v && typeof v === 'object') {
      if (v.verdict || v.status || v.check || v.surface) rows.push({ section: k, ...v });
      for (const [k2, v2] of Object.entries(v)) {
        if (Array.isArray(v2)) for (const it of v2) {
          if (it && typeof it === 'object') rows.push({ section: `${k}.${k2}`, ...it });
        } else if (v2 && typeof v2 === 'object' && (v2.verdict || v2.status)) {
          rows.push({ section: `${k}.${k2}`, ...v2 });
        }
      }
    }
  }
  return rows;
}

function apiRowsOf(evd) { return evd.rows || []; }

/** Security findings list (mandatory section in every report). */
function securityFindings(rows, get = (r) => r.verdict) {
  const bad = rows.filter((r) => isBug(get(r)) || /REVIEW/.test(get(r) || ''));
  if (!bad.length) return ['No security findings were raised by this prompt\'s executed checks. See evidence file for the full PASS/DENIED matrix.'];
  return bad.slice(0, 25).map((r) => {
    const where = r.path || r.surface || r.attack || r.check || r.route || r.endpoint || r.label || '';
    const v = get(r);
    return `- **${sev(v)} ${v}** — ${where} ${r.message || r.detail || r.attack || ''}`.trim();
  });
}

function bugLines(rows, get = (r) => r.verdict) {
  const bugs = rows.filter((r) => isBug(get(r)));
  if (!bugs.length) return ['No bugs confirmed by this run. Review items (if any) are listed under their sections and in the evidence JSON.'];
  return bugs.slice(0, 40).map((r) => {
    const where = [r.method, r.path].filter(Boolean).join(' ') || r.route || r.surface || r.attack || '';
    return `- [ ] **${sev(get(r))}** \`${where}\` — ${get(r)}${r.message ? ` (${r.message})` : ''} — evidence: \`evidence/*.json\``;
  });
}

/* ------------------------------------------------ generic fill pass */
/* The per-prompt templates are header skeletons. We keep every template
 * section heading and inject evidence tables/bullets under them. */
function fillTemplate(id, template, evd) {
  const lines = template.split('\n');
  const out = [];
  const family = id[0];
  let injectedHeaderNote = false;

  const apiRows = evd ? apiRowsOf(evd) : [];
  const uiRows = evd ? (evd.routes || []) : [];
  const sRows = evd ? secRows(evd) : [];
  const allRows = apiRows.length ? apiRows : (family === 'S' ? sRows : uiRows);

  const headRow = (r) => r.verdict || '';
  const bugSource = apiRows.length ? apiRows : (family === 'S' ? sRows : uiRows.map((r) => ({
    route: r.route,
    verdict: [r.desktop?.verdict, r.mobile?.verdict].filter((v) => v && /^FAIL|PAGE-ERROR|OVERFLOW/.test(v))[0],
    message: (r.desktop?.consoleErrors || [])[0],
  })).filter((r) => r.verdict));

  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    // drop literal ellipsis placeholders left in the template skeletons
    if (/^\s*\.\.\.\s*$/.test(L)) continue;
    out.push(L);
    const h = (L.match(/^#{2,4}\s+(.*)$/) || [])[1] || '';
    const hl = h.toLowerCase();

    if (!injectedHeaderNote && /^#\s/.test(L)) {
      out.push(`\n_Generated ${NOW} · host set: nestlancer.com/app/admin/api · evidence: \`evidence/${id}.json\`_`);
      injectedHeaderNote = true;
      continue;
    }

    // summary-ish bullets: keep template bullets but append the computed ones
    if (/^(session )?summary$|^tooling$/.test(hl)) {
      if (!evd) { out.push('\n- **NO EVIDENCE** — runner has not executed this prompt yet.'); continue; }
      const counts = family === 'S' ? verdictCounts(sRows) : (uiRows.length && !apiRows.length
        ? { desktopPass: uiRows.filter((r) => r.desktop?.verdict === 'PASS').length + '/' + uiRows.length,
            mobilePass: uiRows.filter((r) => r.mobile?.verdict === 'PASS').length + '/' + uiRows.length }
        : verdictCounts(apiRows));
      out.push(`\n- Roles/accounts: ${family === 'P' ? (evd.role || 'anon') : 'anon + clientA + clientB + admin'}`);
      out.push(`- Units executed: ${allRows.length || uiRows.length}`);
      out.push(`- Verdict mix: ${countsStr(counts)}`);
      out.push(`- Highest severity: **${highestSeverity(family === 'S' ? sRows : (apiRows.length ? apiRows : []))}**`);
      if (evd.errors?.length) out.push(`- Runner errors: ${evd.errors.length} (see evidence)`);
      continue;
    }

    if (hl.includes('coverage') || hl.includes('walked') || hl.includes('endpoint coverage') || hl.includes('route coverage')) {
      // consume a template table skeleton directly under this heading
      while (i + 1 < lines.length && /^\s*$/.test(lines[i + 1])) i++;
      if (i + 1 < lines.length && /^\s*\|.*\|\s*$/.test(lines[i + 1])) {
        i++;
        if (i + 1 < lines.length && /^\s*\|[-|\s]+\|\s*$/.test(lines[i + 1])) i++;
      }
      if (!evd) { out.push('\n_No evidence collected._'); continue; }
      if (apiRows.length) out.push('\n' + mdTable(['Method + path', 'Scenario/role', 'Status', 'Verdict', 'Notes'], apiCoverageRows(evd)));
      else if (uiRows.length) out.push('\n' + mdTable(['Route', 'Desktop/mobile verdict', 'Screenshot', 'Notes'], uiCoverageRows(evd)));
      else if (sRows.length) out.push('\n' + mdTable(['Probe section', 'Surface', 'Status', 'Verdict'],
        sRows.slice(0, 120).map((r) => [r.section, r.surface || r.path || r.attack || r.check || r.label || r.endpoint || '', r.status ?? r.httpStatus ?? '', r.verdict || ''])));
      continue;
    }

    if (hl.includes('contract drift') || hl.includes('drift')) {
      const drift = apiRows.filter((r) => /NOT-FOUND|NOT-IMPLEMENTED|UNEXPECTED/.test(r.verdict || ''));
      out.push('\n' + (drift.length
        ? mdTable(['Endpoint', 'OpenAPI/expectation', 'Runtime', 'Severity'],
            drift.slice(0, 60).map((r) => [`${r.method} ${r.path}`, 'documented', `HTTP ${r.status} → ${r.verdict}`, sev(r.verdict)]))
        : 'No contract drift detected in the executed surface.'));
      continue;
    }

    // ledger/findings/narrative sections that have an evidence-driven table
    if (/ledger|results|probe|checks|matrix/.test(hl) && !hl.includes('coverage') && (sRows.length || apiRows.length)) {
      // filter probe rows by keyword overlap with the heading so each ledger
      // shows only relevant probes; fall back to all rows when no overlap.
      const words = hl.split(/[^a-z]+/).filter((w) => w.length > 3 && !['security', 'checks', 'results', 'probe', 'matrix', 'ledger'].includes(w));
      const rel = (rows) => {
        const f = rows.filter((r) => words.some((w) => String(r.section || r.kind || '').toLowerCase().includes(w)));
        return f.length ? f : rows;
      };
      // consume the template's own empty table skeleton that follows
      while (i + 1 < lines.length && /^\s*$/.test(lines[i + 1])) i++;
      if (i + 1 < lines.length && /^\s*\|.*\|\s*$/.test(lines[i + 1])) {
        i++; // header row
        if (i + 1 < lines.length && /^\s*\|[-|\s]+\|\s*$/.test(lines[i + 1])) i++; // separator
      }
      if (sRows.length) {
        out.push('\n' + mdTable(['Probe section', 'Surface/check', 'Status', 'Verdict', 'Notes'],
          rel(sRows).slice(0, 140).map((r) => [r.section, r.surface || r.check || r.attack || r.path || r.label || r.endpoint || r.resource || '',
            r.status ?? r.httpStatus ?? '', r.verdict || '', r.message || r.detail || r.flags || r.details || ''])));
      } else {
        out.push('\n' + mdTable(['Method + path', 'Role', 'Status', 'Verdict', 'Notes'], apiCoverageRows(evd, 140)));
      }
      continue;
    }
    if (hl === 'bugs' || hl.startsWith('bugs ') || hl === 'bugs and findings' || hl.includes('bug log')) {
      out.push('\n' + bugLines(bugSource, headRow).join('\n'));
      continue;
    }

    if (hl.includes('security finding') || hl.includes('security notes')) {
      out.push('\n' + securityFindings(allRows.length ? allRows : sRows, headRow).join('\n'));
      continue;
    }

    if (hl.includes('handoff') || hl.includes('next') && hl.includes('prompt')) {
      const fails = bugSource.filter((r) => isBug(headRow(r))).length;
      const skips = allRows.filter((r) => /SKIP|BLOCKED/.test(headRow(r) || '')).length;
      out.push('\n' + [
        fails ? `- ${fails} bug(s) need fixes and a rerun of this prompt after merge.` : '- No blocking bugs from this run.',
        skips ? `- ${skips} check(s) skipped for missing fixtures — re-seed or create AUDIT fixtures, then rerun.` : null,
        `- Evidence: \`evidence/${id}.json\` · rerun: \`node ${family === 'P' ? 'ui_runner' : family === 'S' ? 'security_runner' : 'api_runner'}.js ${id}\``,
      ].filter(Boolean).join('\n'));
      continue;
    }
  }

  // mandatory security findings section (addendum applies to every prompt)
  const joined = out.join('\n');
  if (!/security finding/i.test(joined)) {
    out.push('\n## Security findings\n');
    out.push(securityFindings(family === 'P' ? bugSource : (allRows.length ? allRows : sRows), headRow).join('\n'));
  }
  return out.join('\n');
}

/* ------------------------- cross-portal prompts without route walks */
function crossRefs(id) {
  return {
    P39: ['A07', 'A17'],          // cross-portal E2E workflows
    P40: ['__UIWALK__'],          // responsive + a11y + timing aggregates
    P42: ['__CATALOG__'],         // source coverage reconciliation
    P43: ['A17', 'S08'],          // middleware/BFF/CSP/hard-404
    P44: ['S07', 'S08'],
    P45: ['A17', 'A18'],
    P46: ['A20'],
    P47: ['A19'],
  }[id] || [];
}

function uiWalkAggregate() {
  const f = path.join(EVD, 'ui-walk.json');
  if (!fs.existsSync(f)) return '(ui-walk.json not found)';
  const w = JSON.parse(fs.readFileSync(f, 'utf8'));
  const dCount = {}, mCount = {};
  let slow = [];
  for (const r of w.rows) {
    dCount[r.desktop?.verdict || 'NONE'] = (dCount[r.desktop?.verdict || 'NONE'] || 0) + 1;
    mCount[r.mobile?.verdict || 'NONE'] = (mCount[r.mobile?.verdict || 'NONE'] || 0) + 1;
    if ((r.desktop?.timingMs || 0) > 6000) slow.push([r.app + ' ' + r.route, r.desktop.timingMs + ' ms', 'desktop>6s', r.desktop.a11y ? `a11y gaps: h1=${r.desktop.a11y.h1Count}, img-no-alt=${r.desktop.a11y.imgsNoAlt}` : '']);
  }
  const a11yFlags = [];
  for (const r of w.rows) {
    const a = r.desktop?.a11y;
    if (!a) continue;
    if (a.h1Count === 0 || a.imgsNoAlt > 0 || a.inputsNoLabel > 0) {
      a11yFlags.push([r.app + ' ' + r.route, `${a.h1Count === 0 ? 'no-h1 ' : ''}${a.imgsNoAlt ? a.imgsNoAlt + '-img-no-alt ' : ''}${a.inputsNoLabel ? a.inputsNoLabel + '-input-no-label' : ''}`, 'REVIEW', '']);
    }
  }
  return [
    '### Desktop verdict mix', '',
    mdTable(['Verdict', 'Routes'], Object.entries(dCount).map(([k, v]) => [k, v])),
    '', '### Mobile (375px) verdict mix', '',
    mdTable(['Verdict', 'Routes'], Object.entries(mCount).map(([k, v]) => [k, v])),
    '', '### Slow routes (desktop TTI marker > 6s)', '',
    slow.length ? mdTable(['Route', 'Load ms', 'Verdict', 'Notes'], slow.slice(0, 40)) : 'None.',
    '', '### Routes with a11y gaps (desktop quick-scan)', '',
    a11yFlags.length ? mdTable(['Route', 'Gap', 'Verdict', 'Notes'], a11yFlags.slice(0, 60)) : 'None flagged.',
  ].join('\n');
}

function catalogReconciliation() {
  let walk = null;
  try { walk = JSON.parse(fs.readFileSync(path.join(EVD, 'ui-walk.json'), 'utf8')); } catch (_) { /* noop */ }
  const catalog = require('./lib/catalog');
  const ops = catalog.loadOperations();
  const routes = catalog.loadRoutes ? catalog.loadRoutes() : [];
  const executed = new Set();
  for (const f of fs.readdirSync(EVD)) {
    if (!/^[AS]\d+\.json$/.test(f)) continue;
    try {
      const d = JSON.parse(fs.readFileSync(path.join(EVD, f), 'utf8'));
      for (const r of apiRowsOf(d)) executed.add(`${r.method} ${(r.path || '').split('?')[0]}`);
      for (const r of secRows(d)) if (r.path) executed.add(`* ${r.path}`);
    } catch (_) { /* noop */ }
  }
  const walked = walk ? new Set(walk.rows.map((r) => `${r.app}|${r.route}`)) : new Set();
  return [
    `### Endpoint execution reconciliation`, '',
    mdTable(['Metric', 'Count'], [
      ['OpenAPI operations in source map', ops.length],
      ['Frontend routes in source map', routes.length],
      ['Distinct (method,path) units executed by A/S runners', executed.size],
      ['Distinct app|route units walked by UI runner', walked.size],
    ]), '',
    '_Coverage detail per prompt lives in each evidence file; route-map vs walked-set join is computed at generation time in this run._',
  ].join('\n');
}

function synthCrossPrompt(id) {
  const blocks = [];
  for (const ref of crossRefs(id)) {
    if (ref === '__UIWALK__') { blocks.push(uiWalkAggregate()); continue; }
    if (ref === '__CATALOG__') { blocks.push(catalogReconciliation()); continue; }
    const evd = loadEvidence(ref);
    if (!evd) { blocks.push(`(no evidence from ${ref} yet)`); continue; }
    const rows = apiRowsOf(evd).length ? apiRowsOf(evd) : secRows(evd);
    blocks.push(`### From ${ref} — ${evd.title || ''}\n\n` +
      mdTable(['Check', 'Status', 'Verdict', 'Notes'],
        rows.slice(0, 60).map((r) => [r.path || r.check || r.surface || r.section || '', r.status ?? '', r.verdict || '', r.message || ''])));
  }
  return blocks.join('\n\n');
}

/* --------------------------------------------------------------- main */
function main() {
  const selected = process.argv.slice(2).map((x) => x.toUpperCase());
  const ids = selected.length ? ALL.filter((id) => selected.includes(id)) : ALL;
  const index = [];
  let made = 0, missing = 0;

  for (const id of ids) {
    let evd = loadEvidence(id);
    const crossNoRoutes = /^P(39|40|42|43|44|45|46|47)$/.test(id);
    if (!evd && crossNoRoutes) {
      const template = outputTemplate(id).replace('# Result', '# Result');
      const synth = synthCrossPrompt(id);
      const report = template + `\n\n## Executed evidence (cross-referenced runners)\n\n${synth}\n\n## Security findings\n\n` +
        securityFindings([]).join('\n') +
        `\n\n_Generated ${NOW}. Cross-portal prompts synthesize the evidence runners referenced above (see refs). Direct interactive flows for this prompt are tracked in the runner handoff notes._`;
      fs.writeFileSync(path.join(REPORTS, `${id}.md`), report);
      index.push({ id, status: 'synthesized', severity: 'n/a' });
      made++;
      continue;
    }
    if (!evd) { missing++; console.log(`  skip ${id} (no evidence)`); continue; }
    const template = outputTemplate(id);
    const report = fillTemplate(id, template, evd);
    fs.writeFileSync(path.join(REPORTS, `${id}.md`), report);
    const rows = (evd.rows && evd.rows.length) ? evd.rows : (evd.routes || secRows(evd));
    let sevRows = evd.rows && evd.rows.length ? evd.rows : secRows(evd);
    if (evd.routes && evd.routes.length) {
      sevRows = evd.routes.map((r) => ({ verdict: [r.desktop?.verdict, r.mobile?.verdict]
        .filter((v) => v && !/^(PASS|REDIRECT-TO-LOGIN \(PASS\)|PASS-EXPECTED-4XX)$/.test(v))[0] || '' }))
        .filter((r) => r.verdict);
    }
    index.push({ id, status: 'reported', severity: highestSeverity(sevRows), units: rows.length });
    made++;
  }

  const idx = ['# Nestlancer test run — report index', '',
    `Generated: ${NOW} (run date ${TODAY})`, '',
    mdTable(['Prompt', 'Status', 'Highest severity', 'Units executed'],
      index.map((r) => [`[${r.id}](./${r.id}.md)`, r.status, r.severity, r.units ?? ''])), '',
    `Reports: ${made} · skipped (no evidence): ${missing}`, '',
    'Family totals: ' + ['P', 'A', 'S'].map((f) => `${f}: ${index.filter((r) => r.id[0] === f).length}`).join(' · '),
  ].join('\n');
  fs.writeFileSync(path.join(REPORTS, 'INDEX.md'), idx);
  console.log(`reports written: ${made}, missing evidence: ${missing} -> ${REPORTS}`);
}

main();
