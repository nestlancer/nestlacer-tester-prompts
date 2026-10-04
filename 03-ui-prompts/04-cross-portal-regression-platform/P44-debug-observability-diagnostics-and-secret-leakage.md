# P44 — Debug panels, diagnostics, telemetry and secret/PII leakage sweep

**Priority:** P0  
**Primary role:** Security-minded QA / observability auditor  
**Scope:** Admin debug JSON sections, health diagnostics, frontend telemetry, console logging and error envelopes.

## 0. Demo-production mode for this prompt

This prompt is read-heavy. You may execute low-risk demo actions only when needed to generate logs, telemetry, audit rows or error envelopes. Do not create broad broadcasts, real payments or real external webhook calls.

## 1. Source-code anchors to read first

- `apps/admin/src/components/admin/AdminDataViews.tsx` (`DebugApiSection`)
- Admin clients importing `DebugApiSection`: dashboard, analytics, audit, contact, integrations, moderation, payments, projects, quotes, requests, system, users.
- `apps/admin/src/features/system/SystemClient.tsx` (`health-debug`, jobs, queues, templates, operations)
- `apps/admin/src/features/payments/payments-debug.ts`
- `apps/web/src/features/payments/payments-debug.ts`
- `apps/web/src/features/blog/blog-debug.ts`
- `apps/*/src/instrumentation.ts`
- `apps/*/src/lib/telemetry.ts`
- `packages/config/logger.mjs`
- `packages/api-client/src/errors.ts`
- Backend: `gateway/src/middleware/*`, `libs/common/src/interceptors/transform-response.interceptor.ts`, `libs/tracing/src/middleware/correlation-id.middleware.ts`, health/admin-debug controllers.
- `source-regression-markers-inventory.md`

## 2. Routes / surfaces to walk

- Admin dashboard `/dashboard`
- Admin `/analytics`
- Admin `/audit`
- Admin `/contact`
- Admin `/integrations`
- Admin `/moderation`
- Admin `/payments` and one payment detail
- Admin `/projects`
- Admin `/quotes`
- Admin `/requests`
- Admin `/system`, especially Health/Debug, Jobs/Queues, Templates and Operations tabs
- Admin `/users` and one user detail
- Web payments list/detail/checkout logs
- Web public blog detail interaction logs
- Auth failures and expired sessions in both web and admin

## 3. What this prompt must prove

- Raw JSON debug panels are hidden in production unless intentionally enabled by environment.
- When debug panels are enabled, they are collapsed by default, labeled as diagnostic, and do not reveal secrets, tokens, full cookies, passwords, OTPs, reset links, private URLs, webhook secrets, payment credentials or unnecessary PII.
- Health debug endpoints require admin/operator permission and redact environment variables/secrets.
- Console logs and telemetry debug output are gated so production users do not see noisy diagnostics or sensitive payloads.
- API error mapping prefers backend business/error codes and renders explicit empty/error states instead of blank chrome.
- Request/correlation IDs are shown or available for support without exposing credentials.
- Payment and Razorpay test-mode helpers never print full test card credentials in production builds.

## 4. Mandatory checks

1. In the production-like target, open each admin route listed above and search the rendered page for “Debug”, “Raw JSON”, “payload”, “token”, “password”, “secret”, “cookie”, “authorization”, “Razorpay key”, “privateUrl”.
2. If `NEXT_PUBLIC_DEBUG_API=true` is intentionally enabled in the environment, expand every visible debug panel and verify redaction. If it is not enabled, confirm panels are absent or hidden.
3. Open `/system` health/debug diagnostics. Verify role gating, response shape, queue/worker status, service health, and redaction. Capture failures as product-visible messages, not blank cards.
4. Trigger safe auth failures: wrong password, wrong portal, expired/invalid reset token, expired/stale session. Confirm inline errors, status codes and no user-enumeration oracle.
5. Trigger safe API errors on at least five route types: missing quote, missing project, invalid payment id, invalid request id, invalid media id. Confirm not-found/error UI and error envelope mapping.
6. Perform a low-risk demo payment checkout in test mode or mocked mode if available. Inspect console for test credential leakage. Confirm debug logs contain only masked IDs/amount/status.
7. Perform safe blog like/bookmark/comment/public interaction if fixtures allow. Verify debug logs do not expose JWTs or raw user records.
8. Use DevTools Console/Network filtering for `debug`, `telemetry`, `requestId`, `authorization`, `cookie`, `password`, `secret`, `otp`, `reset`.
9. Verify admin system jobs/queues and operations panels do not print connection strings, provider credentials, Redis URLs, S3 keys, SMTP keys, Infisical values or webhook signing secrets.
10. Confirm logs/error states include enough correlation data for operators to debug without revealing sensitive data.

