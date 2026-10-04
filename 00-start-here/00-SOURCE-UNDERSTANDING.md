# Nestlancer Source Understanding — v4 Max-Complete Prompt Basis

## Frontend architecture

- `apps/web`: client portal + app-host public content. Important areas: auth, dashboard, requests, quotes, projects, payments, invoices/documents, media/files, messages, notifications, settings/profile, public blog/portfolio/share/verify pages.
- `apps/admin`: operations console. Important areas: auth gate, dashboard/analytics, contact, requests, quotes, projects, payments, users, audit, media, messages/moderation, notifications, system, content/blog CMS, portfolio CMS, pipeline/integrations.
- `apps/landing`: public marketing site with home/about/services/pricing/contact, SEO, redirects, `llms.txt` files.
- `packages/api-client`: Orval/generated + handwritten services used by both apps.
- `packages/auth`: session, BFF auth routes, impersonation handoff, token refresh.
- `packages/ui`, `packages/theme`, `packages/validators`, `packages/constants`: shared UI, tokens, validation, routes and copy.

## Backend architecture

- `gateway`: API gateway and OpenAPI surface.
- `ws-gateway`: realtime Socket.IO surface.
- `services`: domain services for auth, users, requests, quotes, projects, progress, payments, messaging, notifications, media, portfolio, blog, contact, admin, webhooks, health.
- `workers`: async outbox/email/notification/document/media/export/audit/analytics/webhook processors.
- `prisma/schema`: lifecycle enums and domain models.

## Critical source-derived route facts

