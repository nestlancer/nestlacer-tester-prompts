# ALL PROMPTS INDEX

Includes UI prompts, API/backend prompts and the added security prompt suite.

**Before any external LLM run:** read [`00-start-here/DEMO-ACCOUNTS.md`](00-start-here/DEMO-ACCOUNTS.md) for hosts (`https://nestlancer.com`, `https://app.nestlancer.com`, `https://admin.nestlancer.com`, `https://api.nestlancer.com`) and demo logins.

## Public + marketing UI prompts

| ID | File | Title |
|---|---|---|
| P01 | [P01-marketing-landing-seo.md](03-ui-prompts/01-public/P01-marketing-landing-seo.md) | P01 — Marketing landing, SEO, redirects and contact intake |
| P02 | [P02-public-app-content-share-verify.md](03-ui-prompts/01-public/P02-public-app-content-share-verify.md) | P02 — App-host public blog, portfolio, share viewer, document verify and legal surfaces |
| README.md | [README.md](03-ui-prompts/01-public/README.md) | Public + marketing UI prompts |

## Client portal UI prompts

| ID | File | Title |
|---|---|---|
| P03 | [P03-client-auth-signup-password-email-2fa.md](03-ui-prompts/02-client-portal/P03-client-auth-signup-password-email-2fa.md) | P03 — Client auth: signup, login, forgot/reset password, email verification and 2FA |
| P04 | [P04-client-shell-global-chrome-realtime.md](03-ui-prompts/02-client-portal/P04-client-shell-global-chrome-realtime.md) | P04 — Client shell, global chrome, nav, command palette, bell, chat dock and realtime sync |
| P05 | [P05-client-dashboard-work-summary.md](03-ui-prompts/02-client-portal/P05-client-dashboard-work-summary.md) | P05 — Client dashboard and work summary cards |
| P06 | [P06-client-requests-intake-detail.md](03-ui-prompts/02-client-portal/P06-client-requests-intake-detail.md) | P06 — Client requests: list, intake wizard, detail, attachments and lifecycle |
| P07 | [P07-client-quotes-acceptance-documents.md](03-ui-prompts/02-client-portal/P07-client-quotes-acceptance-documents.md) | P07 — Client quotes: list/detail, accept, decline, request changes, PDF/contract |
| P08 | [P08-client-projects-list-new-archive.md](03-ui-prompts/02-client-portal/P08-client-projects-list-new-archive.md) | P08 — Client projects list, new-from-quote, archive and completed views |
| P09 | [P09-client-project-hub-core-progress-milestones-messages.md](03-ui-prompts/02-client-portal/P09-client-project-hub-core-progress-milestones-messages.md) | P09 — Client project detail hub: overview, progress, milestones and messages |
| P10 | [P10-client-project-delivery-files-media.md](03-ui-prompts/02-client-portal/P10-client-project-delivery-files-media.md) | P10 — Client project deliverables, files, previews, approvals and file actions |
| P11 | [P11-client-invoices-documents-verify.md](03-ui-prompts/02-client-portal/P11-client-invoices-documents-verify.md) | P11 — Client invoices and generated documents |
| P12 | [P12-client-payments-checkout-methods-disputes.md](03-ui-prompts/02-client-portal/P12-client-payments-checkout-methods-disputes.md) | P12 — Client payments: overview, checkout, saved methods, offline transfer and disputes |
| P13 | [P13-client-messaging-chat-dock.md](03-ui-prompts/02-client-portal/P13-client-messaging-chat-dock.md) | P13 — Client messaging: inbox, threads, project conversations, direct chat, attachments and dock |
| P14 | [P14-client-notifications-preferences-push.md](03-ui-prompts/02-client-portal/P14-client-notifications-preferences-push.md) | P14 — Client notifications center, bell, preferences and push subscription |
| P15 | [P15-client-settings-profile-security-account.md](03-ui-prompts/02-client-portal/P15-client-settings-profile-security-account.md) | P15 — Client settings, profile, security, sessions, data export and account deletion |
| P16 | [P16-client-media-files-library.md](03-ui-prompts/02-client-portal/P16-client-media-files-library.md) | P16 — Client media/files library in settings |
| P17 | [P17-client-responsive-a11y-security-sweep.md](03-ui-prompts/02-client-portal/P17-client-responsive-a11y-security-sweep.md) | P17 — Client portal sweep: responsive, accessibility, offline, security and route aliases |
| README.md | [README.md](03-ui-prompts/02-client-portal/README.md) | Client portal UI prompts |

