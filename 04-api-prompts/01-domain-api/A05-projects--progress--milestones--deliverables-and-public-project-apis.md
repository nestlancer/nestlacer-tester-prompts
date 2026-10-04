# A05 — Projects, progress, milestones, deliverables and public project APIs

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Work lifecycle APIs after quote acceptance

## 1. Source and contract references
- openapi tags: `projects`, `progress`, Deliverable Reviews, Milestone Approvals, admin projects/progress
- services/projects and services/progress controllers
- prisma project/progress schemas

## 2. Endpoint groups to cover
- client projects list/detail/timeline/deliverables/payments/progress/milestones/messages/feedback/approve/sign-contract/request-revision
- progress project timeline/status/milestones/request changes/entries
- deliverable approve/reject and milestone approve/revision
- admin projects list/stats/detail/status/team/analytics/archive/duplicate/export/portfolio link
- admin milestones/deliverables/progress/time-entries

## 3. Required setup / fixtures
- demo accepted quote/project
- demo milestones/deliverables
- small deliverable file

## 4. Mandatory tests
1. Provision/get project by quote and list visibility.
2. Client timeline/progress/milestones/deliverables/feedback/actions by state.
3. Admin status history/team/analytics/archive/unarchive/duplicate/export.
4. Admin create/update/complete milestones and upload/update/delete deliverables.
5. Progress entries create/update/delete and client visibility.
6. Time entries create/list.
7. Public projects list/detail access rules.

## 5. Negative and abuse probes
- Client approves another user project.
- Complete milestone out of order.
- Deliverable reject after approved.
- Export download unauthorized.
- Public project exposes private fields.

## 6. Cross-check with UI prompts
- P08-P10 client projects
- P25-P26 admin projects

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A05 — Projects, progress, milestones, deliverables and public project APIs

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

