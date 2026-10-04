# S01 — Threat model and application attack-surface mapping

**Priority:** P0  
**Role:** Security lead / application architect  
**Scope:** Build the security map before running deeper tests.

## Source anchors

- `00-start-here/00-SOURCE-UNDERSTANDING.md`
- `02-source-inventories/frontend-route-map.md`
- `02-source-inventories/frontend-special-route-handlers-and-middleware.md`
- `02-source-inventories/openapi-operations-by-tag.md`
- `02-source-inventories/backend-controller-endpoints.md`
- `02-source-inventories/source-regression-markers-inventory.md`
- Existing prompts P01–P47 and A01–A20.

## Mandatory tasks

1. Build a trust-boundary map: browser apps, BFF route handlers, API gateway, services, workers, DB, object storage, queues, Redis/cache, payment provider, email/push/webhook sinks.
2. Build an attacker-role matrix: anonymous, unverified user, verified client, suspended client, wrong-portal client, admin/operator, lower-privilege operator, impersonating operator, webhook provider, compromised integration endpoint.
3. Inventory high-value assets: tokens/cookies, sessions, OTP/reset links, PII, requests/quotes/projects, invoices/receipts, payments/refunds/disputes, media/private files, generated PDFs, audit logs, templates, webhooks, feature flags and system operations.
4. Rank attack surfaces by exposure and impact: public pages/forms, auth, same-origin proxy, BFF auth, admin console, payments, webhooks, uploads, generated docs, messaging/notifications, integrations and workers.
5. Map every P##/A## prompt to at least one security checklist area from `00-SECURITY-RUNBOOK.md`.
6. Identify missing security fixtures: second client account, suspended account, lower-privilege admin, test webhook sink, private media, malicious upload samples, low-value test payment, expired/tampered document token.

## Abuse cases to include

- Account takeover and session replay.
- Horizontal IDOR between clients.
- Admin privilege escalation.
- Stored/reflected XSS through content, messages, templates, notifications, filenames and PDF/email generation.
- CSRF on mutating routes.
- SSRF/open redirect through integrations/webhooks/URLs.
- Payment amount/order/signature tampering.
- Webhook replay/forgery.
- Unsafe file upload and private file disclosure.
- Debug/log/telemetry secret leakage.
- Worker retry duplication.

## Output

```markdown
# Result — S01 Threat model

## Trust-boundary diagram/table
| Component | Inputs | Outputs | Trust boundary | Security concerns |
|---|---|---|---|---|

## Attacker-role matrix
| Role | Access level | Main abuse goals | Prompts covering it |
|---|---|---|---|

## Top risks
| Rank | Risk | Impact | Likelihood | Owner prompts | Required fixture |
|---|---|---|---|---|---|
```
