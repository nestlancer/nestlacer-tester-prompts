# P45 — Known regression rerun and automated e2e parity sweep

**Priority:** P0  
**Primary role:** Regression QA lead  
**Scope:** Browser rerun of the source’s existing Playwright specs, `NL-BUG`/`RERUN` markers and changelog regression surfaces.
**Target host:** `nestlancer.com` + `app.nestlancer.com` + `admin.nestlancer.com`

## 0. Demo-production mode for this prompt

Execute mutating/destructive checks on confirmed demo/audit fixtures when required by the regression. If a source regression requires payment, webhook, password, session or delete behavior, use demo/test fixtures and capture before/after/audit evidence.

## 1. Source-code anchors to read first

- `source-regression-markers-inventory.md`
- `frontend-special-route-handlers-and-middleware.md`
- Frontend Playwright specs under `apps/*/e2e/**`
- Frontend changelog: `CHANGELOG.md`, `docs/changelog/CHANGELOG.md`
- Backend unit/e2e spec names under `services/**/tests`, `workers/**/tests`, `libs/**/tests`
- Key frontend markers:
  - `AdminConsoleLayout.tsx` command-palette keyboard event
  - `api-keys/page.tsx` redirect replacement
  - `payments/disputes/page.tsx` dedicated route
  - `UserSearchCombobox.tsx` always-visible input
  - `useAdminLogin.ts` inline failure alert
  - `IntegrationsClient.tsx` disable confirmation
  - `AdminProjectDeliveryPanel.tsx` pay-only milestone display
  - invalid entity blank-shell guards in admin/web quotes/projects/payments
  - request quote click-race guard
  - users search debounce
  - forced media download/SVG rejection paths

## 2. Routes / surfaces to walk

Cover the routes and behaviors represented by these specs/markers:

- Admin pages live smoke: all major admin pages must not 5xx, blank or render generic error states.
- Admin users: directory search/debounce, user detail, media, password, sessions, activity.
- Admin command palette: open/close keyboard shortcuts, focus, navigation.
- Admin pipeline: overview, user hub, project hub, picker routes.
- Admin UI fixes: notifications default “My notifications”, platform log filters, payments verification/disputes/reconciliation tabs, messages overview vs full-page threads, moderation/analytics non-blanking, system notification templates.
- Web public pages: landing/public content, blog, portfolio, terms/privacy, verify alias.
- Web auth: login, 2FA, password reset, email verification, wrong portal.
- Web requests mocked/live parity: empty/error states, pagination, status filters, search URL sync.
- Web payment checkout: mocked or gateway test-mode Razorpay happy path, failure/cancel path, invoice update.

## 3. What this prompt must prove

- Every existing e2e source expectation is represented by at least one current prompt and still passes manually in production-like demo data.
- Every `NL-BUG`/`RERUN` marker has a browser-visible or API-prompt-visible regression check.
- Regression fixes remain true under real navigation, reload, back/forward, refresh, direct deep link and mobile viewport.
- UI fixtures used by automated tests correspond to real demo/audit data or are explicitly mocked-only and covered by an API prompt.

## 4. Mandatory regression checks

1. Build a mini-ledger from `source-regression-markers-inventory.md` with columns: marker, source file, expected behavior, owner prompt, runtime verdict.
2. Rerun all high-risk admin page smoke routes manually in browser: dashboard, analytics, audit, users, user detail, requests, quotes, projects, payments, payment detail, disputes, company legal, accounts, contact, moderation, integrations, media, notifications, system, pipeline, content, portfolio, profile.
3. Verify notifications:
   - Default tab is “My notifications” where specified.
   - Platform logs/filter controls load and filter without blanking.
   - Template rows in system/notifications render without fault.
4. Verify payments:
   - Verification tab/data loads.
   - Disputes dedicated route does not fall through to `/payments/[id]`.
   - Reconciliation/manual/offline paths expose correct statuses and no zero-amount drift.
   - Payment stats failure does not coerce to ₹0.00.
5. Verify messages:
   - Overview page is an overview, not an inline active chat.
   - Thread/project message pages are full-page thread experiences.
   - Archived/inbox/threads/new route redirects land correctly.
6. Verify moderation/analytics pages load data and empty states without blanking after filter/tab changes.
7. Verify user detail tabs/actions: media, password reset/set password, sessions/revoke, activity, status/role/export/impersonation where demo-safe.
8. Verify pipeline overview, `/pipeline/users`, `/pipeline/users/<id>`, `/pipeline/projects`, `/pipeline/projects/<id>` and always-visible user/project search inputs.
9. Verify web request list/detail/new request flows: pagination, search, status filter, URL query sync, empty state, error state.
10. Verify Razorpay checkout happy path in test/mocked mode only. Capture order creation, checkout open, verification, invoice/payment status update and error/cancel branch.
11. Verify hard route fixes from P43: `/api-keys` redirect and admin hard-absent routes.
12. Verify a11y/regression tokens: primary contrast, focus restoration after sheets/dialogs, unique filter bar IDs when multiple filter bars render.

## 5. Backend marker cross-checks delegated to API prompts

Record these as covered by API prompts if not visible in UI:
- Response envelope transform and correlation ID (`A18`).
- Payment duplicate/zero/dispute/refund invariants (`A06`, `A14`, `A18`).
- Quote totals, line items, document versioning and draft visibility (`A04`, `A13`, `A19`).
- Media access/private visibility and SVG spoof rejection (`A09`, `A19`).
- Webhook SSRF, signature and idempotency (`A16`, `A18`, `A19`).
- Worker queue retry/idempotency (`A19`).

## 6. Data and safety fences

- It is acceptable to mutate/delete/revoke demo/audit records when that is the regression under test.
- For password/session/impersonation tests, use disposable demo users and sign out afterwards.
- For payments, use test mode only; never real cards, real refunds or real settlement operations.
- Do not publish real notifications, emails, webhooks or push messages outside demo sinks/audit accounts.

## 7. Required evidence

- Regression ledger with marker → prompt owner → runtime verdict.
- Screenshots for every regression that previously had a bug marker.
- Network rows for high-risk mutation/security/money checks.
- Before/after state and audit rows for executed destructive actions.
- List of gaps that need new prompts if any marker is not covered.

## 8. Defects this prompt is designed to catch

- Automated-test-only fixes that fail in production-like data.
- Route fallthrough into dynamic `[id]` pages.
- Blank shells from invalid/missing records.
- Silent auth/login failures with only disappearing toast.
- Search/filter controls that never submit.
- Duplicate payments, zero-amount milestones, lost disputes/revenue.
- Missing full-page chat thread behavior.

## 9. Output format

```markdown
# Result — P45 — Known regression rerun and e2e parity

## Summary
- Specs/markers sampled:
- Routes walked:
- Highest severity:

## Regression marker ledger
| Marker | Source | Expected behavior | Runtime verdict | Owner prompt | Evidence |
|---|---|---|---|---|---|

## E2E parity ledger
| Spec area | Manual scenario | Fixture | Verdict | Evidence |
|---|---|---|---|---|

## New uncovered regressions
| Item | Risk | Proposed new prompt/action |
|---|---|---|
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

