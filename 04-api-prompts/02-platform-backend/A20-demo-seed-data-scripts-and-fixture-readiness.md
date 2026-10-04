# A20 — Demo seed data, scripts and fixture readiness

**Priority:** P0  
**Execution:** Direct backend/seed/API validation is allowed for this `A##` prompt. Use demo/prod data only.  
**Scope:** Seed payloads, demo scenario coverage, fixture creation and safe destructive-test readiness.

**API base URL:** `https://api.nestlancer.com/api/v1`
**Browser origins:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md)

## 1. Source and contract references

- `seed/README.md`
- `seed/seed.sh`
- `seed/phases/*.py`
- `seed/demo/admin-client-data-complete-flow.md`
- `seed/demo/scripts/create_accounts.py`
- `seed/demo/scripts/seed_scenarios.py`
- `seed/demo/scripts/seed_audit_demo.py`
- `seed/demo/scripts/cohort_definitions.py`
- `seed/payloads/core/*.json`
- `seed/payloads/commerce/*.json`
- `seed/payloads/blogs/blogs.json`
- `seed/payloads/portfolio/items.json`
- `seed/payloads/demo/accounts/index.json`
- `seed/payloads/demo/scenarios/index.json`
- `seed/reset/**`
- `seed/bust-http-cache.sh`
- Prisma schemas under `prisma/schema/**`

## 2. Seed/fixture groups to cover

### Public-domain path (default for external LLM)
- Prove fixtures via portals + `https://api.nestlancer.com/api/v1` list endpoints using [`DEMO-ACCOUNTS.md`](../../00-start-here/DEMO-ACCOUNTS.md).
- Catalog counts: blogs/portfolio/templates/flags/packages/accounts visible over HTTPS.
- Demo clients (15) + admin login/work-object smoke.
- AUDIT-* fixture creation via UI/API only.

### Operator / local-lab path (mark BLOCKED if unavailable)
- Environment detection and guardrails: Infisical env, database name, S3 bucket names (never print secrets). Docker/direct microservice URLs are **local-lab only**.
- Phases: reset, core, blogs, portfolio, content, demo, legacy `prod-data/run-seed.sh` forwarding.
- Core/commerce/public/demo payload files under `seed/payloads/**`.
- Demo asset generation, media upload linkage, idempotency ledger, cache busting scripts.

## 3. Required setup / fixtures

- **Public-domain:** API list endpoints + demo/admin credentials from DEMO-ACCOUNTS.md.
- **Operator-only:** Read-only DB/MinIO/Redis/shell seed access if validating storage/cache internals.
- Explicit operator approval before any reset/demo seeding against prod (`--confirm-prod`).
- Mail sink usually unavailable (outbound email suppressed) — mark email-content checks BLOCKED.

## 4. Mandatory tests

1. **Environment guardrails**
   - Identify target env from safe metadata without printing secrets.
   - Verify production database/bucket naming is recognized.
   - Confirm `--env=prod` rejects `reset` and `demo` unless `--confirm-prod` is supplied.
   - Confirm reset is not run unless explicitly requested.
2. **Core/content seed completeness**
   - Validate expected counts from seed docs where accessible:
     - 4 blog categories
     - 6 blog tags
     - 110 published posts
     - 4 portfolio categories
     - 8 published portfolio items
     - 10 email templates
     - 12 feature flags
     - 52 notification templates
     - 7 quote blocks
     - 1 service package
   - Verify platform payment accounts and company legal profiles are present or record provisioning gap.
3. **Public content linkage**
   - Confirm blog/portfolio images are uploaded, public pages show content and cache is not stale-empty.
   - If stale, run/document cache-bust procedure in controlled environment.
4. **Demo account coverage**
   - Inventory demo accounts by role/state/cohort without printing passwords.
   - Verify accounts cover unverified, verified, 2FA, disabled/suspended, VIP/tier-discount, active project, unpaid/overdue/payment, media/message/notification cases.
5. **Scenario coverage**
   - Validate demo scenarios include requests, quotes, projects, milestones, deliverables, invoices, payments, messages, notifications, media, audit and webhooks if expected.
   - Map each scenario to prompts P01–P47 and A01–A20.
6. **Idempotent rerun behavior**
   - In a controlled dev/demo environment, rerun safe phases and verify no duplicate slugs/templates/accounts/documents beyond expected ledger behavior.
   - Verify portfolio thumbnails upload again only when missing/hash changed.
7. **Demo destructive readiness**
   - Create a fresh `AUDIT-<PROMPT-ID>-<YYYYMMDD>-<n>` fixture through UI/API and verify it can be mutated/archived/deleted safely.
   - Confirm audit logs/outbox/notifications are created for fixture mutations.
8. **Storage/cache pairing**
   - Verify media DB records match object storage for seeded/admin/demo media.
   - Verify deleted/replaced media has expected object and cache state.
9. **Failure recovery**
   - Simulate or inspect failed seed step behavior: partial phase, missing MinIO/S3, API login failure, duplicate slug, stale cache.
   - Confirm scripts fail loudly and/or are safe to rerun.

## 5. Negative and abuse probes

- Attempt prod reset/demo phase without `--confirm-prod`; must refuse.
- Seed with wrong/missing `.env.infisical`; must surface safe error without printing secrets.
- Duplicate blog/portfolio slug and duplicate demo email.
- Invalid media asset path/hash.
- Missing admin login; bootstrap path creates first admin only as documented.
- Cache contains stale empty public payload after reseed.

## 6. Cross-check with UI prompts

- P46 fixture readiness is the browser/UI twin of this API/seed prompt.
- P01/P02/P36/P37 public content and CMS.
- P03/P18 auth accounts.
- P39 end-to-end workflows.
- P47 artifacts/emails/exports.
- A18 cross-cutting platform contracts.
- A19 workers/outbox side effects.

## 7. Evidence to capture

- Environment name/metadata with secrets redacted.
- Count table by seed category.
- Demo scenario mapping table.
- Script command and exit status for any seed command actually run; omit secrets/passwords.
- Cache-bust evidence if run.
- Before/after for idempotent rerun and audit fixture creation.

## 8. Output format

```markdown
# Result — A20 — Demo seed data and fixture readiness

## Summary
- Environment:
- Phases inspected/run:
- Highest severity:

## Seed completeness
| Category | Expected | Observed | Source/API used | Verdict |
|---|---:|---:|---|---|

## Demo scenario prompt mapping
| Prompt/API prompt | Fixture/scenario | Existing? | Created? | Status |
|---|---|---|---|---|

## Guardrail checks
| Guardrail | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|

## Missing fixtures / seed fixes
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

