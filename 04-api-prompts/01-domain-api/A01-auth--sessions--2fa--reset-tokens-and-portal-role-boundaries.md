# A01 — Auth, sessions, 2FA, reset tokens and portal role boundaries

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Backend auth contract and BFF cookie/session behavior

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references
- openapi-operations-by-tag.md tags: `auth`, `users` session/security subset
- backend-controller-endpoints.md: gateway auth, services/auth, services/users
- packages/auth/src/*
- apps/web/admin api/auth route handlers

## 2. Endpoint groups to cover
- register/login/refresh/logout/logout-all
- forgot/reset password/check-email/verify-email/resend
- verify-2fa
- end impersonation
- user sessions/profile basic

## 3. Required setup / fixtures
- demo client account from [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md) (e.g. `arjun.mehta@nestlancer.com`)
- demo admin account (`admin@nestlancer.com`)
- 2FA-enabled account if available (create AUDIT-* disposable account; else BLOCKED)
- reset/verify email sink access if available (usually BLOCKED on demo seed — outbound email suppressed; see DEMO-ACCOUNTS.md)

## 4. Mandatory tests
1. Validate envelope/status/error codes for each auth endpoint.
2. Verify cookies: HttpOnly/Secure/SameSite/domain/path; no token in JS-readable storage where cookie mode is expected.
3. Register → verify email → login → refresh → logout lifecycle.
4. Forgot/reset password with valid, expired, reused and malformed tokens.
5. 2FA challenge: TOTP, backup code, wrong code, replay, rate-limit.
6. Portal role boundary: admin tokens rejected from client-only paths and client tokens rejected from admin paths.
7. Logout-all invalidates all sessions and refresh tokens.

## 5. Negative and abuse probes
- Missing Turnstile where required.
- Email enumeration via check-email/forgot/reset.
- Token replay/reuse after reset/verify.
- Open redirect in `from`/callback.
- Refresh after user suspended/deleted.

## 6. Cross-check with UI prompts
- P03 client auth
- P18 admin auth
- P15/P30 sessions/password actions

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A01 — Auth, sessions, 2FA, reset tokens and portal role boundaries

## Summary
- Environment:
- Accounts/fixtures:
- Endpoint groups covered:
- Highest severity:

## Endpoint coverage
| Method + path | Scenario | Status | Verdict | Evidence |
|---|---|---|---|---|

## Contract drift
| Endpoint | OpenAPI says | Runtime/source says | Severity |
|---|---|---|---|

## Bugs
...
```

## Security addendum — mandatory for this API prompt

Run the relevant checks from [`00-SECURITY-RUNBOOK.md`](../../06-security-prompts/00-SECURITY-RUNBOOK.md) before closing this API/backend prompt.

At minimum, verify:
- Authentication, role authorization and object ownership for every endpoint group, including unauthenticated, client, admin, wrong-role, suspended and impersonated sessions.
- Input validation rejects malicious-looking path/query/body values, invalid enums, oversized fields, tampered IDs and malformed payloads with safe error envelopes.
- Mutating endpoints are protected against CSRF/origin abuse where browser-callable, replay, double-submit, race conditions and idempotency failures.
- Rate limits or practical abuse controls exist for auth, reset/OTP, contact, comments, upload, checkout, webhook and notification endpoints.
- Logs, debug responses, error envelopes, generated artifacts and worker payloads redact tokens, cookies, OTPs, reset links, provider secrets, private URLs and unnecessary PII.
- If this prompt touches payments, webhooks, media, documents, messaging, notifications, exports, seed/reset or system operations, also run the matching `S##` security prompt from `06-security-prompts/`.

Add a `Security findings` section to the prompt result using the security runbook output template. Stop and escalate P0 for auth bypass, cross-user data, token leakage, duplicate charge, unsigned webhook acceptance, unsafe webhook target acceptance, stored XSS or privilege escalation.

