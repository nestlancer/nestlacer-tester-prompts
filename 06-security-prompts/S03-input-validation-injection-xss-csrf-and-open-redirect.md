# S03 — Input validation, injection, XSS, CSRF and open redirect testing

**Priority:** P0  
**Role:** Application security tester  
**Scope:** All user-controlled input across public, client, admin, API and generated-output surfaces.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Pair with existing prompts

- P01, P02, P06, P07, P13, P14, P21, P22, P24, P33, P34, P35, P36, P37, P43, P44, P47
- A03, A04, A07, A08, A10, A13, A15, A17, A18

## Mandatory checks

1. Enumerate every text/search/filter/body/path/query field in the target prompt.
2. Test safe, non-destructive malicious-looking values in demo records: HTML tags, script-like text, event-handler-like attributes, Markdown links/images, template expressions, SQL-like text, path traversal strings, very long strings, Unicode confusables and invalid enum values.
3. Verify stored content renders encoded/sanitized in lists, detail pages, emails, PDFs, notifications, messages, comments and exports.
4. Verify reflected query/search errors do not execute or break layout.
5. Verify rich text/editor fields restrict unsafe HTML, URLs and embedded content.
6. Verify CSRF/origin protection for mutating BFF/API routes: login/logout, profile changes, password/session changes, requests/quotes/projects, payments, media, notifications, templates and system operations.
7. Verify redirect parameters (`from`, callback URLs, landing-to-web redirects, document/share links) cannot become open redirects to untrusted domains.
8. Verify malformed request bodies return 400/422 with safe error envelopes, not 500 stack traces.
9. Verify CSP blocks inline/script injection and console shows no CSP bypass during normal flows.

## Safe payload rule

Use inert marker strings that prove encoding/sanitization without attempting credential theft, persistence beyond demo records, or executing harmful code. Do not deploy real exploit kits or external exfiltration URLs.

## Output

```markdown
# Result — S03 Input validation/injection/XSS/CSRF/open redirect

## Input ledger
| Surface | Field | Test value class | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|---|---|

## Rendering/output contexts
| Source field | Rendered in | Encoded/sanitized? | Verdict | Evidence |
|---|---|---|---|---|

## Findings
...
```
