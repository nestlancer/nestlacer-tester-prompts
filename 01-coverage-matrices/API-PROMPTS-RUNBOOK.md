# API Prompt Runbook — Nestlancer v4 Max-Complete

These `A##` prompts complement the browser/UI prompts. Direct HTTP/API/worker/seed testing is allowed for API prompts because the user requested backend-level completeness on a production-like demo-data environment.

## Portal / origin URLs

Browser-origin and same-origin BFF checks use:

- Marketing: `https://nestlancer.com`
- Client / app-host public: `https://app.nestlancer.com`
- Admin: `https://admin.nestlancer.com`

Direct API prompts hit the environment gateway/BFF configured for that demo-production target; record the gateway base URL in the result summary when it differs from the portal hosts.

## Execution rules

- Use demo/audit accounts and objects only.
- Mutating/destructive operations are expected when the object is confirmed demo/audit data.
- Redact tokens, cookies, passwords, OTPs, reset links, signed URLs, webhook secrets, provider keys and PII values.
- Capture request ID/correlation ID for every failure.
- Verify before/after state and audit/outbox/worker side effects for mutations.
- Compare runtime behavior against OpenAPI, controller inventories and source regression markers.
- Stop and report P0 immediately for auth bypass, cross-user access, duplicate charge, token leak, XSS, unsigned webhook acceptance, unsafe webhook target acceptance, or impersonation attribution failure.

## Prompt set

- `A01`–`A16`: domain API/backend surfaces from auth through health/webhooks/workers.
- `A17`: frontend BFF, same-origin proxy, auth cookie and CSP contracts.
- `A18`: backend cross-cutting platform contracts: envelope, validation, cache, idempotency, security, logging.
- `A19`: asynchronous workers, outbox and generated side effects.
- `A20`: seed/demo data scripts, fixture readiness and destructive-test guardrails.

Read with:
- `openapi-operations-by-tag.md`
- `backend-controller-endpoints.md`
- `frontend-special-route-handlers-and-middleware.md`
- `source-regression-markers-inventory.md`
- `LOOP-COMPLETENESS-AUDIT.md`
