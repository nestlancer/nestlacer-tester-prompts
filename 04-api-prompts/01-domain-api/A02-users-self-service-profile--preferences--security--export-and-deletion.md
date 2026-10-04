# A02 — Users self-service profile, preferences, security, export and deletion

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Current-user APIs beyond auth

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references
- openapi tags: `users`
- services/users/src/controllers/users.controller.ts
- prisma user schema
- packages/api-client/src/services/users.service.ts

## 2. Endpoint groups to cover
- profile/avatar/preferences/password
- 2FA setup/verify/disable/backup codes
- sessions/session details/terminate others
- delete-account/cancel-deletion
- activity/export/download

## 3. Required setup / fixtures
- demo client with active sessions in two browser/API contexts
- small avatar file
- account eligible for deletion/cancel

## 4. Mandatory tests
1. GET/PATCH profile and verify mass-assignment protection.
2. Avatar upload/remove with valid/invalid type/size.
3. Preferences get/patch persistence and unknown keys handling.
4. Password change with wrong/current/weak/reused/password confirmation.
5. 2FA full lifecycle and backup code regeneration.
6. Session list/detail/delete/terminate-others and token invalidation.
7. Request export/download and account deletion/cancel states.
8. Activity log records profile/security/session actions.

## 5. Negative and abuse probes
- Patch role/status via self profile.
- Terminate someone else session id.
- Download another user export id.
- Delete account while admin impersonates.

## 6. Cross-check with UI prompts
- P15 settings/profile/security
- P30 admin user detail parity

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A02 — Users self-service profile, preferences, security, export and deletion

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

