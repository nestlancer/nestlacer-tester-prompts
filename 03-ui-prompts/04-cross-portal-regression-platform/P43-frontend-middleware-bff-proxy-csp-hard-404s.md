# P43 — Frontend middleware, BFF route handlers, same-origin API proxy, CSP and hard 404s

**Priority:** P0  
**Primary role:** Browser QA + platform edge/middleware auditor  
**Scope:** Next.js route handlers and middleware that are easy to miss when only walking `page.tsx` routes.
**Target host:** `https://nestlancer.com` + `https://app.nestlancer.com` + `https://admin.nestlancer.com`
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **Frontend pages / UI walks:** use **Playwright CLI** only (`npx playwright`, `playwright test`, or short Playwright CLI scripts). Drive navigation, forms, screenshots, console, and network from Playwright.
- **Direct API / gateway endpoints:** use **`curl`** against `https://api.nestlancer.com/api/v1` (or same-origin `{portal}/api/v1/*` for BFF/cookie checks when an API cross-check is needed). Record method, path, status, and redacted headers/body keys.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## 0. Demo-production mode for this prompt

Most checks are routing/header/read-only. Drive pages and same-origin checks with **Playwright CLI** (including `page.request` / in-page `fetch` to the app’s own route handlers or safe health/read endpoints). Use **`curl`** only in API prompts A16/A17/A18 for direct gateway/backend probing. Do **not** use browser MCP / Chrome DevTools MCP / browser-use.

## 1. Source-code anchors to read first

- `frontend-special-route-handlers-and-middleware.md`
- `apps/admin/src/middleware.ts`
- `apps/web/src/middleware.ts`
- `apps/landing/src/middleware.ts`
- `apps/admin/src/app/nl-absent/route.ts`
- `apps/admin/src/app/api/v1/[...path]/route.ts`
- `apps/web/src/app/api/v1/[...path]/route.ts`
- `apps/landing/src/app/api/v1/[...path]/route.ts`
- `apps/web/src/app/api/webhooks/razorpay/route.ts`
- `packages/config/proxy-api-v1.mjs`
- `packages/config/csp-middleware.mjs`
- `packages/config/request-log.mjs`
- `packages/auth/src/middleware.ts`
- `packages/auth/src/bff-gateway-login.ts`
- `packages/auth/src/silentRefresh.ts`

## 2. Routes / surfaces to walk

### Admin app
- Auth-gated protected prefixes from middleware: `/dashboard`, `/users`, `/requests`, `/quotes`, `/projects`, `/payments`, `/analytics`, `/content`, `/contact`, `/moderation`, `/integrations`, `/audit`, `/messages`, `/system`, `/portfolio`, `/media`, `/pipeline`, `/notifications`, `/api-keys`.
- Hard-absent paths: `/users/bulk`, `/users/roles`, `/quotes/library`, `/quotes/line-items`, and one unknown non-UUID `/quotes/<segment>`.
- `/api-keys` alias/redirect to `/integrations`.
- Admin auth BFF route handlers under `/api/auth/*`: login, refresh, logout, verify-2FA.
- Same-origin proxy: `/api/v1/<safe endpoint>` from the admin origin.

### Web app
- Auth-gated protected prefixes from middleware, especially `/blog/bookmarks` which is under the public blog tree but requires auth.
- Auth BFF route handlers under `/api/auth/*` including login, refresh, logout, verify-2FA and impersonation handoff/stop where safe.
- Same-origin proxy: `/api/v1/<safe endpoint>` from the web origin.
- Guard route `/api/webhooks/razorpay`: GET must be 404; POST must be 501 and must not acknowledge a real webhook.

### Landing app
- Middleware redirects: `/blog`, `/blog/<slug>`, `/portfolio`, `/portfolio/<id>`, `/terms`, `/privacy` to the web app, preserving path and query.
- Same-origin proxy: `/api/v1/<safe endpoint>` from landing origin.
- Marketing routes must not set a correlation cookie that breaks CDN caching.

## 3. What this prompt must prove

- Login redirects happen before hard-404 rewrites for protected admin absent paths when unauthenticated.
- Authenticated admins get real HTTP 404 documents for known-absent admin probes, not a streamed dashboard soft-404 with status 200.
- `/api-keys` is intentionally an alias/redirect to integrations, not a missing API key manager.
- Browser-facing code uses relative `/api/v1/*` and never calls backend `localhost`, `127.0.0.1`, `dev-api`, or an app’s own host as an upstream.
- Same-origin `/api/v1/*` proxy returns the upstream status/envelope for configured safe endpoints and a safe 502 message when upstream is absent/misconfigured.
- Hop-by-hop response/request headers are not surfaced through the proxy in a way that breaks browsers.
- CSP nonce headers are present on normal page responses and preserved across rewrites/terminal 404s; redirect responses do not break navigation.
- Request/correlation IDs are stable across page and API calls and do not leak secrets.
- The web Next route `/api/webhooks/razorpay` refuses webhooks so production webhooks must go to the API gateway endpoint.

## 4. Mandatory Playwright UI checks

