# Final coverage validation — v4 Max-Complete

Generated: 2026-10-04

## Counts

- UI/browser prompts: 47 (`P01`–`P47`)
- API/backend prompts: 20 (`A01`–`A20`)
- Source inventories: frontend route map, special route handlers/middleware, frontend API method usage, frontend control strings, OpenAPI operations, backend controller endpoints, source regression markers.

## Latest loop findings integrated

| Source finding | Owner prompts |
|---|---|
| Admin `/nl-absent` hard HTTP 404 route for `/users/bulk`, `/users/roles`, `/quotes/library`, `/quotes/line-items`, non-UUID `/quotes/<segment>` | `P43`, `A17`, `P45` |
| Web/admin/landing `/api/v1/[...path]` same-origin proxy | `P43`, `A17`, `A18` |
| Web `/api/webhooks/razorpay` must refuse real webhooks (GET 404, POST 501) | `P43`, `A17`, `A16`, `A19` |
| Landing `/blog`, `/portfolio`, `/terms`, `/privacy` redirects to web app preserving path/search | `P01`, `P43`, `A17` |
| Edge auth checks cookie presence only; gateway owns JWT validation | `P43`, `A17`, `A18` |
| CSP nonce/request log behavior around redirects, rewrites and delegated `/api/auth`/`/api/v1` paths | `P43`, `P44`, `A17`, `A18` |
| `/api-keys` protected admin alias/redirect to integrations | `P35`, `P38`, `P43`, `P45` |
| Notifications default/platform log regression surfaces | `P34`, `P35`, `P45`, `A08`, `A15` |
| Payments verification/disputes/reconciliation tabs and money regressions | `P12`, `P27`, `P28`, `P45`, `A06`, `A14`, `A18` |
| Messages overview vs full-page thread behavior | `P13`, `P33`, `P45`, `A07`, `A15` |
| Moderation/analytics blanking regressions | `P20`, `P33`, `P45`, `A11`, `A15` |
| User detail media/password/sessions/activity | `P30`, `P31`, `P45`, `A12` |
| Pipeline user/project hubs | `P38`, `P45`, `A13` |
| Requests pagination/filter/search URL sync and request-to-quote race guard | `P06`, `P22`, `P23`, `P45`, `A03`, `A13` |
| Razorpay checkout mocked/test-mode happy path and failure/cancel path | `P12`, `P45`, `A06`, `A14` |
| Debug panels, health debug, telemetry and secret leakage | `P44`, `A18` |
| Workers/outbox/email/document/media/export/webhook side effects | `P35`, `P39`, `P47`, `A16`, `A19` |
| Seed/demo fixtures, catalog counts, cache busting and destructive mode | `P46`, `A20`, runbooks |
| Generated PDFs/emails/exports/download artifacts | `P47`, `A04`, `A06`, `A08`, `A09`, `A14`, `A19` |

## Link/count validation

Validated by script after generation:

- `README.md`: no missing local links.
- `00-COVERAGE-MATRIX.md`: 47 prompt links, no missing local links.
- `API-COVERAGE-MATRIX.md`: 20 prompt links, no missing local links.
- `API-PROMPTS-RUNBOOK.md`: no missing local links.

## Terminal rule

The suite is complete against the currently inspected source snapshot. If source changes, rerun `P42` plus `LOOP-COMPLETENESS-AUDIT.md`; any uncovered route/control/endpoint/worker/seed marker should become either a new prompt or an explicit backend-only/no-fixture entry.

## Security expansion added

A dedicated `06-security-prompts/` suite was added after the v4 max-complete organization step:

- `00-SECURITY-RUNBOOK.md` global authorized defensive-testing rules.
- `S01` threat model and attack-surface mapping.
- `S02` authentication/session/access-control/IDOR.
- `S03` input validation/injection/XSS/CSRF/open redirect.
- `S04` API abuse/rate-limit/replay/business logic.
- `S05` file/media/document/export security.
- `S06` payments/webhooks/financial-fraud security.
- `S07` data privacy/PII/secrets/logging/debug leakage.
- `S08` browser/platform headers/CSP/CORS/cache.
- `S09` realtime/messaging/notification/content-abuse security.
- `S10` integrations/webhook SSRF/outbound security.
- `S11` admin system/supply-chain/config security.
- `S12` AI-era prompt-injection and untrusted-content resilience.

All existing `P##` and `A##` prompt files now include a mandatory security addendum pointing to the security runbook.

