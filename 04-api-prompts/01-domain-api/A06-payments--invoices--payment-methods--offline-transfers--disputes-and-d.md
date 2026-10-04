# A06 — Payments, invoices, payment methods, offline transfers, disputes and documents

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Money and document APIs

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references
- openapi tags: `payments`, `Payment Methods`, `Invoices`, `Payment Documents`, admin payment endpoints
- services/payments controllers
- prisma payment schema

## 2. Endpoint groups to cover
- client payment stats/list/detail/status/initiate/create-intent/confirm/cancel/dispute/receipt/invoice
- payment methods CRUD/default/nickname
- platform accounts/offline bank transfer
- invoices list/detail/download
- payment documents versions
- admin payments/stats/detail/timeline/transactions/verify/approve/reject/refund/manual/reconciliation/revenue
- admin disputes/accounts/company-legal/milestones

## 3. Required setup / fixtures
- test-mode payment gateway/demo payment
- demo saved method token if supported
- demo platform account/legal profile
- demo dispute

## 4. Mandatory tests
1. Validate amounts/currency/status transitions and idempotency keys.
2. Checkout intent/create/confirm/cancel with double-submit.
3. Offline transfer submit and admin approve/reject.
4. Payment methods CRUD/default/nickname/delete permissions.
5. Dispute file/respond/resolve lifecycle.
6. Invoice/receipt/document generation/download and verification.
7. Admin manual payment/refund/reconciliation/revenue exports on demo data.
8. Company legal GSTIN/PAN validation and platform account CRUD.

## 5. Negative and abuse probes
- Duplicate charge.
- Confirm/cancel completed payment.
- Refund over amount.
- Method delete for other user.
- Invoice download unauthorized.
- Legal profile invalid identifiers.

## 6. Cross-check with UI prompts
- P11 invoices
- P12 client payments
- P27-P28 admin payments

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A06 — Payments, invoices, payment methods, offline transfers, disputes and documents

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

