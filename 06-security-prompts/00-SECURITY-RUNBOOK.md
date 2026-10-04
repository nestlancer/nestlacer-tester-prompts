# Security Runbook — Authorized defensive testing only

**Purpose:** Add practical application-security and abuse-resistance coverage to every verified prompt. The goal is to find and fix vulnerabilities in the authorized Nestlancer demo/production-like environment without harming real users, data, money, providers or infrastructure.

## Authorization and safety boundaries

- Test only systems, domains, accounts, APIs and data explicitly owned/approved for this audit.
- Use demo/audit records only. Prefix new test records with `SEC-AUDIT-<PROMPT-ID>-<YYYYMMDD>-<n>`.
- Do not attack third-party providers, real payment rails, real email/SMS/push audiences, real customer records or non-demo webhook targets.
- Do not persist malware, credential stealers, destructive payloads, cryptominers, worms or self-propagating content.
- Do not run denial-of-service or high-volume fuzzing against production-like systems unless a rate/traffic window is explicitly approved.
- Redact secrets, tokens, cookies, OTPs, reset links, signed URLs, private media URLs, payment credentials and PII values in all evidence.
- Stop immediately and escalate P0 if you find auth bypass, cross-user data access, token leakage, payment duplication, unsigned webhook acceptance, unsafe webhook target acceptance, stored XSS, privilege escalation, or destructive action without audit attribution.

## Required evidence standard

For each security finding capture:

- Route/API endpoint, role, account type and fixture used.
- Request ID/correlation ID, timestamp and environment.
- Browser/network/API evidence with sensitive values redacted.
- Impact, reproducibility, affected roles/data, and whether the issue is exploitable by anonymous/client/admin users.
- Expected secure behavior and actual behavior.
- Severity: P0 critical, P1 high, P2 medium, P3 low, INFO hardening.
- Suggested fix and regression test to add.

## Universal security checklist for every prompt

Run this checklist while executing any `P##`, `A##` or `S##` prompt:

1. **Authentication and session safety**
   - Unauthenticated users cannot access protected pages/API data.
   - Expired, malformed, replayed, stale and wrong-portal sessions fail safely.
   - Logout, refresh, 2FA, password reset, impersonation and session revoke clear/rotate cookies/tokens correctly.
   - Tokens are never placed in URLs, logs, localStorage, debug panels or browser console output.

2. **Authorization and object isolation**
   - A client cannot read/update/delete another client’s requests, quotes, projects, payments, invoices, messages, media or profile.
   - Admin-only endpoints reject client users.
   - Lower-privilege operators cannot perform high-risk admin actions unless role policy allows it.
   - Impersonation always records original operator and target user, and cannot exceed operator permissions.

3. **Input validation and injection resistance**
   - Text/search/filter/query/path/body/file fields reject or safely encode malicious HTML/JS, SQL-like strings, template syntax, Markdown/HTML, path traversal, command-like strings, oversized values and invalid enums.
   - Rich text, blog/comment/message/notification/template/content fields are sanitized both on storage and rendering.
   - Error messages do not leak stack traces, SQL, Prisma details, provider secrets or internal network names.

4. **CSRF, clickjacking, CORS and browser controls**
   - Mutating routes require appropriate CSRF/origin/same-site protections.
   - CORS only allows approved origins and does not expose credentials to arbitrary origins.
   - Security headers are present where expected: CSP, frame protections, MIME sniffing protection, referrer policy and HSTS where applicable.
   - CSP nonce survives redirects, rewrites and hard 404s.

5. **File, media and document safety**
   - SVG/scriptable content, MIME spoofing, path traversal names and oversized uploads are rejected or forced to safe download.
   - Private media/documents/exports require authorization and cannot be guessed through IDs/tokens.
   - Generated PDFs/emails/exports do not contain internal enums, secrets, debug payloads or another user’s data.

6. **Payments, webhooks and business-logic abuse**
   - Payment amounts/currency/order IDs/signatures cannot be tampered.
   - Webhooks require valid signatures, idempotency and replay protection.
   - Refund/dispute/manual/offline flows cannot create duplicate ledger entries or bypass state machines.
   - Admin/manual operations require audit logs and cannot affect non-demo records during testing.

7. **Rate limiting and abuse resistance**
   - Login, OTP, password reset, email verification, contact forms, comments, uploads, notifications, checkout, webhooks and search endpoints enforce practical throttles.
   - Repeated failures do not reveal user enumeration or create resource exhaustion.

8. **Observability without leakage**
   - Request IDs exist for support.
   - Logs/debug panels redact secrets and PII.
   - Audit logs capture security-sensitive mutations and impersonation.

9. **AI-era/content-abuse safety**
   - Treat user-generated content, Markdown, HTML, uploaded documents, webhook payloads, template variables and notification content as hostile instructions/data.
   - If any AI/LLM assistant, summarizer, classifier or auto-responder exists now or later, verify prompt-injection resistance, tool/action authorization, output encoding and no secret disclosure through model output.

## Output template for security findings

```markdown
## Security findings
| ID | Severity | Surface | Role | Impact | Evidence | Fix/regression |
|---|---|---|---|---|---|---|

## Security checks passed
| Area | Sample tested | Verdict | Evidence |
|---|---|---|---|

## Blocked security checks
| Check | Why blocked | Required access/fixture |
|---|---|---|
```
