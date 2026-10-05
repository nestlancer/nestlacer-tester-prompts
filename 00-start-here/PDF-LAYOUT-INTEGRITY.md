## Generated PDF layout integrity (mandatory)

Apply this checklist to **every** downloaded/generated PDF from client **and** admin accounts (quotes, contracts/agreements, invoices, receipts, payment documents, and future templates). Do not treat layout defects as cosmetic.

### Known defect class (must catch carefully)

Overlapping / stacked text in dense sections — especially **Payment History** (and Transaction History) on invoices — where rows, amounts, document numbers, or footers print on top of each other. The **same class of bug can appear** in line-item tables, payment schedules, tax summaries, quote schedules, receipts, and contracts. Re-check any new or regenerated PDF template the same way.

### Required checks (visual + `browser-runner/pdf_integrity.py`)

1. Download non-empty PDFs from both **client** and **admin** surfaces when both exist; compare content consistency.
2. Run `python3 browser-runner/pdf_integrity.py <pdf...>` (or the runner’s shared `lib/pdf_analyze.js` helper). Record `professional_integrity.status`, `sections_detected`, `overlap_summary`, and samples.
3. **FAIL / P1** (not soft warn) when any of these are true:
   - Overlapping or same-origin stacked text in payment history / transaction history / line items / payment schedule / tax or billing summary sections
   - Dense-section row collisions (overprinted table rows)
   - Concatenated document numbers (e.g. `NL-RCPT-…NL-INV-…`) or smashed currency amounts (`₹750.00₹750.00`)
   - Text overflowing page bounds
4. Also verify: page numbering, continuation header/footer branding, no internal enums/secrets/debug payloads, verify URL present where expected, legal/tax fields blank-when-unset (not placeholders).
5. Open the PDF pages (or rendered page snapshots) and **manually confirm** history/table regions are readable — automated heuristics can miss subtle overlaps; human review is required for invoice payment history and similar tables.
6. File bugs under `NL-BUG-PDF-LAYOUT-*` / prompt-specific DOCS ids with page number, section name, and redacted text samples.

### Evidence

- Saved PDF bytes + `pdf_integrity_analysis.json`
- Page sample screenshots or extracted text samples for any FAIL/WARN
- Client vs admin download parity note when both paths exist