1. Start with no auth cookies. Open each protected admin/web prefix sample and confirm redirect to the proper login page with `from=<original path>`.
2. Log in as the appropriate demo admin/user. Reopen the same protected samples and verify content loads or a legitimate API 401/403 is shown without infinite redirects.
3. While authenticated as admin, open the hard-absent paths:
   - `/users/bulk`
   - `/users/roles`
   - `/quotes/library`
   - `/quotes/line-items`
   - `/quotes/not-a-uuid-audit`
   Capture status code, page content, URL, CSP header and console.
4. Open `/api-keys` as admin and verify it redirects/aliases to `/integrations`. Confirm no “Coming soon” placeholder remains.
5. From Playwright CLI on each app origin, request `/api/v1/health` (or another safe path) via `page.request` or in-page `fetch`. Capture status, response envelope and `x-request-id`/`x-correlation-id` presence.
6. Temporarily test a known-bad proxy target only if the environment supports it safely; otherwise record whether a misconfigured environment would return `{ message: 'API upstream is not configured' }` with 502 per source.
7. From the web origin, test:
   - `fetch('/api/webhooks/razorpay')` → 404
   - `fetch('/api/webhooks/razorpay', { method: 'POST', body: '{}' })` → 501
   Ensure the body tells operators to use the gateway webhook endpoint and that no payment state changes.
8. From landing origin, open `/blog?utm_source=audit`, `/portfolio/demo-case?x=1`, `/terms`, `/privacy`. Verify 307 redirect to web app preserving path/query. Confirm marketing HTML does not emit an unnecessary correlation cookie.
9. Inspect at least one rewritten 404, one redirect and one normal page for CSP and nonce behavior. There must be no CSP console violations during normal navigation.
10. Confirm delegated `/api/auth/*` and `/api/v1/*` paths are not double-logged by middleware as fake `200 ~0ms` page requests; use available logs or request IDs if accessible.

## 5. Negative and edge probes

- Stale/invalid refresh cookie present: middleware may allow navigation, but API/gateway must reject and UI must recover to login or error state.
- Admin user attempts web-only route and client user attempts admin route.
- `/quotes/<valid-uuid-format-but-missing>` should show the route’s real missing-detail state, not the non-UUID hard-absent rewrite.
- `/quotes/drafts`, `/quotes/new`, `/quotes/stats`, `/quotes/payment-schedules`, `/quotes/templates` must not be hard-404ed.
- Query strings and hash fragments should not be dropped in redirects where the browser can preserve them.
- Proxy must not forward browser requests to the same host recursively.

## 6. Data and safety fences

- Do not mutate business data except session/login state.
- Use demo accounts only.
- Do not paste cookies, JWTs, OTPs, reset links or webhook secrets into the report.

## 7. Required evidence

- Network rows for each redirect/404/proxy/webhook-guard sample.
- Header sample showing CSP, nonce, request/correlation ID where present.
- Screenshot of `/api-keys` landing on integrations.
- Console screenshot proving no CSP/runtime errors.
- If a check is blocked by environment access, record exact missing host/env/fixture.

## 8. Defects this prompt is designed to catch

- Soft 404 pages returning 200 for absent admin routes.
- `/api-keys` regressing to a dead placeholder.
- Frontend production build calling localhost/dev API from the browser.
- Same-origin API proxy recursion or unsafe 502 body.
- Razorpay webhooks accidentally acknowledged by the Next web app.
- CSP nonce lost by middleware rewrite/terminal response handling.
- Landing redirects dropping search params or setting cache-busting cookies.

## 9. Output format

```markdown
# Result — P43 — Frontend middleware/BFF/proxy/CSP/hard-404s

## Summary
- Environment:
- Apps tested:
- Highest severity:

## Route-handler and middleware ledger
| App | Path | Auth state | Expected | Actual status/URL | Verdict | Evidence |
|---|---|---|---|---|---|---|

## Headers/CSP/correlation
| App/path | CSP present | Nonce present | Request/correlation ID | Cookie notes | Verdict |
|---|---|---|---|---|---|

## Proxy checks
| Origin | Path | Status | Envelope/header notes | Verdict |
|---|---|---:|---|---|

## Bugs / blocked checks
...
```

## Security addendum — mandatory for this prompt

Run the relevant checks from [`00-SECURITY-RUNBOOK.md`](../../06-security-prompts/00-SECURITY-RUNBOOK.md) before closing this prompt.

At minimum, while executing this UI prompt verify:
- Protected UI/API calls are not accessible anonymously or by the wrong role.
- Demo user A cannot view or mutate demo user B objects by changing IDs, URLs, filters or request bodies.
- All text/query/file/template fields safely handle malicious-looking input without XSS, open redirect, path traversal, stack traces or debug leakage.
- Mutating controls are resistant to CSRF/clickjacking assumptions and have correct confirmation/audit behavior.
- Browser storage, console output, debug panels, generated artifacts and network responses do not leak tokens, cookies, OTPs, reset links, private URLs, provider secrets or unnecessary PII.
- If this prompt touches payments, webhooks, media, documents, messaging, notifications, exports or system operations, also run the matching `S##` security prompt from `06-security-prompts/`.

Add a `Security findings` section to the prompt result using the security runbook output template. Stop and escalate P0 for auth bypass, cross-user data, token leakage, stored XSS, duplicate charge, unsigned webhook acceptance, unsafe webhook target acceptance or impersonation attribution failure.

