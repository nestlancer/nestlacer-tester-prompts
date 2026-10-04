# S08 — Browser/platform security: headers, CSP, CORS, cache and redirects

**Priority:** P1  
**Role:** Platform security QA  
**Scope:** Frontend apps, middleware, BFF/proxy, headers, CORS, cache behavior and redirects.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Pair with existing prompts

- P01, P02, P17, P40, P43, P44, P45
- A17, A18

## Mandatory checks

1. Verify CSP, nonce, frame protections, MIME sniffing, referrer policy, HSTS/secure transport and cache headers on representative public/protected/error/redirect/404 routes.
2. Verify CSP nonce survives normal pages, middleware redirects, hard-404 rewrites and terminal responses.
3. Verify CORS preflight/credential behavior for allowed and disallowed origins.
4. Verify landing redirects preserve path/search and cannot become open redirects.
5. Verify BFF/proxy responses strip hop-by-hop headers and do not recurse to same host.
6. Verify public cache does not cache private/authenticated data and authenticated pages do not leak via browser/proxy cache.
7. Verify stale public cache can be busted after seed/content updates.
8. Verify robots/sitemap/feed endpoints expose only intended public URLs.
9. Verify `localhost`, `127.0.0.1`, `dev-api` and internal hostnames are not called by production browser code.

## Output

```markdown
# Result — S08 Browser/platform security

## Header/CSP/CORS ledger
| Route/origin | Header/control | Expected | Actual | Verdict |
|---|---|---|---|---|

## Redirect/cache/proxy ledger
| Surface | Scenario | Expected | Actual | Verdict |
|---|---|---|---|---|

## Findings
...
```
