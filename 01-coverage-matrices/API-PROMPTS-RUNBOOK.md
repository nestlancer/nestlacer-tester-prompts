# API Prompt Runbook — Nestlancer v4 Max-Complete

These `A##` prompts complement the Playwright UI prompts. Direct HTTP/API/worker/seed testing with **`curl`** is required for API prompts because the user requested backend-level completeness on a production-like demo-data environment.

## Portal / API URLs (public-domain default)

Browser-origin and same-origin BFF checks use:

- Marketing: `https://nestlancer.com`
- Client / app-host public: `https://app.nestlancer.com`
- Admin: `https://admin.nestlancer.com`

Direct API prompts use the production gateway:

- API base: `https://api.nestlancer.com/api/v1`
- WebSocket: `https://api.nestlancer.com` (Socket.IO `/ws/socket.io`)

Do **not** call localhost, Docker IPs, or microservice host ports in public-domain mode. Compare portal BFF (`{portal}/api/v1/*`) vs API gateway when needed — not gateway vs internal service ports. Demo accounts: [`../00-start-here/DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md). Record any staging override once in the result summary.

Read inventories from `../02-source-inventories/` (not bare filenames).


## Tooling (required)

- Call every direct API / BFF / webhook / health check in these prompts with **`curl`**.
- Use **Playwright CLI** only when an `A##` prompt also requires a page, redirect, CSP, or cookie-visible UI check.
- Do **not** use browser MCP, Chrome DevTools MCP, browser-use, or other heavy interactive browser agents.

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
- [`../00-start-here/DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)
- [`../02-source-inventories/openapi-operations-by-tag.md`](../02-source-inventories/openapi-operations-by-tag.md)
- [`../02-source-inventories/backend-controller-endpoints.md`](../02-source-inventories/backend-controller-endpoints.md)
- [`../02-source-inventories/frontend-special-route-handlers-and-middleware.md`](../02-source-inventories/frontend-special-route-handlers-and-middleware.md)
- [`../02-source-inventories/source-regression-markers-inventory.md`](../02-source-inventories/source-regression-markers-inventory.md)
- [`../00-start-here/LOOP-COMPLETENESS-AUDIT.md`](../00-start-here/LOOP-COMPLETENESS-AUDIT.md)
