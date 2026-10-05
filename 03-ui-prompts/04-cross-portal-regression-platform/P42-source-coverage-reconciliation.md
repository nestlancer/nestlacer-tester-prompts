# P42 — Source coverage reconciliation: routes, controls, API usage and backend endpoint gaps

**Priority:** P0  
**Primary role:** QA lead / coverage auditor  
**Scope:** Final source-to-prompt reconciliation so nothing from the repositories is missed
**Target host:** `https://nestlancer.com` + `https://app.nestlancer.com` + `https://admin.nestlancer.com`
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **Frontend pages / UI walks:** use **Playwright CLI** only (`npx playwright`, `playwright test`, or short Playwright CLI scripts). Drive navigation, forms, screenshots, console, and network from Playwright.
- **Direct API / gateway endpoints:** use **`curl`** against `https://api.nestlancer.com/api/v1` (or same-origin `{portal}/api/v1/*` for BFF/cookie checks when an API cross-check is needed). Record method, path, status, and redacted headers/body keys.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## 0. Demo-production mode for this prompt

This prompt is mostly read-only. It may open routes and click safe controls. Execute mutations only if they belong to another prompt’s demo/audit fixture and are needed to prove a coverage claim.

## 1. Source-code anchors to read before Playwright testing

### Generated/static inventories in this prompt suite
- [`../../02-source-inventories/frontend-route-map.md`](../../02-source-inventories/frontend-route-map.md)
- [`../../02-source-inventories/frontend-api-method-usage.md`](../../02-source-inventories/frontend-api-method-usage.md)
- [`../../02-source-inventories/frontend-control-string-inventory.md`](../../02-source-inventories/frontend-control-string-inventory.md)
- [`../../02-source-inventories/openapi-operations-by-tag.md`](../../02-source-inventories/openapi-operations-by-tag.md)
- [`../../02-source-inventories/backend-controller-endpoints.md`](../../02-source-inventories/backend-controller-endpoints.md)
- [`../../01-coverage-matrices/UI-COVERAGE-MATRIX-organized.md`](../../01-coverage-matrices/UI-COVERAGE-MATRIX-organized.md)
- [`../../01-coverage-matrices/API-COVERAGE-MATRIX-organized.md`](../../01-coverage-matrices/API-COVERAGE-MATRIX-organized.md)
- [`../../00-start-here/DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

### Frontend source roots
- `apps/web/src/app/**`
- `apps/admin/src/app/**`
- `apps/landing/src/app/**`
- `apps/web/src/features/**`
- `apps/admin/src/features/**`
- `apps/landing/src/components/**`
- `packages/api-client/src/services/**`
- `packages/api-client/src/generated/**`

### Backend source roots
- `gateway/src/modules/**`
- `services/**/src/controllers/**`
- `prisma/schema/**`

## 2. Routes / surfaces to walk
- Every static frontend route from `frontend-route-map.md`
- Every redirect/alias route from that map
- At least one valid, invalid and forbidden sample for each dynamic route family
- Backend/API groups from `openapi-operations-by-tag.md` that have no matching UI

## 3. What this prompt must prove
- Every frontend route is owned by at least one prompt.
- Every source-mined significant control string/action is owned by at least one prompt.
- Every frontend `apiServices.*` usage is exercised by a UI prompt or explicitly recorded as blocked/no fixture.
- Every backend OpenAPI/controller group has one of these statuses: UI covered, API prompt covered, backend-only by design, or missing UI bug.

## 4. Mandatory Playwright reconciliation walk
1. Build a route ledger from `frontend-route-map.md`; add columns: owner prompt, runtime verdict, evidence, notes.
2. Build a control ledger from `frontend-control-string-inventory.md`; sample every file with destructive/security/money controls and confirm the owning prompt covers it.
3. Build an API usage ledger from `frontend-api-method-usage.md`; for each `apiServices.service.method`, map to UI prompt and route/control that triggers it.
4. Build a backend endpoint ledger from `openapi-operations-by-tag.md` and `backend-controller-endpoints.md`; map to UI prompt, API prompt, or gap.
5. With Playwright CLI, open every route that does not have a runtime status yet. For dynamic routes, use demo fixtures from P39 or earlier prompts.
6. Probe removed/moved routes that source indicates are redirects: `/api-keys`, `/quotes/new`, `/payments/by-project`, `/projects/new`, `/requests/capacity`, `/system/*`, `/media/*`, `/messages/new`, `/messages/threads`, `/settings/*` redirects, `/verify`, `/work`.
7. Produce a final “not covered / blocked / duplicate / obsolete” list and create new follow-up prompts if any uncovered source remains.

## 5. Controls and page-in-page units that must be inventoried
- All route aliases and redirects
- All disabled controls with explanatory titles
- All destructive buttons and confirm dialogs
- All file upload/download/share controls
- All money controls
- All identity controls
- All admin system operations
- All dynamic detail pages from lists

## 6. Data and safety fences
This prompt is a reconciliation pass. It should not introduce new state unless opening a route needs an existing demo fixture.

## 7. Required evidence
- Final CSV/Markdown route coverage ledger.
- Final API coverage ledger.
- Screenshots for previously uncovered routes.
- List of all prompt amendments made after reconciliation.

## 8. Edge states / negative probes
- Route exists in source but no nav entry.
- API exists in OpenAPI but no UI and no API prompt.
- Control string exists in source but no runtime control appears.
- Frontend calls an endpoint not present in current OpenAPI.
- Backend controller endpoint exists but was omitted from OpenAPI.

## 9. Defects this prompt is designed to catch
- Missing prompt coverage despite complete-looking suite.
- Dead/orphan routes.
- UI/API drift.
- Obsolete prompts for routes that now redirect.
- High-risk controls hidden inside row actions or drawers.

## 10. Output format for this prompt

```markdown
# Result — P42 — Source coverage reconciliation

## Route ledger summary
| App | Routes in source | Covered | Runtime walked | Redirect/404 | Gaps |
|---|---:|---:|---:|---:|---:|

## API ledger summary
| Group | Operations | UI covered | API prompt covered | Backend-only | Gap |
|---|---:|---:|---:|---:|---:|

## Uncovered items
| Source | Item | Risk | New owner prompt / action |
|---|---|---|---|

## Final verdict
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

