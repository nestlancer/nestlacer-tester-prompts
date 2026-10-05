# A19 — Workers, outbox, documents, email, notification, media, export and webhook side effects

**Priority:** P0  
**Execution:** Direct backend/API/queue contract testing is allowed for this `A##` prompt via **`curl`** (Playwright CLI only if a page/origin check is required). Do not use browser MCP / Chrome DevTools MCP / browser-use. Use demo/prod data only.  
**Scope:** Asynchronous side effects and worker contracts beyond immediate HTTP response success.

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **Direct API / backend / BFF endpoint checks:** use **`curl`** (cookie jar / `-H` auth as needed) against `https://api.nestlancer.com/api/v1` or the portal same-origin `{portal}/api/v1/*` / `/api/auth/*` paths this prompt covers. Record method, path, status, request id/correlation id, latency, and redacted envelope keys.
- **Frontend page / browser-origin checks** (when this prompt requires a page, redirect, CSP, or cookie-visible UI): use **Playwright CLI** only.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## 1. Source and contract references

- `workers/analytics-worker/src/**`
- `workers/audit-worker/src/**`
- `workers/cdn-worker/src/**`
- `workers/document-worker/src/**`
- `workers/email-worker/src/**`
- `workers/export-worker/src/**`
- `workers/media-worker/src/**`
- `workers/notification-worker/src/**`
- `workers/outbox-poller/src/**`
- `workers/webhook-worker/src/**`
- `libs/queue/**`
- `libs/documents/src/**`
- `libs/pdf/src/**`
- `libs/storage/**`
- `services/**/src/**outbox**`, `services/**/src/**document**`, `services/**/src/**notification**`, `services/**/src/**webhook**`
- Worker unit/e2e tests under `workers/**/tests/**`.

## 2. Worker/domain groups to cover

- Transactional outbox poller: leader election, stale event monitor, publisher, queue topology.
- Audit worker: batch buffer and batch insert.
- Notification worker: in-app, push, broadcast, preference gate, template resolver, retry, metrics, Redis publisher.
- Email worker: renderer, recipient resolver, dispatcher, retry.
- Document worker: quote/invoice/receipt generation and registry updates.
- Media worker: image resize, thumbnail, metadata extraction, virus scan, stale processing, storage sync.
- Webhook worker: Razorpay payment/refund/dispute handlers, GitHub push/pull/deployment handlers, generic/outgoing webhook processor, signature verifier.
- Analytics worker: hourly/daily aggregation, weekly report, blog/portfolio/project/revenue/user/engagement processors.
- CDN worker: path and batch invalidation, Cloudflare provider.
- Export worker: report/export file generation and lifecycle.

## 3. Required setup / fixtures

- Queue/worker status access via admin system/jobs/health or backend tooling.
- Demo records that trigger each event class.
- Demo mail/push sinks if operator provides them (else BLOCKED); webhook sink must be public HTTPS demo URL — never localhost (see DEMO-ACCOUNTS.md).
- Test-mode signed Razorpay/GitHub payloads if supported.
- Disposable media files and report/export requests.

## 4. Mandatory tests

1. **Outbox baseline**
   - Generate a safe event from UI/API and verify an outbox row/job is created, published once, consumed once and marked complete or retry/dead-lettered with reason.
   - Verify stale event monitor surfaces stuck events.
2. **Audit worker**
   - Execute several demo admin/client mutations and confirm batched audit rows persist with actor, target, action, request ID and impersonation attribution.
3. **Notification worker**
   - Trigger in-app notification, preference-gated notification, broadcast to demo segment and retry failure.
   - Verify unread/read counts, template resolution, delivery report and Redis/realtime publication.
4. **Email worker**
   - Trigger password reset, email verification, quote sent and payment/invoice notification to demo sink.
   - Verify rendering, variables, retry/backoff and no duplicate sends on retry.
5. **Document worker**
   - Trigger quote/invoice/receipt generation through business flows.
   - Verify canonical document registry, latest-pointer behavior, PDF content and no duplicate latest siblings after concurrent direct download + worker generation.
6. **Media worker**
   - Upload image/video/file fixtures; verify metadata, thumbnail/resize, virus scan/quarantine, stale processing and storage sync.
   - Verify SVG/spoof rejection and forced download behavior.
7. **Webhook worker**
   - Submit signed test Razorpay payment captured/failed/refund/dispute events and GitHub push/pull/deployment events to the correct gateway route.
   - Verify signature checking, idempotency, replay prevention, job processing, payment/project/integration state and logs.
   - Verify outgoing webhook target safety revalidation and delivery retries to demo sink.
8. **Analytics worker**
   - Trigger or wait for aggregation; verify blog/portfolio/project/revenue/user/engagement aggregates and weekly report are consistent with source records.
9. **CDN worker**
   - Trigger public content/media update and verify path/batch invalidation job shape; use demo Cloudflare/sink if real provider is unavailable.
10. **Export worker**
   - Request an admin export/report. Verify queue job, generated file, download scope, expiration/cleanup and failure state.
11. **Admin visibility**
   - Cross-check worker health/job depth/consumer counts in `/system` and API health endpoints.

## 5. Negative and abuse probes

- Kill/disable one worker or simulate provider failure if a controlled environment permits it; verify retry/backoff/dead-letter behavior.
- Duplicate outbox event/job ID.
- Same webhook provider event ID replay.
- Malformed template variables.
- Large media/export job over limit.
- Private/loopback outgoing webhook URL.
- Worker completes side effect but fails status update; verify idempotent recovery.

## 6. Cross-check with UI prompts

- P34 notifications/broadcasts.
- P35 system jobs/templates/operations.
- P39 end-to-end workflows.
- P44 debug/observability.
- P46 demo fixtures.
- P47 generated documents/emails/exports/downloads.
- A16 health/webhooks/workers smoke.
- A18 cross-cutting idempotency/security.

## 7. Evidence to capture

- Event/job IDs, queue names and status transitions; redact payload PII/secrets.
- Before/after business state.
- Worker logs with request/correlation IDs.
- Retry/dead-letter evidence where applicable.
- Generated artifact hashes/file metadata for documents/media/exports.
- Delivery sink screenshots for email/notification/webhook.

## 8. Output format

```markdown
# Result — A19 — Workers/outbox/async side effects

## Summary
- Workers covered:
- Trigger records:
- Highest severity:

## Worker/job ledger
| Worker | Trigger | Job/event | Expected side effect | Actual | Verdict | Evidence |
|---|---|---|---|---|---|---|

## Retry/idempotency ledger
| Worker/event | Failure/replay pattern | Expected | Actual | Verdict |
|---|---|---|---|---|

## Cross-portal/artifact evidence
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

