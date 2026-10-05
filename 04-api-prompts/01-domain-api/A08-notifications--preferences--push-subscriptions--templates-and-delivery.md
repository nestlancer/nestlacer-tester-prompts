# A08 — Notifications, preferences, push subscriptions, templates and delivery

**Priority:** P1  
**Execution:** Direct API/backend contract testing via **`curl`**. Use Playwright CLI only for any required page/origin checks. Do not use browser MCP / Chrome DevTools MCP / browser-use. Use demo/prod data only.  
**Scope:** Notification APIs and fan-out effects

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **Direct API / backend / BFF endpoint checks:** use **`curl`** (cookie jar / `-H` auth as needed) against `https://api.nestlancer.com/api/v1` or the portal same-origin `{portal}/api/v1/*` / `/api/auth/*` paths this prompt covers. Record method, path, status, request id/correlation id, latency, and redacted envelope keys.
- **Frontend page / browser-origin checks** (when this prompt requires a page, redirect, CSP, or cookie-visible UI): use **Playwright CLI** only.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## 1. Source and contract references
- openapi tags: `notifications`, `Notification Preferences`, `Push Notifications`, `Push Subscriptions`, admin notifications/templates
- services/notifications controllers

## 2. Endpoint groups to cover
- user notifications list/unread/history/get/delete/mark/read-all/read-selected/clear-read/channels/preferences
- push register/unregister
- admin notification send/broadcast/segment/stats/delivery-report/templates
- internal notification endpoint if documented

## 3. Required setup / fixtures
- demo recipient client
- demo admin
- test push subscription payload if supported

## 4. Mandatory tests
1. List/mark/read/delete/clear/read-selected idempotency.
2. Preferences/channel matrix and quiet hours persistence.
3. Push subscription register/remove validation.
4. Admin single send to demo user and delivery report.
5. Broadcast/segment to limited demo audience only.
6. Template CRUD/update/delete and rendering variables.
7. Unread count/cache/realtime side effects.

## 5. Negative and abuse probes
- Send to nonexistent user.
- Broadcast without confirmation/segment filter.
- Invalid href or external URL.
- Preference patch unknown category.
- Duplicate fan-out on retry.

## 6. Cross-check with UI prompts
- P14 client notifications
- P34 admin notifications
- P35 templates

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A08 — Notifications, preferences, push subscriptions, templates and delivery

## Summary
- Environment:
- Tooling (`curl` for API / Playwright CLI for pages):
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

