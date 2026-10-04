# Completeness Audit Loop — v4

This file records the iterative source-review loop used to harden the prompt suite.

## Loop rule
Repeat until every source-mined item is either:
1. Covered by a UI prompt (`P##`),
2. Covered by an API/backend prompt (`A##`),
3. Explicitly classified as backend-only / no UI by design,
4. Explicitly blocked by missing demo fixture or environment access.

## Pass 1 — Frontend route pages
Inputs: `frontend-route-map.md`, `apps/*/src/app/**/page.tsx`.
Result: v3 already covered major route groups. Added in v3: `P41` admin `/profile`, `P42` final reconciliation.

## Pass 2 — Route handlers, middleware, hard 404s, BFF proxy
Inputs: `apps/*/src/middleware.ts`, `apps/*/src/app/api/**/route.ts`, `packages/config/proxy-api-v1.mjs`, `packages/config/csp-middleware.mjs`, `packages/auth/src/middleware.ts`, `admin/src/app/nl-absent/route.ts`.
Gap found: UI prompts covered pages but not same-origin `/api/v1` proxy, BFF auth handlers, CSP nonce, request logging, landing redirects, hard 404 rewrite, Razorpay Next-app 501 guard.
Action: Added `P43` and `A17`.

## Pass 3 — Debug/diagnostics/raw payload leakage
Inputs: `DebugApiSection`, `NEXT_PUBLIC_DEBUG_API`, payment debug helpers, system health diagnostics, telemetry/logging source.
Gap found: many admin pages include raw JSON debug sections gated by env; system health debug can render JSON diagnostics.
Action: Added `P44`.

## Pass 4 — Existing tests and source bug markers
Inputs: frontend Playwright specs, grep for `NL-BUG`, `RERUN`, `TODO`, `FIXME`, backend unit/integration spec names.
Gap found: source contains known-regression expectations for notifications default tab, payments tabs, messages full-page threads, hard absent admin routes, command palette, pipeline hubs, payment checkout, requests list URL sync, PDF/doc/storage bugs.
Action: Added `P45` and strengthened API prompts with A18/A19.

## Pass 5 — Demo data and destructive execution mode
Inputs: `seed/README.md`, `seed/payloads/**`, `seed/demo/**`, reset/cache-bust scripts.
Gap found: prompts needed a dedicated fixture-readiness prompt because testing prod-like demo data requires knowing which records may be safely mutated/destroyed.
Action: Added `P46` and `A20`.

## Pass 6 — Generated artifacts and outbound communications
Inputs: PDF/document libs, mail/notification workers, export worker, downloadable docs from UI prompts.
Gap found: quote/contract/invoice/receipt/export PDFs and emails were touched in domain prompts but not as one artifact matrix.
Action: Added `P47` and `A19`.

## Pass 7 — Final terminal coverage
Inputs: UI prompts P01–P47, API prompts A01–A20, inventories.
Result: all known route/page/control/API/backend categories are now either owned by a prompt or explicitly reconciled by `P42` / `A20`.

## Remaining rule
If future source changes add routes/endpoints/controls, rerun `P42` and append new prompt(s); do not silently treat this suite as static.