## Admin console UI prompts

| ID | File | Title |
|---|---|---|
| P18 | [P18-admin-auth-operator-gate.md](03-ui-prompts/03-admin-console/P18-admin-auth-operator-gate.md) | P18 — Admin auth/operator gate, 2FA, role mismatch and session teardown |
| P19 | [P19-admin-shell-global-chrome.md](03-ui-prompts/03-admin-console/P19-admin-shell-global-chrome.md) | P19 — Admin shell/global chrome: nav, palette, notifications, messages, moderation, user menu |
| P20 | [P20-admin-dashboard-analytics.md](03-ui-prompts/03-admin-console/P20-admin-dashboard-analytics.md) | P20 — Admin dashboard and analytics |
| P21 | [P21-admin-contact-inquiries.md](03-ui-prompts/03-admin-console/P21-admin-contact-inquiries.md) | P21 — Admin contact inquiries and public contact parity |
| P22 | [P22-admin-requests-capacity.md](03-ui-prompts/03-admin-console/P22-admin-requests-capacity.md) | P22 — Admin requests triage, assignment, notes, status and capacity |
| P23 | [P23-admin-request-to-quote-builder.md](03-ui-prompts/03-admin-console/P23-admin-request-to-quote-builder.md) | P23 — Admin request-to-quote builder, edit and prefill flow |
| P24 | [P24-admin-quotes-templates-lineitems.md](03-ui-prompts/03-admin-console/P24-admin-quotes-templates-lineitems.md) | P24 — Admin quotes list/detail, templates, line item library, payment schedules and documents |
| P25 | [P25-admin-projects-overview-team-export-duplicate.md](03-ui-prompts/03-admin-console/P25-admin-projects-overview-team-export-duplicate.md) | P25 — Admin projects list/detail overview, team, status, export and duplicate |
| P26 | [P26-admin-project-delivery-progress-portfolio-time.md](03-ui-prompts/03-admin-console/P26-admin-project-delivery-progress-portfolio-time.md) | P26 — Admin project delivery, milestones/files, progress updates, analytics, portfolio bridge and time entries |
| P27 | [P27-admin-payments-overview-detail-manual-reconciliation.md](03-ui-prompts/03-admin-console/P27-admin-payments-overview-detail-manual-reconciliation.md) | P27 — Admin payments overview, detail, manual payments, transfers, refunds and reconciliation |
| P28 | [P28-admin-payment-disputes-accounts-company-legal.md](03-ui-prompts/03-admin-console/P28-admin-payment-disputes-accounts-company-legal.md) | P28 — Admin payment disputes, platform accounts and company legal profiles |
| P29 | [P29-admin-users-directory-search-bulk.md](03-ui-prompts/03-admin-console/P29-admin-users-directory-search-bulk.md) | P29 — Admin users directory, search, filters and bulk actions |
| P30 | [P30-admin-user-detail-password-sessions-impersonation.md](03-ui-prompts/03-admin-console/P30-admin-user-detail-password-sessions-impersonation.md) | P30 — Admin user detail: profile, role/status, password reset, sessions, export, deactivate and impersonation |
| P31 | [P31-admin-audit-security-impersonation-sessions.md](03-ui-prompts/03-admin-console/P31-admin-audit-security-impersonation-sessions.md) | P31 — Admin audit console, security stats, user logs, impersonation sessions and export |
| P32 | [P32-admin-media-storage-detail-share-quarantine-analytics.md](03-ui-prompts/03-admin-console/P32-admin-media-storage-detail-share-quarantine-analytics.md) | P32 — Admin media library: storage, detail drawer, sharing, quarantine, analytics and cleanup |
| P33 | [P33-admin-messages-moderation.md](03-ui-prompts/03-admin-console/P33-admin-messages-moderation.md) | P33 — Admin messages, project/system broadcast, group/direct chat and moderation queue |
| P34 | [P34-admin-notifications-broadcast-segment-delivery.md](03-ui-prompts/03-admin-console/P34-admin-notifications-broadcast-segment-delivery.md) | P34 — Admin notifications: inbox, single send, broadcast, segment, delivery report and platform log |
| P35 | [P35-admin-system-config-features-jobs-templates-ops.md](03-ui-prompts/03-admin-console/P35-admin-system-config-features-jobs-templates-ops.md) | P35 — Admin system hub: health, config, features, jobs, templates, operations, logs and redirects |
| P36 | [P36-admin-content-blog-cms.md](03-ui-prompts/03-admin-console/P36-admin-content-blog-cms.md) | P36 — Admin content/blog CMS: posts, editor, taxonomy, comments and analytics |
| P37 | [P37-admin-portfolio-cms.md](03-ui-prompts/03-admin-console/P37-admin-portfolio-cms.md) | P37 — Admin portfolio CMS: list, editor, media, categories, reorder, analytics and public parity |
| P38 | [P38-admin-pipeline-integrations-webhooks-reports.md](03-ui-prompts/03-admin-console/P38-admin-pipeline-integrations-webhooks-reports.md) | P38 — Admin pipeline, user/project hubs, integrations/webhooks, API keys alias and reports gap |
| P41 | [P41-admin-operator-profile.md](03-ui-prompts/03-admin-console/P41-admin-operator-profile.md) | P41 — Admin operator profile and self-account surface |
| README.md | [README.md](03-ui-prompts/03-admin-console/README.md) | Admin console UI prompts |