### Client app
- Auth routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`; 2FA is an in-page challenge after login.
- Settings routes: `/settings` redirects to `/settings/account`; `/settings/billing` redirects to `/payments`; `/settings/sessions` redirects to `/settings/security`; actual tabs: Account, Security, Notifications, Files, Activity.
- Project detail tabs: Overview, Progress, Milestones, Deliverables, Messages, Files.
- Redirect aliases to verify: `/quotes/drafts`, `/quotes/new`, `/quotes/templates`, `/requests/archive`, `/payments/invoices`, `/messages/new`, `/messages/threads`, `/verify`, `/work`.
- `/settings/files` is a full media/document library, not a minor settings page.
- `/impersonate` is the client-app handoff target opened from admin user detail.

### Admin console
- Sidebar sections: Operations, Content, System.
- User detail has high-risk controls: role/status change, edit profile, force password reset, set password, end all sessions, export data, restore/deactivate, impersonate, per-session revoke, activity log.
- System hub tabs: Health, Config, Features, Jobs, Templates, Operations. `/system/*` routes mostly redirect into tabs.
- Media hub tabs: Storage, Quarantine, Analytics. `/media/*` routes mostly redirect into tabs.
- Admin notifications tabs: My notifications, Send, Broadcast, Segment, Delivery report, Platform log.
- Admin project detail tabs: Overview, Milestones & files, Daily progress, Analytics.
- Pipeline tabs: Stage pipeline, User hub, Project hub.
- Admin alias routes to verify: `/api-keys`, `/quotes/new`, `/quotes/payment-schedules`, `/payments/by-project`, `/projects/new`, `/requests/capacity`, `/system/staff`.
- Admin hard-absent probes must return real HTTP 404 after login, not soft streamed dashboard 200: `/users/bulk`, `/users/roles`, `/quotes/library`, `/quotes/line-items`, and unknown non-UUID `/quotes/<segment>`. Login redirect takes precedence when unauthenticated.

### Special route handlers and middleware
- Web/admin/landing all have same-origin `/api/v1/[...path]` route handlers that proxy to the gateway through `proxyApiV1`; browser-facing code should use relative URLs, not backend localhost/dev-api.
- Web `/api/webhooks/razorpay` intentionally refuses real webhook acknowledgement: GET 404 and POST 501; real Razorpay webhooks belong at gateway `/api/v1/webhooks/razorpay`.
- Landing middleware redirects `/blog*`, `/portfolio*`, `/terms`, `/privacy` to the web app with HTTP 307 and preserved query/search, while avoiding cache-busting correlation cookies for marketing HTML.
- Edge auth middleware only checks refresh/access/impersonation cookie presence; gateway/service JWT validation, role authorization and account status remain authoritative.
- CSP/request-log middleware must preserve nonce and terminal/rewrite responses, especially `/nl-absent`, and must not emit fake page-status logs for delegated `/api/auth/*` or `/api/v1/*` paths.
- `/api-keys` is a protected admin alias/redirect to `/integrations`, not a standalone API-key manager.

## Domain states from Prisma that prompts must verify in UI labels/transitions

- Requests: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `QUOTED`, `ACCEPTED`, `REJECTED`, `CONVERTED_TO_PROJECT`, `CHANGES_REQUESTED`, `CANCELLED`, `EXPIRED_QUOTE`.
- Quotes: `DRAFT`, `PENDING`, `SENT`, `VIEWED`, `ACCEPTED`, `DECLINED`, `EXPIRED`, `CHANGES_REQUESTED`, `REVISED`.
- Projects: `CREATED`, `PENDING_CONTRACT`, `PENDING_PAYMENT`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `ARCHIVED`, `CANCELLED`, `REVISION_REQUESTED`, `ON_HOLD`, `PAYMENT_OVERDUE`, `SUSPENDED`, `DISPUTED`.
- Milestones: `PENDING`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `APPROVED`, `REVISION_REQUESTED`, `CANCELLED`.
- Deliverables: `PENDING`, `IN_PROGRESS`, `READY_FOR_REVIEW`, `REVISION_REQUESTED`, `APPROVED`, `REJECTED`.
- Payments: `CREATED`, `PENDING`, `PROCESSING`, `PENDING_VERIFICATION`, `COMPLETED`, `FAILED`, `REFUNDED`, `DISPUTED`, `CANCELLED`.
- Users: `ACTIVE`, `SUSPENDED`, `DELETED`, `PENDING_DELETION`; roles: `USER`, `ADMIN`.
- Media: `PENDING`, `PROCESSING`, `UPLOADING`, `READY`, `FAILED`, `QUARANTINED`.
- Blog posts/comments: `DRAFT/SCHEDULED/PUBLISHED/ARCHIVED`; `PENDING/APPROVED/REJECTED/SPAM`.
- Contact: `NEW`, `READ`, `RESPONDED`, `ARCHIVED`, `SPAM`.

## Additional regression surfaces from source/e2e

- Notifications: default tab, platform log filters, delivery report, template rows and broadcast/segment controls must not blank.
- Payments: verification, disputes dedicated route, reconciliation/manual/offline/refund paths, stats failure not coerced to zero, duplicate/zero-amount/reused-order protection.
- Messages: overview must stay an overview; thread/project pages are full-page chat experiences; redirect aliases must land on inbox/new-direct correctly.
- User detail: media, password reset/set password, sessions/revoke, activity, export, status/role, impersonation.
- Pipeline: overview, user picker/hub, project picker/hub and always-visible combobox inputs.
- Requests: search debounce, pagination/status/search URL sync, request-to-quote race guard.
- Artifacts: quote/invoice/receipt PDFs, document verification, email/template previews, exports and forced media downloads.
- Workers: outbox, audit, email, notification, document, media, export, webhook, analytics and CDN jobs must be verified through side effects, not only HTTP success.

## Seed/demo fixture facts

- Seed phases: `core`, `blogs`, `portfolio`, `content`, `demo`, and guarded `reset`.
- Expected catalog from seed docs: 4 blog categories, 6 blog tags, 110 published posts, 4 portfolio categories, 8 portfolio items, 10 email templates, 12 feature flags, 52 notification templates, 7 quote blocks and 1 service package.
- Production seed safeguards reject `reset` and `demo` unless explicitly confirmed; prompt execution still allows destructive app flows on confirmed demo/audit records.
- Use `AUDIT-<PROMPT-ID>-<YYYYMMDD>-<n>` naming for fresh records created by prompts.
