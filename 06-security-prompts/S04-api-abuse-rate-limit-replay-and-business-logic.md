# S04 — API abuse, rate limits, replay, idempotency and business-logic security

**Priority:** P0  
**Role:** Backend security QA  
**Scope:** Direct API abuse resistance without production DoS.

## Pair with existing prompts

- P12, P23, P24, P26, P27, P28, P35, P39, P45, P46
- A03, A04, A05, A06, A11, A13, A14, A16, A18, A19, A20

## Mandatory checks

1. Verify throttles on login, refresh, OTP/2FA, forgot password, resend verification, contact, comments, uploads, search, checkout, webhooks and notification send/broadcast.
2. Repeat critical mutation requests on demo records to verify idempotency: quote send/resend, accept/decline, project creation, milestone complete/approve, payment create/confirm, refund, dispute, document generation, notification broadcast and webhook processing.
3. Simulate browser double-click/race on request-to-quote, quote send, payment create, milestone approval and media operations.
4. Test state-machine bypass attempts: invalid status transitions, stale version/update after state changed, client forcing admin-only transitions, reopening terminal states without allowed operation.
5. Test amount/currency/quantity/discount/tax tampering on quote/payment APIs using demo data.
6. Test pagination and export limits: max limits, huge offsets, wide date ranges, broad filters and repeated export requests.
7. Verify rate-limit responses are safe and do not leak internals; legitimate retries recover.
8. Verify all high-risk operations have audit/outbox/event logs.

## Safety boundaries

Do not run high-volume load tests. Use small, bounded bursts sufficient to prove throttling/replay behavior.

## Output

```markdown
# Result — S04 API abuse/rate-limit/replay/business logic

## Abuse ledger
| Endpoint/action | Abuse pattern | Expected control | Actual | Verdict | Evidence |
|---|---|---|---|---|---|

## Idempotency/race ledger
| Operation | Repeat/race pattern | Before | After | Verdict |
|---|---|---|---|---|

## Findings
...
```
