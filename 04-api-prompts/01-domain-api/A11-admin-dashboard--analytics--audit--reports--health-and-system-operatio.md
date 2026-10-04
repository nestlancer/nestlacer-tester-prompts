# A11 — Admin dashboard, analytics, audit, reports, health and system operations

**Priority:** P0  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** High-privilege admin operational APIs

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references
- openapi tags: admin dashboard/audit/system/reports/health
- gateway/src/modules/admin/admin.controller.ts
- services/admin controllers
- services/health controllers

## 2. Endpoint groups to cover
- dashboard overview/revenue/users/projects/performance/activity/alerts
- analytics aliases
- reports list/generate/download
- audit list/stats/user/resource/export
- system config/features/jobs/templates/cache/logs/announcement/maintenance
- health detailed/live/ready/dependencies/debug

## 3. Required setup / fixtures
- demo admin
- demo audit actions from UI prompts
- safe template/config/job fixtures if available

## 4. Mandatory tests
1. Dashboard/analytics metrics match list endpoints.
2. Reports generate/list/download with filters.
3. Audit trail for known action/user/resource and export filters.
4. System config read/patch with read-only key protection.
5. Feature toggle/job retry/cancel/cache/logs/announcement/maintenance confirmations and audit.
6. Health endpoints expose safe detail by role/environment.

## 5. Negative and abuse probes
- Non-admin access.
- Patch protected config.
- Maintenance/cache clear without confirmation/audit.
- Report download unauthorized.
- Health debug leaks secrets.

## 6. Cross-check with UI prompts
- P20 dashboard/analytics
- P31 audit
- P35 system

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A11 — Admin dashboard, analytics, audit, reports, health and system operations

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

