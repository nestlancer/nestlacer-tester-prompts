# A07 — Messaging, chat threads, moderation and websocket events

**Priority:** P1  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Messaging REST plus realtime side effects

**API base URL:** `https://api.nestlancer.com/api/v1`
**WebSocket URL:** `https://api.nestlancer.com` (Socket.IO path `/ws/socket.io`)
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 2. Endpoint groups to cover
- conversations/unread
- project messages send/read/edit/delete/pin/flag/search
- chat thread direct/group/members/archive/user-hide
- admin flagged/moderation/broadcast system message
- websocket health/reconnect

## 3. Required setup / fixtures
- demo client/admin pair
- demo project
- demo group thread
- small attachment

## 4. Mandatory tests
1. Direct and group thread create/resume/list/detail.
2. Project messages send/read/edit/delete/pin/unpin/flag.
3. Members add/remove/leave authorization.
4. User archive/hide/unarchive semantics.
5. Admin flagged list/dismiss/escalate/delete/restore/history.
6. System broadcast to project.
7. Websocket event delivery to second connected client.

## 5. Negative and abuse probes
- Message to unauthorized project/thread.
- Remove non-member or admin from group.
- Edit/delete someone else message.
- Flag spam flood/rate-limit.
- Realtime duplicate event.

## 6. Cross-check with UI prompts
- P13 client messaging
- P33 admin messaging/moderation

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A07 — Messaging, chat threads, moderation and websocket events

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

