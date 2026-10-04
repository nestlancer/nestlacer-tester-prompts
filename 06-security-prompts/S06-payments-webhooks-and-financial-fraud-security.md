# S06 — Payments, webhooks and financial-fraud security

**Priority:** P0  
**Role:** Payments security QA  
**Scope:** Checkout, Razorpay/order verification, manual/offline payments, refunds, disputes, reconciliation, payment documents and webhooks.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Pair with existing prompts

- P12, P27, P28, P35, P39, P43, P45, P47
- A06, A14, A16, A17, A18, A19

## Mandatory checks

1. Use test-mode/low-value demo payments only; never real cards or real settlement changes.
2. Verify checkout order amount/currency/project/milestone cannot be changed client-side before confirmation.
3. Verify Razorpay signature/order/payment IDs are validated server-side and reused orders with different amounts are rejected.
4. Verify duplicate payment creation/completion/refund/dispute/reconciliation attempts are idempotent.
5. Verify client cannot mark payment as completed/disputed/refunded through unauthorized status changes.
6. Verify manual/offline payment entry requires admin permission, audit notes and correct ledger/document side effects.
7. Verify disputes remain visible in revenue/stats according to business rules until refund/settlement rules apply.
8. Verify webhooks go only to gateway `/api/v1/webhooks/razorpay`; web Next route `/api/webhooks/razorpay` refuses acknowledgement.
9. Verify signed webhook payloads, replay detection, disabled provider behavior and event-to-state transitions.
10. Verify payment documents and notifications contain correct totals and no internal refs/secrets.

## Output

```markdown
# Result — S06 Payments/webhooks/financial fraud security

## Payment security ledger
| Scenario | Expected control | Actual | Verdict | Evidence |
|---|---|---|---|---|

## Webhook ledger
| Event | Signature/replay case | Expected | Actual | Verdict |
|---|---|---|---|---|

## Findings
...
```
