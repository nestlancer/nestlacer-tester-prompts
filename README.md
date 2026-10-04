# Verified Prompts — Nestlancer v4 Max-Complete + Security

This directory is the organized, verified prompt suite derived from `nestlancer-ai-prompts-v4-max-complete`, now updated with mandatory application-security and abuse-resistance checks.

## Portal / API URLs (required when running prompts)

External LLM runs must use **public domains only** (not localhost, Docker IPs, or microservice ports).

| Surface | Origin | Used by |
|---|---|---|
| Marketing / landing | `https://nestlancer.com` | P01 (+ cross-portal) |
| Client portal + app-host public | `https://app.nestlancer.com` | P02–P17 (+ cross-portal) |
| Admin console | `https://admin.nestlancer.com` | P18–P41 (+ cross-portal) |
| API gateway | `https://api.nestlancer.com` (`/api/v1/*`) | A01–A20, S## API checks |
| WebSocket | `https://api.nestlancer.com` (`/ws/socket.io`) | messaging / realtime prompts |

Every UI prompt carries a `**Target host:**` line. Every API/security prompt carries `**API base URL:**` / `**Target hosts:**`. Demo logins live in [`00-start-here/DEMO-ACCOUNTS.md`](00-start-here/DEMO-ACCOUNTS.md). If the session uses a demo/staging override, record the actual origins in the evidence preamble and keep the same path map.

## Counts

- UI/browser prompts: **47** (`P01`–`P47`)
- API/backend prompts: **20** (`A01`–`A20`)
- Security prompts: **12** (`S01`–`S12`) plus `00-SECURITY-RUNBOOK.md`
- Every existing `P##` and `A##` prompt now includes a mandatory security addendum.

## Start here

- [DEMO-ACCOUNTS.md](00-start-here/DEMO-ACCOUNTS.md) — **Required** demo emails/password, hosts, public-domain vs operator-only rules
- [00-RUNBOOK.md](00-start-here/00-RUNBOOK.md) — Runbook — demo-production execution rules, safety fences, evidence standard and security overlay
- [00-SECURITY-RUNBOOK.md](06-security-prompts/00-SECURITY-RUNBOOK.md) — Security runbook — authorized defensive testing rules and universal security checklist
- [00-SOURCE-UNDERSTANDING.md](00-start-here/00-SOURCE-UNDERSTANDING.md) — Source understanding — architecture, route facts, state machines and source-derived findings
- [LOOP-COMPLETENESS-AUDIT.md](00-start-here/LOOP-COMPLETENESS-AUDIT.md) — Completeness audit loop — what each source-review pass added
- [FINAL-COVERAGE-VALIDATION.md](05-validation/FINAL-COVERAGE-VALIDATION.md) — Final coverage validation — counts, links, integrated source findings and security expansion

## Organized folders

- [Public + marketing UI prompts](03-ui-prompts/01-public/) — 3 files. Anonymous/public web, landing, blog, portfolio, share and verification surfaces.
- [Client portal UI prompts](03-ui-prompts/02-client-portal/) — 16 files. Client auth, dashboard, requests, quotes, projects, payments, files, messages, notifications and settings.
- [Admin console UI prompts](03-ui-prompts/03-admin-console/) — 23 files. Admin auth, shell, dashboard, requests, quotes, projects, payments, users, system, CMS, portfolio, pipeline and integrations.
- [Cross-portal/regression/platform UI prompts](03-ui-prompts/04-cross-portal-regression-platform/) — 9 files. End-to-end, reconciliation, middleware/BFF/proxy, debug/leakage, known regressions, demo fixtures and generated artifacts.
- [Domain API/backend prompts](04-api-prompts/01-domain-api/) — 17 files. Direct API prompts for core domain contracts A01-A16.
- [Platform/backend deep prompts](04-api-prompts/02-platform-backend/) — 5 files. BFF/proxy, cross-cutting backend contracts, workers/outbox and seed readiness A17-A20.
- [Security prompts](06-security-prompts/) — 14 files. Authorized defensive application-security, abuse-resistance and AI-era untrusted-content prompts S01-S12 plus the security runbook.
- [Coverage matrices](01-coverage-matrices/) — organized UI/API/security matrices plus preserved original matrices.
- [Source inventories](02-source-inventories/) — route, API, control, controller and regression inventories.
- [Validation](05-validation/) — final and organization validation docs plus manifest.

## Security execution model

Run `S01` first to build the threat model, then run the relevant `S##` prompt alongside each functional `P##` or `A##` prompt. Security testing is defensive and authorized only: no real third-party attacks, no real payment rails, no non-demo data, no broad external notifications/webhooks, and no harmful payload persistence.

Critical P0 stop conditions include auth bypass, cross-user data access, token leakage, stored XSS, privilege escalation, duplicate charge, unsigned webhook acceptance, unsafe webhook target acceptance or impersonation without attribution.

## Source inventories and matrices

- [API-COVERAGE-MATRIX-organized.md](01-coverage-matrices/API-COVERAGE-MATRIX-organized.md)
- [API-COVERAGE-MATRIX-original.md](01-coverage-matrices/API-COVERAGE-MATRIX-original.md)
- [API-PROMPTS-RUNBOOK.md](01-coverage-matrices/API-PROMPTS-RUNBOOK.md)
- [SECURITY-COVERAGE-MATRIX.md](01-coverage-matrices/SECURITY-COVERAGE-MATRIX.md)
- [UI-COVERAGE-MATRIX-organized.md](01-coverage-matrices/UI-COVERAGE-MATRIX-organized.md)
- [UI-COVERAGE-MATRIX-original.md](01-coverage-matrices/UI-COVERAGE-MATRIX-original.md)
- [backend-controller-endpoints.md](02-source-inventories/backend-controller-endpoints.md)
- [frontend-api-method-usage.md](02-source-inventories/frontend-api-method-usage.md)
- [frontend-control-string-inventory.md](02-source-inventories/frontend-control-string-inventory.md)
- [frontend-route-map.md](02-source-inventories/frontend-route-map.md)
- [frontend-special-route-handlers-and-middleware.md](02-source-inventories/frontend-special-route-handlers-and-middleware.md)
- [openapi-operations-by-tag.md](02-source-inventories/openapi-operations-by-tag.md)
- [source-regression-markers-inventory.md](02-source-inventories/source-regression-markers-inventory.md)

## Full prompt index

See [`ALL-PROMPTS-INDEX.md`](ALL-PROMPTS-INDEX.md).
