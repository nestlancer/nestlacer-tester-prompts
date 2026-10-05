# S02 — Authentication, session security, access control and IDOR

**Priority:** P0  
**Role:** Security QA / identity auditor  
**Scope:** Auth, account recovery, session lifecycle, role boundaries, object ownership and impersonation.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Tooling (required)

- **API / auth / webhook / contract probes:** use **`curl`** against `https://api.nestlancer.com/api/v1` (and portal same-origin `/api/v1/*` or `/api/auth/*` when testing BFF/CORS/cookie behavior).
- **UI / page / header / CSP / storage checks:** use **Playwright CLI** only.
- **Do not use** Cursor browser MCP, Chrome DevTools MCP, browser-use agents, or other heavy interactive browser MCP stacks for this suite.

## Pair with existing prompts

- P03, P15, P18, P30, P31, P43, P45
- A01, A02, A12, A17, A18

## Mandatory checks

1. Test protected pages/API as anonymous, client, wrong-portal client, suspended client, admin and impersonated admin.
2. Verify login errors do not leak account existence, password correctness or 2FA state beyond intended UX.
3. Test password reset and email verification tokens: missing, malformed, expired, reused, wrong user, tampered query and already-used token.
4. Test 2FA setup/verify/disable and backup code behavior using disposable demo accounts.
5. Verify refresh token rotation, concurrent refresh, stale cookie behavior, logout, logout-all and session revoke.
6. Verify cookies are HttpOnly/Secure/SameSite as appropriate and tokens are not in URL/localStorage/logs/debug panels.
7. Test horizontal IDOR by swapping IDs between two demo clients for requests, quotes, projects, payments, invoices, messages, media and profile endpoints.
8. Test vertical authorization: client calls admin routes; lower-privilege operator calls high-risk actions; admin route deep links without auth.
9. Test impersonation: start, handoff, use, stop, server grant revocation and audit attribution.
10. Verify deleted/suspended users cannot continue mutating data with stale sessions.

## Stop conditions

Escalate P0 for any protected object readable/writable by the wrong user, session that survives revoke when it should not, token leakage, or impersonation without operator attribution.

## Output

```markdown
# Result — S02 Auth/session/access-control/IDOR

## Matrix
| Scenario | Role/account | Surface | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|---|---|

## IDOR checks
| Object type | Owner A object | User B attempt | Expected | Actual | Verdict |
|---|---|---|---|---|---|

## Findings
...
```