## Cross-portal/regression/platform UI prompts

| ID | File | Title |
|---|---|---|
| P39 | [P39-cross-portal-end-to-end-workflows.md](03-ui-prompts/04-cross-portal-regression-platform/P39-cross-portal-end-to-end-workflows.md) | P39 — Cross-portal end-to-end workflows and backend/UI parity |
| P40 | [P40-full-regression-responsive-a11y-performance.md](03-ui-prompts/04-cross-portal-regression-platform/P40-full-regression-responsive-a11y-performance.md) | P40 — Full regression sweep: responsive, accessibility, performance, offline, security and coverage closure |
| P42 | [P42-source-coverage-reconciliation.md](03-ui-prompts/04-cross-portal-regression-platform/P42-source-coverage-reconciliation.md) | P42 — Source coverage reconciliation: routes, controls, API usage and backend endpoint gaps |
| P43 | [P43-frontend-middleware-bff-proxy-csp-hard-404s.md](03-ui-prompts/04-cross-portal-regression-platform/P43-frontend-middleware-bff-proxy-csp-hard-404s.md) | P43 — Frontend middleware, BFF route handlers, same-origin API proxy, CSP and hard 404s |
| P44 | [P44-debug-observability-diagnostics-and-secret-leakage.md](03-ui-prompts/04-cross-portal-regression-platform/P44-debug-observability-diagnostics-and-secret-leakage.md) | P44 — Debug panels, diagnostics, telemetry and secret/PII leakage sweep |
| P45 | [P45-known-regression-rerun-and-automated-test-parity.md](03-ui-prompts/04-cross-portal-regression-platform/P45-known-regression-rerun-and-automated-test-parity.md) | P45 — Known regression rerun and automated e2e parity sweep |
| P46 | [P46-demo-seed-fixtures-and-destructive-flow-readiness.md](03-ui-prompts/04-cross-portal-regression-platform/P46-demo-seed-fixtures-and-destructive-flow-readiness.md) | P46 — Demo seed fixtures, audit records and destructive-flow readiness |
| P47 | [P47-generated-documents-emails-exports-and-download-artifacts.md](03-ui-prompts/04-cross-portal-regression-platform/P47-generated-documents-emails-exports-and-download-artifacts.md) | P47 — Generated documents, emails, exports and downloadable artifacts |
| README.md | [README.md](03-ui-prompts/04-cross-portal-regression-platform/README.md) | Cross-portal/regression/platform UI prompts |

## Domain API/backend prompts

