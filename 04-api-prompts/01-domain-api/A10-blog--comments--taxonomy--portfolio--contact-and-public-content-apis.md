# A10 — Blog, comments, taxonomy, portfolio, contact and public content APIs

**Priority:** P1  
**Execution:** Direct API/backend contract testing via **`curl`**. Use Playwright CLI only for any required page/origin checks. Do not use browser MCP / Chrome DevTools MCP / browser-use. Use demo/prod data only.  
**Scope:** Public/content APIs and admin CMS APIs

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **Direct API / backend / BFF endpoint checks:** use **`curl`** (cookie jar / `-H` auth as needed) against `https://api.nestlancer.com/api/v1` or the portal same-origin `{portal}/api/v1/*` / `/api/auth/*` paths this prompt covers. Record method, path, status, request id/correlation id, latency, and redacted envelope keys.
- **Frontend page / browser-origin checks** (when this prompt requires a page, redirect, CSP, or cookie-visible UI): use **Playwright CLI** only.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## 1. Source and contract references
- openapi tags: blog/admin blog/comment/taxonomy, portfolio/public/admin, contact/public/admin
- services/blog, services/portfolio, services/contact controllers

## 2. Endpoint groups to cover
- public blog posts/search/detail/related/engagement/view/comments/like/bookmark/categories/tags/authors/feeds
- admin posts CRUD/publish/unpublish/feature/archive/pin/revisions/import/export/settings
- admin comments approve/reject/spam/reply/delete/pin
- taxonomy categories/tags/merge/authors
- public portfolio list/search/featured/categories/tags/detail/view/like
- admin portfolio CRUD/publish/unpublish/media/categories/reorder/analytics
- contact submit/admin respond/status/spam/delete

## 3. Required setup / fixtures
- demo post/comment/category/tag
- demo portfolio item/media
- demo contact inquiry

## 4. Mandatory tests
1. Public blog listing/search/detail/feed and auth-gated bookmarks/comments.
2. Comment moderation lifecycle and public visibility.
3. Admin post editor lifecycle including revisions/schedule/export/import if supported.
4. Taxonomy CRUD/merge.
5. Portfolio publish/unpublish/media/category/reorder/public parity.
6. Contact submit → admin status/respond/spam/delete.

## 5. Negative and abuse probes
- XSS markdown/comment.
- Draft content publicly visible.
- Duplicate slug.
- Delete taxonomy with content.
- Contact enumeration/spam flood.

## 6. Cross-check with UI prompts
- P02 public content
- P21 contact
- P36 content CMS
- P37 portfolio CMS

## 7. Evidence to capture
- Request method/path, status, request id/correlation id, latency and response envelope shape.
- Request/response keys only for sensitive data; redact tokens, passwords, cookies, OTPs, reset links and PII values.
- Before/after state for every mutation.
- Audit/outbox/notification/document side effects where relevant.
- Any OpenAPI/controller mismatch.

## 8. Output format

```markdown
# Result — A10 — Blog, comments, taxonomy, portfolio, contact and public content APIs

## Summary
- Environment:
- Tooling (`curl` for API / Playwright CLI for pages):
- Accounts/fixtures:
- Endpoint groups covered:
- Highest severity:

## Endpoint coverage
| Method + path | Scenario | Status | Verdict | Evidence |
|---|---|---|---|---|

## Contract drift
| Endpoint | OpenAPI says | Runtime/source says | Severity |
|---|---|---|---|

## Bugs
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

