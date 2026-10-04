# A03 — Requests, service catalogue and admin request triage APIs

**Priority:** P1  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Request lifecycle APIs from client/admin plus public services

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references
- openapi tags: `requests`, `Public/Services`, admin request endpoints
- services/requests controllers
- prisma request schema

## 2. Endpoint groups to cover
- public services list/detail
- client request create/list/detail/update/submit/delete/status/quotes/attachments
- admin request list/stats/detail/status/patch/assign/notes/capacity/delete/attachment download
- admin service packages

## 3. Required setup / fixtures
- demo client
- demo admin
- demo request with attachment
- service package fixture

## 4. Mandatory tests
1. Public service catalogue list/detail and inactive visibility rules.
2. Client create/update draft/submit request with validation limits.
3. Attachment upload/download/delete and MIME/size errors.
4. Status timeline and quotes-for-request access.
5. Admin list/stats/capacity settings/dashboard.
6. Admin status transitions, assign, patch, internal notes.
7. Verify internal notes not returned to client endpoints.
8. Admin service package CRUD/upsert if exposed.

## 5. Negative and abuse probes
- Cross-user request id.
- Illegal transition.
- Attachment path traversal/unsafe filename.
- Delete submitted/converted request if forbidden.
- Capacity setting invalid values.

## 6. Cross-check with UI prompts
- P06 client requests
- P22 admin requests
- P23 quote builder

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A03 — Requests, service catalogue and admin request triage APIs

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

