# A17 — Frontend BFF, same-origin proxy, auth cookies and CSP contracts

**Priority:** P0  
**Execution:** Direct route-handler/API contract testing is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Next.js route handlers and frontend platform contracts that are not plain page UI.

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references

- `frontend-special-route-handlers-and-middleware.md`
- `apps/admin/src/app/api/v1/[...path]/route.ts`
- `apps/web/src/app/api/v1/[...path]/route.ts`
- `apps/landing/src/app/api/v1/[...path]/route.ts`
- `apps/web/src/app/api/auth/**/route.ts`
- `apps/web/src/app/api/webhooks/razorpay/route.ts`
- `packages/config/proxy-api-v1.mjs`
- `packages/config/csp-middleware.mjs`
- `packages/config/request-log.mjs`
- `packages/auth/src/bff-gateway-login.ts`
- `packages/auth/src/middleware.ts`
- `packages/auth/src/silentRefresh.ts`
- `packages/auth/src/tokenManager.ts`

## 2. Endpoint groups to cover

- Frontend same-origin proxy: `{web,admin,landing}/api/v1/*`.
- Web and admin BFF auth routes: login, refresh, logout, verify-2FA, impersonate/stop where present, and any CSRF/cookie-setting endpoints present in source.
- Razorpay guard route in web Next app: `/api/webhooks/razorpay`.
- App middleware headers: CSP, nonce, request/correlation ID, cookies.
- Landing 307 redirects to web app.
- Admin hard-absent rewrite to `/nl-absent`.

## 3. Required setup / fixtures

- Demo client and admin accounts.
- One stale/invalid cookie scenario.
- Safe unauthenticated health/read endpoint for proxy checks.
- Test-mode or dummy Razorpay payload only; do not hit real payment state through this route.
- Browser or HTTP client capable of preserving cookies and inspecting redirect headers.

## 4. Mandatory tests

1. **Proxy upstream resolution**
   - With configured upstream, call safe `/api/v1/*` from each frontend origin and verify status/body/header parity with gateway.
   - With missing/self-referential upstream in a controlled environment, expect 502 `{ message: 'API upstream is not configured' }`.
   - Confirm no recursive call to same host.
2. **Header filtering**
   - Send harmless hop-by-hop request headers (`Connection`, `Keep-Alive`, `TE`, `Upgrade`, `Host`, `Content-Length` where client allows) and verify they are not forwarded/returned in a browser-breaking way.
   - Verify `content-encoding` is stripped when proxy streams upstream body.
3. **Cookie/session BFF**
   - Login via BFF and verify HttpOnly refresh cookie attributes, access-token handling, same-site/secure behavior and no token in local storage/URL.
   - Refresh success rotates/restores session; invalid/expired refresh clears cookies appropriately.
   - Concurrent refresh/lock contention preserves cookies and returns retryable semantics rather than logging out every tab.
   - Logout clears refresh/access/impersonation cookies.
4. **Impersonation BFF**
   - Start/accept/stop support impersonation on disposable demo user if allowed.
   - Verify server-side grant ends, cookies clear, audit attribution includes operator and target user, and tokens never appear in URL/query logs.
5. **Razorpay Next route guard**
   - `GET /api/webhooks/razorpay` returns 404.
   - `POST /api/webhooks/razorpay` returns 501 and does not enqueue/acknowledge a payment webhook.
   - Confirm the production webhook route belongs to gateway `/api/v1/webhooks/razorpay`.
6. **CSP/nonce/request IDs**
   - Verify normal page, redirect, rewrite/hard-404 and terminal route responses include expected CSP/request ID behavior.
   - Delegated `/api/auth/*` and `/api/v1/*` paths should not get fake page `http.request` logs with `200 ~0ms`.
7. **Landing redirects**
   - Test `/blog`, `/portfolio`, `/terms`, `/privacy` and nested paths with query strings. Expect 307 to web app, search preserved, no CDN-breaking correlation cookie.
8. **Admin hard 404s**
   - Authenticated admin requests to `/users/bulk`, `/users/roles`, `/quotes/library`, `/quotes/line-items`, `/quotes/not-a-known-segment` return hard 404.
   - Unauthenticated requests redirect to login before hard-404 rewrite.

## 5. Negative and abuse probes

- Wrong portal login through BFF.
- Invalid/malformed cookies: presence at edge should not grant API authorization.
- Refresh token replay/concurrent rotation.
- Proxy request to unsupported method/body streaming.
- Open redirect attempts in `from` query and landing redirects.
- CSP bypass via reflected query text on hard-404 page.
- Webhook payload replay sent to the wrong Next route.

## 6. Cross-check with UI prompts

- P43 frontend middleware/BFF/proxy/CSP/hard 404s.
- P03 auth/signup/password/2FA.
- P18 admin auth/operator gate.
- P31 audit/security/impersonation/sessions.
- P45 regression rerun.

## 7. Evidence to capture

- Method/path/status, headers, Set-Cookie attributes and request/correlation IDs.
- Cookie names and attributes only; redact values.
- Redirect `Location` values with tokens removed.
- Before/after auth/session/audit state.
- Any difference between route-handler source and runtime behavior.

## 8. Output format

```markdown
# Result — A17 — Frontend BFF/proxy/auth/cookie/CSP contracts

## Summary
- Origins tested: `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` (or recorded staging overrides)
- Accounts/fixtures:
- Highest severity:

## Endpoint coverage
| Origin | Method + path | Scenario | Status | Verdict | Evidence |
|---|---|---|---:|---|---|

## Cookie/header ledger
| Scenario | Cookie/header | Expected | Actual | Verdict |
|---|---|---|---|---|

## Contract drift / bugs
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

