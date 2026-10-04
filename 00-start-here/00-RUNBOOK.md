# Nestlancer AI Testing Prompt Suite v4 Max-Complete — Runbook

Generated on 2026-10-04 after reviewing the cloned backend and frontend repositories, the uploaded B01–B34 prompt suite, v2/v3 generated prompts, and an additional source-mining loop over special route handlers, middleware, regression markers, e2e specs, workers and seed fixtures.

## Why this suite was regenerated again

The previous prompt set was already source anchored, but another deeper loop found important surfaces that are easy to miss when testing only visible pages:

- Admin hard-404 route `/nl-absent` for probe-as-absent paths such as `/users/bulk`, `/users/roles`, `/quotes/library`, `/quotes/line-items` and unknown non-UUID `/quotes/<segment>`.
- Same-origin `/api/v1/[...path]` proxy handlers in web/admin/landing apps.
- Web `/api/webhooks/razorpay` guard route that must return 501/404 so real webhooks go to the API gateway.
- Landing middleware redirects for `/blog`, `/portfolio`, `/terms`, `/privacy` to the web app while preserving path/search.
- Edge auth behavior that only checks cookie presence; gateway JWT validation remains authoritative.
- CSP nonce and request-log behavior around rewrites, redirects and delegated `/api/auth`/`/api/v1` paths.
- Admin `/api-keys` alias/redirect to integrations.
- Existing e2e and source regression surfaces: notifications default/platform filters, payment verification/disputes/reconciliation, messages full-page thread behavior, moderation/analytics blanking, user detail media/password/sessions/activity, pipeline hubs, mocked requests pagination/filter/search, mocked Razorpay checkout, and many `NL-BUG` markers.
- Worker/outbox/document/email/media/export/webhook side effects and seed/demo fixture readiness.

## Prompt inventory

- **47 UI/browser prompts:** `03-ui-prompts/**/P01-...` through `P47-...`.
- **20 API/backend prompts:** `04-api-prompts/**/A01-...` through `A20-...`.
- **12 security prompts:** `06-security-prompts/S01-...` through `S12-...`.
- Start with:
  - [`DEMO-ACCOUNTS.md`](DEMO-ACCOUNTS.md) — hosts + demo logins (required for external LLM runs)
  - [`00-SOURCE-UNDERSTANDING.md`](00-SOURCE-UNDERSTANDING.md)
  - [`../02-source-inventories/frontend-route-map.md`](../02-source-inventories/frontend-route-map.md)
  - [`../02-source-inventories/frontend-special-route-handlers-and-middleware.md`](../02-source-inventories/frontend-special-route-handlers-and-middleware.md)
  - [`../02-source-inventories/frontend-api-method-usage.md`](../02-source-inventories/frontend-api-method-usage.md)
  - [`../02-source-inventories/frontend-control-string-inventory.md`](../02-source-inventories/frontend-control-string-inventory.md)
  - [`../02-source-inventories/openapi-operations-by-tag.md`](../02-source-inventories/openapi-operations-by-tag.md)
  - [`../02-source-inventories/backend-controller-endpoints.md`](../02-source-inventories/backend-controller-endpoints.md)
  - [`../02-source-inventories/source-regression-markers-inventory.md`](../02-source-inventories/source-regression-markers-inventory.md)
  - [`../01-coverage-matrices/UI-COVERAGE-MATRIX-organized.md`](../01-coverage-matrices/UI-COVERAGE-MATRIX-organized.md)
  - [`../01-coverage-matrices/API-COVERAGE-MATRIX-organized.md`](../01-coverage-matrices/API-COVERAGE-MATRIX-organized.md)
  - [`LOOP-COMPLETENESS-AUDIT.md`](LOOP-COMPLETENESS-AUDIT.md)

## Portal / API URLs

Use these hosts when opening browser sessions, calling the API, and recording evidence. **Public-domain mode is the default for external LLM runs.**

| Surface | Origin | Apps / notes |
|---|---|---|
| Marketing / landing | `https://nestlancer.com` | `apps/landing` |
| Client portal + app-host public | `https://app.nestlancer.com` | `apps/web` |
| Admin console | `https://admin.nestlancer.com` | `apps/admin` |
| API gateway | `https://api.nestlancer.com` | Paths under `/api/v1/*` |
| WebSocket | `https://api.nestlancer.com` | Socket.IO path `/ws/socket.io` |