## 5. Negative and abuse probes

- Append malformed IDs, unsupported enum query params and very long search strings to pages with debug panels.
- Toggle tabs while a failing request is in flight; verify old debug payloads do not remain attached to a different entity.
- Use a client/demo user token against admin diagnostics; expect 401/403 and no data.
- Start impersonation and inspect logs: attribution must include original operator/admin identity in audit views but not expose tokens.
- Force network offline/503 if browser tooling allows; verify loading/error components render without infinite retry storms.

## 6. Data and safety fences

- Redact screenshots or text for tokens, cookies, OTPs, reset URLs, email verification links, PII and provider secrets.
- Do not enable debug flags globally in a live environment without approval; if not enabled, record code-derived behavior plus runtime absence.
- Only use demo/audit users and records.

## 7. Required evidence

- Screenshot of one representative debug-hidden production page.
- Screenshot of a debug panel expanded only if the environment intentionally enables it, with sensitive values redacted in the report.
- Network rows for error-envelope cases.
- Console capture showing absence of secret logs after auth/payment/system checks.
- Table of any leaked field names or suspicious payload keys.

## 8. Defects this prompt is designed to catch

- Raw API payloads visible to production users.
- Health debug endpoint leaking env vars or credentials.
- Blank admin pages caused by error-envelope drift.
- Console logs exposing JWTs, cookies, Razorpay data, reset links or private media URLs.
- Payment totals displayed as zero after failed stats/API fetches.
- Missing request IDs that make production support impossible.

## 9. Output format

```markdown
# Result — P44 — Debug/observability/secret leakage sweep

## Summary
- Environment/debug flags:
- Routes inspected:
- Highest severity:

## Debug panel ledger
| Route | Debug visible? | Collapsed? | Sensitive fields found? | Verdict | Evidence |
|---|---|---|---|---|---|

## Error/diagnostic envelope ledger
| Scenario | Expected | Actual UI | Status/code | Request ID | Verdict |
|---|---|---|---|---|---|

## Leakage findings
| Surface | Leaked/suspicious value type | Severity | Evidence | Recommended fix |
|---|---|---|---|---|

## Blocked checks
...
```

## Security addendum — mandatory for this prompt

Run the relevant checks from [`00-SECURITY-RUNBOOK.md`](../../06-security-prompts/00-SECURITY-RUNBOOK.md) before closing this prompt.

At minimum, while executing this UI prompt verify:
- Protected UI/API calls are not accessible anonymously or by the wrong role.
- Demo user A cannot view or mutate demo user B objects by changing IDs, URLs, filters or request bodies.
- All text/query/file/template fields safely handle malicious-looking input without XSS, open redirect, path traversal, stack traces or debug leakage.
- Mutating controls are resistant to CSRF/clickjacking assumptions and have correct confirmation/audit behavior.
- Browser storage, console output, debug panels, generated artifacts and network responses do not leak tokens, cookies, OTPs, reset links, private URLs, provider secrets or unnecessary PII.
- If this prompt touches payments, webhooks, media, documents, messaging, notifications, exports or system operations, also run the matching `S##` security prompt from `06-security-prompts/`.

Add a `Security findings` section to the prompt result using the security runbook output template. Stop and escalate P0 for auth bypass, cross-user data, token leakage, stored XSS, duplicate charge, unsigned webhook acceptance, unsafe webhook target acceptance or impersonation attribution failure.