| ID | File | Title |
|---|---|---|
| A01 | [A01-auth--sessions--2fa--reset-tokens-and-portal-role-boundaries.md](04-api-prompts/01-domain-api/A01-auth--sessions--2fa--reset-tokens-and-portal-role-boundaries.md) | A01 — Auth, sessions, 2FA, reset tokens and portal role boundaries |
| A02 | [A02-users-self-service-profile--preferences--security--export-and-deletion.md](04-api-prompts/01-domain-api/A02-users-self-service-profile--preferences--security--export-and-deletion.md) | A02 — Users self-service profile, preferences, security, export and deletion |
| A03 | [A03-requests--service-catalogue-and-admin-request-triage-apis.md](04-api-prompts/01-domain-api/A03-requests--service-catalogue-and-admin-request-triage-apis.md) | A03 — Requests, service catalogue and admin request triage APIs |
| A04 | [A04-quotes--quote-documents--templates--line-items-and-schedules.md](04-api-prompts/01-domain-api/A04-quotes--quote-documents--templates--line-items-and-schedules.md) | A04 — Quotes, quote documents, templates, line items and schedules |
| A05 | [A05-projects--progress--milestones--deliverables-and-public-project-apis.md](04-api-prompts/01-domain-api/A05-projects--progress--milestones--deliverables-and-public-project-apis.md) | A05 — Projects, progress, milestones, deliverables and public project APIs |
| A06 | [A06-payments--invoices--payment-methods--offline-transfers--disputes-and-d.md](04-api-prompts/01-domain-api/A06-payments--invoices--payment-methods--offline-transfers--disputes-and-d.md) | A06 — Payments, invoices, payment methods, offline transfers, disputes and documents |
| A07 | [A07-messaging--chat-threads--moderation-and-websocket-events.md](04-api-prompts/01-domain-api/A07-messaging--chat-threads--moderation-and-websocket-events.md) | A07 — Messaging, chat threads, moderation and websocket events |
| A08 | [A08-notifications--preferences--push-subscriptions--templates-and-delivery.md](04-api-prompts/01-domain-api/A08-notifications--preferences--push-subscriptions--templates-and-delivery.md) | A08 — Notifications, preferences, push subscriptions, templates and delivery |
| A09 | [A09-media-uploads--chunking--sharing--public-share-and-admin-media.md](04-api-prompts/01-domain-api/A09-media-uploads--chunking--sharing--public-share-and-admin-media.md) | A09 — Media uploads, chunking, sharing, public share and admin media |
| A10 | [A10-blog--comments--taxonomy--portfolio--contact-and-public-content-apis.md](04-api-prompts/01-domain-api/A10-blog--comments--taxonomy--portfolio--contact-and-public-content-apis.md) | A10 — Blog, comments, taxonomy, portfolio, contact and public content APIs |
| A11 | [A11-admin-dashboard--analytics--audit--reports--health-and-system-operatio.md](04-api-prompts/01-domain-api/A11-admin-dashboard--analytics--audit--reports--health-and-system-operatio.md) | A11 — Admin dashboard, analytics, audit, reports, health and system operations |
| A12 | [A12-admin-users--roles--sessions--password-reset--export--restore-and-impe.md](04-api-prompts/01-domain-api/A12-admin-users--roles--sessions--password-reset--export--restore-and-impe.md) | A12 — Admin users, roles, sessions, password reset, export, restore and impersonation APIs |
| A13 | [A13-admin-domain-operations--requests--quotes--projects--progress--service.md](04-api-prompts/01-domain-api/A13-admin-domain-operations--requests--quotes--projects--progress--service.md) | A13 — Admin domain operations: requests, quotes, projects, progress, service packages and time entries |
| A14 | [A14-admin-payments--disputes--accounts--legal-profiles--reconciliation-and.md](04-api-prompts/01-domain-api/A14-admin-payments--disputes--accounts--legal-profiles--reconciliation-and.md) | A14 — Admin payments, disputes, accounts, legal profiles, reconciliation and revenue APIs |
| A15 | [A15-admin-messaging--moderation--notifications--media-content-portfolio-an.md](04-api-prompts/01-domain-api/A15-admin-messaging--moderation--notifications--media-content-portfolio-an.md) | A15 — Admin messaging, moderation, notifications, media/content/portfolio and integrations APIs |
| A16 | [A16-health--inbound-webhooks--workers--websocket-gateway-and-deployment-sm.md](04-api-prompts/01-domain-api/A16-health--inbound-webhooks--workers--websocket-gateway-and-deployment-sm.md) | A16 — Health, inbound webhooks, workers, websocket gateway and deployment smoke |
| README.md | [README.md](04-api-prompts/01-domain-api/README.md) | Domain API/backend prompts |

## Platform/backend deep prompts

