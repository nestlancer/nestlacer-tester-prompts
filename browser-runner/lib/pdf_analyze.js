/**
 * Shared PDF professional-integrity helper for browser-runner scripts.
 * Always resolves pdf_integrity.py next to this package (not a hardcoded Music path).
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RUNNER_ROOT = path.join(__dirname, '..');
const PDF_INTEGRITY_PY = path.join(RUNNER_ROOT, 'pdf_integrity.py');

function parseJsonWithWarnings(out) {
  const s = String(out || '').trim();
  const firstArr = s.indexOf('[');
  const firstObj = s.indexOf('{');
  const starts = [firstArr, firstObj].filter((i) => i >= 0).sort((a, b) => a - b);
  if (!starts.length) {
    throw new Error('No JSON found in pdf_integrity helper output: ' + s.slice(0, 200));
  }
  return JSON.parse(s.slice(starts[0]));
}

/**
 * @param {string[]} pdfPaths absolute paths to downloaded PDFs
 * @param {{ extractVerifyUrls?: boolean }} [opts]
 * @returns {{ analysis: any[], rawVerifyUrls: string[] }}
 */
function analyzePdfs(pdfPaths, opts = {}) {
  const extractVerifyUrls = opts.extractVerifyUrls !== false;
  if (!pdfPaths.length) return { analysis: [], rawVerifyUrls: [] };
  if (!fs.existsSync(PDF_INTEGRITY_PY)) {
    throw new Error(`pdf_integrity.py missing at ${PDF_INTEGRITY_PY}`);
  }
  const analysis = parseJsonWithWarnings(
    execFileSync('python3', [PDF_INTEGRITY_PY, ...pdfPaths], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })
  );
  let rawVerifyUrls = [];
  if (extractVerifyUrls) {
    const py = `
import sys, re, json, warnings
warnings.filterwarnings('ignore')
import fitz
urls=[]
for f in sys.argv[1:]:
  d=fitz.open(f)
  txt='\\n'.join([p.get_text() for p in d])
  urls += [m.group(0).rstrip('.,;)') for m in re.finditer(r'https://app\\.nestlancer\\.com/verify-document\\?[^\\s]+', txt)]
print(json.dumps(list(dict.fromkeys(urls))))
`.trim();
    rawVerifyUrls = parseJsonWithWarnings(execFileSync('python3', ['-c', py, ...pdfPaths], { encoding: 'utf8' }));
  }
  return { analysis, rawVerifyUrls };
}

/**
 * Map integrity results into runner bug records.
 * Overlap FAILs (payment history / stacked rows) escalate to P1.
 */
function integrityBugsFromAnalysis(analysis, { bugId = 'NL-BUG-PDF-LAYOUT-1', titlePrefix = 'Generated PDF' } = {}) {
  const warnings = [];
  const fails = [];
  for (const a of analysis || []) {
    const pi = a.professional_integrity || {};
    const docLabel = `${a.filename || 'pdf'} (${a.doc_type || 'unknown'})`;
    for (const issue of pi.issues || []) {
      fails.push({ file: a.filename, docType: a.doc_type, severity: 'P1', issue, sections: a.sections_detected });
    }
    for (const warn of pi.warnings || []) {
      warnings.push({ file: a.filename, docType: a.doc_type, severity: 'P2', issue: warn, sections: a.sections_detected });
    }
    const summary = a.overlap_summary || {};
    if ((summary.fail_overlaps || 0) > 0 || (summary.row_collision_pages || []).length) {
      // Ensure explicit payment-history-class note even if issues already listed
      const already = (pi.issues || []).some((x) => /overlap|payment histor|row collision|concatenat/i.test(x));
      if (!already) {
        fails.push({
          file: a.filename,
          docType: a.doc_type,
          severity: 'P1',
          issue: `${docLabel}: overlapping/stacked content detected (fail_pages=${(summary.fail_pages || []).join(',') || '-'})`,
          sections: a.sections_detected,
        });
      }
    }
  }
  const bugs = [];
  if (fails.length) {
    bugs.push({
      id: bugId,
      severity: 'P1',
      title: `${titlePrefix} layout FAIL — overlapping/stacked text (incl. payment history / tables)`,
      evidence: 'pdf_integrity_analysis.json',
      details: fails,
    });
  }
  if (warnings.length) {
    bugs.push({
      id: bugId.replace(/-1$/, '-WARN-1'),
      severity: 'P2',
      title: `${titlePrefix} professional-integrity warnings`,
      evidence: 'pdf_integrity_analysis.json',
      details: warnings,
    });
  }
  return bugs;
}

function markdownIntegrityTable(analysis, redactFn = (s) => s) {
  if (!(analysis || []).length) return '| - | - | - | - | - | - |\n';
  return analysis
    .map((a) => {
      const pi = a.professional_integrity || {};
      const msgs = (pi.issues || []).concat(pi.warnings || []).map(redactFn).join('<br>') || 'No warnings';
      const sections = (a.sections_detected || []).join(', ') || '-';
      return `| ${a.filename} | ${a.doc_type || '-'} | ${a.page_count} | ${a.bytes} | ${pi.status} | ${sections} | ${msgs} |`;
    })
    .join('\n');
}

module.exports = {
  PDF_INTEGRITY_PY,
  analyzePdfs,
  integrityBugsFromAnalysis,
  markdownIntegrityTable,
  parseJsonWithWarnings,
};
