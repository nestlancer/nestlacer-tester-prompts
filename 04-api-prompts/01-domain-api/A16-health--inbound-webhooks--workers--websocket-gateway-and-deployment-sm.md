# A16 — Health, inbound webhooks, workers, websocket gateway and deployment smoke

**Priority:** P1  
**Execution:** Direct API/backend contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Operational/non-UI backend surfaces

## 1. Source and contract references
- openapi health/webhooks tags
- gateway/ws-gateway controllers
- services/webhooks controllers
- workers/*
- docker/deploy docs

## 2. Endpoint groups to cover
- health live/ready/detailed/dependencies/services/registry/workers/websocket/debug
- inbound webhooks razorpay/cloudflare/github/stripe/generic provider
- webhooks health
- ws-gateway health and realtime connection
- worker side effects for outbox/email/notification/document/media/export/audit

## 3. Required setup / fixtures
- signed test webhook payloads for demo providers if safe
- demo outbox-generating actions
- websocket client

## 4. Mandatory tests
1. Health endpoints role/environment exposure and status codes.
2. Inbound webhook signature verification, idempotency and disabled provider behavior.
3. Websocket health/connect/auth/subscribe/reconnect.
4. Outbox/worker side effects after actions: email, notification, document, media processing, export, audit.
5. Deployment smoke: version/build, CORS/origin, rate limits, maintenance mode.

## 5. Negative and abuse probes
- Unsigned webhook accepted.
- Replay webhook creates duplicate payment/event.
- Health debug leaks secrets.
- Websocket accepts wrong-role token.
- Worker retries duplicate side effect.

## 6. Cross-check with UI prompts
- P04/P13 realtime
- P35 system health
- P39 end-to-end side effects

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A16 — Health, inbound webhooks, workers, websocket gateway and deployment smoke

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