| ID | File | Title |
|---|---|---|
| A17 | [A17-frontend-bff-same-origin-proxy-auth-cookies-and-csp-contracts.md](04-api-prompts/02-platform-backend/A17-frontend-bff-same-origin-proxy-auth-cookies-and-csp-contracts.md) | A17 — Frontend BFF, same-origin proxy, auth cookies and CSP contracts |
| A18 | [A18-backend-cross-cutting-platform-contracts-security-cache-idempotency.md](04-api-prompts/02-platform-backend/A18-backend-cross-cutting-platform-contracts-security-cache-idempotency.md) | A18 — Backend cross-cutting platform contracts: security, cache, idempotency, validation and errors |
| A19 | [A19-workers-outbox-documents-email-notification-media-export-and-webhook-side-effects.md](04-api-prompts/02-platform-backend/A19-workers-outbox-documents-email-notification-media-export-and-webhook-side-effects.md) | A19 — Workers, outbox, documents, email, notification, media, export and webhook side effects |
| A20 | [A20-demo-seed-data-scripts-and-fixture-readiness.md](04-api-prompts/02-platform-backend/A20-demo-seed-data-scripts-and-fixture-readiness.md) | A20 — Demo seed data, scripts and fixture readiness |
| README.md | [README.md](04-api-prompts/02-platform-backend/README.md) | Platform/backend deep prompts |

## Security prompts

| ID | File | Title |
|---|---|---|
| 00 | [00-SECURITY-RUNBOOK.md](06-security-prompts/00-SECURITY-RUNBOOK.md) | Security Runbook — Authorized defensive testing only |
| README.md | [README.md](06-security-prompts/README.md) | Security prompts |
| S01 | [S01-threat-model-and-attack-surface.md](06-security-prompts/S01-threat-model-and-attack-surface.md) | S01 — Threat model and application attack-surface mapping |
| S02 | [S02-auth-session-access-control-and-idor.md](06-security-prompts/S02-auth-session-access-control-and-idor.md) | S02 — Authentication, session security, access control and IDOR |
| S03 | [S03-input-validation-injection-xss-csrf-and-open-redirect.md](06-security-prompts/S03-input-validation-injection-xss-csrf-and-open-redirect.md) | S03 — Input validation, injection, XSS, CSRF and open redirect testing |
| S04 | [S04-api-abuse-rate-limit-replay-and-business-logic.md](06-security-prompts/S04-api-abuse-rate-limit-replay-and-business-logic.md) | S04 — API abuse, rate limits, replay, idempotency and business-logic security |
| S05 | [S05-file-upload-media-document-and-export-security.md](06-security-prompts/S05-file-upload-media-document-and-export-security.md) | S05 — File upload, media, document and export security |
| S06 | [S06-payments-webhooks-and-financial-fraud-security.md](06-security-prompts/S06-payments-webhooks-and-financial-fraud-security.md) | S06 — Payments, webhooks and financial-fraud security |
| S07 | [S07-data-privacy-pii-secrets-logging-and-debug-leakage.md](06-security-prompts/S07-data-privacy-pii-secrets-logging-and-debug-leakage.md) | S07 — Data privacy, PII, secrets, logging and debug leakage |
| S08 | [S08-browser-platform-security-headers-csp-cors-cache.md](06-security-prompts/S08-browser-platform-security-headers-csp-cors-cache.md) | S08 — Browser/platform security: headers, CSP, CORS, cache and redirects |
| S09 | [S09-realtime-messaging-notification-and-content-abuse-security.md](06-security-prompts/S09-realtime-messaging-notification-and-content-abuse-security.md) | S09 — Realtime, messaging, notification and content-abuse security |
| S10 | [S10-integrations-webhook-ssrf-and-outbound-security.md](06-security-prompts/S10-integrations-webhook-ssrf-and-outbound-security.md) | S10 — Integrations, webhook SSRF and outbound-delivery security |
| S11 | [S11-admin-system-operations-supply-chain-and-config-security.md](06-security-prompts/S11-admin-system-operations-supply-chain-and-config-security.md) | S11 — Admin system operations, supply-chain and configuration security |
| S12 | [S12-ai-era-prompt-injection-and-untrusted-content-resilience.md](06-security-prompts/S12-ai-era-prompt-injection-and-untrusted-content-resilience.md) | S12 — AI-era prompt-injection and untrusted-content resilience |
