# A13 — Admin domain operations: requests, quotes, projects, progress, service packages and time entries

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Admin CRUD and workflow APIs for work delivery

## 1. Source and contract references
- openapi admin requests/quotes/projects/progress/service-packages/time-entries
- services/requests/quotes/projects/progress controllers

## 2. Endpoint groups to cover
- admin requests triage/capacity/notes/attachments
- admin quotes/templates/line-items/schedules/history/docs
- admin projects/team/status/archive/duplicate/export/portfolio bridge
- admin deliverables/milestones/progress/time entries
- service packages

## 3. Required setup / fixtures
- demo request/quote/project/milestones/deliverables
- demo service package
- demo time entry

## 4. Mandatory tests
1. Exercise full request→quote→project progression through API and verify state machines.
2. Admin request capacity/settings and service packages.
3. Quote templates/line item library/schedules.
4. Project team/status/archive/duplicate/export.
5. Milestones/deliverables/progress/time entries.
6. Portfolio bridge endpoints.

## 5. Negative and abuse probes
- Illegal transitions.
- Cross-client association.
- Duplicate project from wrong template.
- Time entry negative/overlong.
- Service package inactive visibility.

## 6. Cross-check with UI prompts
- P22-P26 admin request/quote/project UI
- P39 end-to-end

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A13 — Admin domain operations: requests, quotes, projects, progress, service packages and time entries

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

