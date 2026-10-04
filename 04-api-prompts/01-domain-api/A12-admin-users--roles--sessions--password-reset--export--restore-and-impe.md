# A12 — Admin users, roles, sessions, password reset, export, restore and impersonation APIs

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Identity administration API surface

## 1. Source and contract references
- openapi admin users + impersonation paths
- services/users admin controller
- services/admin impersonation controller

## 2. Endpoint groups to cover
- admin users list/search/detail/update/role/status/delete/restore/bulk/security-stats/logs
- force-password-reset/admin-reset-password/sessions/terminate-all/activity/export
- impersonation start/end/sessions

## 3. Required setup / fixtures
- demo target client
- demo admin
- second active client session
- impersonation session

## 4. Mandatory tests
1. List/search/filter and pagination.
2. Update profile with mass-assignment checks.
3. Role/status transitions including sole-admin protection.
4. Force reset/set password and session invalidation.
5. Per-session and all-session termination.
6. Export data/download URL.
7. Soft-delete/restore/pending deletion.
8. Impersonation start/end/session list/action attribution.
9. Bulk activate/suspend with reason.

## 5. Negative and abuse probes
- Demote sole admin.
- Impersonate admin or deleted user.
- Set weak password.
- Terminate other user session without admin.
- Bulk action no reason.

## 6. Cross-check with UI prompts
- P29 users directory
- P30 user detail
- P31 audit

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A12 — Admin users, roles, sessions, password reset, export, restore and impersonation APIs

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

