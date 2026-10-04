# S05 — File upload, media, document and export security

**Priority:** P0  
**Role:** File/document security auditor  
**Scope:** Uploads, private media, generated PDFs, public shares, exports and downloads.

## Pair with existing prompts

- P10, P11, P16, P32, P35, P39, P44, P46, P47
- A09, A11, A16, A18, A19, A20

## Mandatory checks

1. Upload allowed demo files and verify scan/processing/metadata/thumbnail states.
2. Try disallowed or risky demo samples: SVG/scriptable content, MIME spoofing, double extension, path traversal filename, very long filename, oversized file, empty file and unsupported type.
3. Verify private media cannot be opened by another client, project member without permission, anonymous user or guessed URL.
4. Verify public share token access works only for intended file and revocation immediately blocks access.
5. Verify unsafe files are forced to download and not rendered inline.
6. Verify generated PDFs for quotes/invoices/receipts contain only expected data and no internal enums/secrets/debug payloads.
7. Verify exports honor filters, role scope, row limits, expiration and download permissions.
8. Verify object storage and DB stay paired after delete/replace/quarantine/reprocess.
9. Verify document/share/verification tokens cannot be guessed, tampered or reused after revocation/expiry.
10. Verify media/document worker retries do not duplicate documents/files or leave multiple latest invoice/receipt records.

## Output

```markdown
# Result — S05 File/media/document/export security

## File safety ledger
| Test | File/type | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|---|

## Access-control ledger
| Artifact | Owner | Attacker role | Expected | Actual | Verdict |
|---|---|---|---|---|---|

## Findings
...
```