- UI prompts label the host in `**Target host:**`.
- API prompts label `**API base URL:** https://api.nestlancer.com/api/v1`.
- Cross-portal prompts (P39–P47, except where scoped) walk the three portals; API checks use the gateway.
- Browser-origin checks (CORS, cookies, CSP, redirects) must use the three portal hosts; prefer same-origin `{portal}/api/v1/*` for BFF cookie mode.
- Do **not** call localhost, Docker IPs, or microservice host ports unless the operator marks **local lab mode**.
- Demo accounts: [`DEMO-ACCOUNTS.md`](DEMO-ACCOUNTS.md).
- If a demo/staging override is used instead, record the real origins once in the session preamble and keep path coverage identical.

Session preamble checklist:

```text
Mode: public-domain [ ]  local-lab [ ]
Portals reachable: nestlancer.com [ ]  app.nestlancer.com [ ]  admin.nestlancer.com [ ]  api.nestlancer.com [ ]
Actual origins used (if override): ______________________________
Demo accounts file: 00-start-here/DEMO-ACCOUNTS.md
```

## How to run the suite

1. Read `00-SOURCE-UNDERSTANDING.md` and the route/API inventories before executing prompts.
2. Confirm the three portal hosts (or an explicit staging override) are reachable before the first browser prompt.
3. Run P46/A20 early to prove demo fixtures exist and to create disposable audit records.
4. Execute high-risk P0 UI prompts first: auth, quotes, projects, payments, user/admin security, system operations, source reconciliation, middleware/proxy, debug/leakage, known regressions and demo fixtures.
5. Execute API prompts for backend-only or hard-to-trigger surfaces, especially A17–A20 for route handlers, cross-cutting contracts, workers and seed readiness.
6. Finish with P42 and P45 as reconciliation gates. If they find uncovered source, add another prompt and rerun the matrix.

## Demo-production execution mode requested by product owner

The target environment is production-like but seeded with demo data. Therefore prompts should not merely inventory destructive controls; they should execute them **when the selected record/account/payment/media/webhook/template is confirmed demo/audit data**.

Still protect against non-demo and external side effects:

- Money: use test-mode gateways or very low-value demo payments only; never use a real card/bank account.
- External effects: webhook targets, emails, broadcasts and push notifications must go only to demo sinks/audit users unless the operator explicitly approves a wider demo blast.
- Credentials: never print tokens/cookies/passwords/OTPs/reset links/webhook secrets.
- If you cannot prove the object is demo/audit data, pause and label the check BLOCKED rather than mutating it.

For each destructive control, capture before state, confirmation copy, request/response, after state, audit log and cross-portal effect.

## Universal safety fences

- Use only `AUDIT-<PROMPT-ID>-<YYYYMMDD>-<n>` records or clearly seeded demo records.
- Never mutate real users, real money, real media, real legal profiles, real system config, real templates, real webhooks, or real feature flags.
- Money: low-value staging/audit payments only; no real refunds/charges/settlement changes.
- Identity: no password/2FA/session/status/role changes on shared or real accounts.
- Destructive controls on non-audit records: inventory dialog and stop before final confirm.
- Stop immediately for XSS, token leakage, cross-user data, duplicate charge, privilege escalation, unsigned webhook acceptance, unsafe webhook target acceptance, or impersonation attribution failure.

## Evidence standard

Every prompt result must include screenshots, console findings, UI-triggered network rows or direct API rows as applicable, storage key names where relevant, a control inventory, and explicit gaps/blocked checks.

For API prompts, record method/path/status/request ID/correlation ID/latency, redact all secrets, and include before/after/audit/outbox evidence for mutations.

## Security-first execution overlay

The verified suite now includes a dedicated `06-security-prompts/` folder. Security is not optional: every `P##` and `A##` prompt has a security addendum and must be executed with the global security runbook.

Minimum rule: for every route, control, endpoint, worker or seed flow, test not only that it works, but that the wrong person cannot use it, malicious input is safely handled, sensitive data is not leaked, and high-risk actions are audited.

Start security work with:

1. `06-security-prompts/00-SECURITY-RUNBOOK.md`
2. `06-security-prompts/S01-threat-model-and-attack-surface.md`
3. The specific `S##` prompts matching the area being tested.

Security testing remains authorized and defensive only. Do not attack third-party systems, non-demo users/data, real payment rails or real external notification/webhook targets.

