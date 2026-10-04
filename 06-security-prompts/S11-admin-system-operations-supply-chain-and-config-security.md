# S11 — Admin system operations, supply-chain and configuration security

**Priority:** P1  
**Role:** Ops/security auditor  
**Scope:** System console, feature flags, templates, jobs, queues, env/config, dependency/supply-chain hygiene and deployment hardening.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Pair with existing prompts

- P35, P40, P44, P45, P46
- A11, A16, A18, A19, A20

## Mandatory checks

1. Verify `/system` tabs require admin/operator permission and expose no secrets in health/debug/jobs/templates/operations.
2. Verify feature flags/system config/template changes require confirmations/audit logs and cannot be changed by clients/lower-privilege users.
3. Verify job/queue controls cannot trigger unsafe broad operations on non-demo data during testing.
4. Verify email and notification template preview escapes variables and blocks unsafe HTML/scripts where required.
5. Verify environment configuration rejects production builds pointing at dev/localhost APIs or unsafe origins.
6. Review dependency/build configuration for known high-risk anti-patterns: committed secrets, permissive CORS, public source maps with secrets, debug flags enabled in production, insecure cookies, missing lockfile discipline.
7. Verify seed/reset scripts have production guardrails and do not print credentials.
8. Verify logs and telemetry are structured, redacted and have request IDs.
9. Verify backup/export/admin-operation outputs are scoped, expiring and access-controlled.

## Output

```markdown
# Result — S11 Admin/system/supply-chain/config security

## System security ledger
| Surface | Control | Expected | Actual | Verdict |
|---|---|---|---|---|

## Config/supply-chain review
| Area | Check | Verdict | Evidence/fix |
|---|---|---|---|

## Findings
...
```
