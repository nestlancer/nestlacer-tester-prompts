# S07 — Data privacy, PII, secrets, logging and debug leakage

**Priority:** P0  
**Role:** Privacy/security auditor  
**Scope:** PII, secrets, diagnostics, debug panels, logs, exports, telemetry, emails and support evidence.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **API / auth / webhook / contract probes:** use **`curl`** against `https://api.nestlancer.com/api/v1` (and portal same-origin `/api/v1/*` or `/api/auth/*` when testing BFF/CORS/cookie behavior).
- **UI / page / header / CSP / storage checks:** use **Playwright CLI** only.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## Pair with existing prompts

- P14, P15, P30, P31, P35, P44, P46, P47
- A02, A08, A11, A12, A17, A18, A19, A20

## Mandatory checks

1. Inspect admin debug panels and health-debug outputs for secrets, tokens, cookies, connection strings, provider keys, reset links and private URLs.
2. Inspect browser console, network responses, local/session storage and downloaded artifacts for sensitive data leakage.
3. Verify user exports/account deletion/data retention flows only include authorized data.
4. Verify audit logs contain enough actor/action/target/request ID details without storing sensitive secrets.
5. Verify email/notification templates never expose tokens directly except intended one-time links, and reports redact those links.
6. Verify error envelopes/logs do not leak stack traces, SQL, Prisma, infrastructure hostnames or internal service credentials.
7. Verify impersonation logs show original operator and target user.
8. Verify support/admin views mask payment refs, private URLs and user PII where not needed.
9. Verify public pages, share links and document verification do not leak private profile/payment/media data.

## Output

```markdown
# Result — S07 Data privacy/secrets/logging/debug leakage

## Leakage ledger
| Surface | Sensitive class checked | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|---|

## Privacy/access ledger
| Data type | Authorized role | Unauthorized role tested | Verdict | Evidence |
|---|---|---|---|---|

## Findings
...
```
