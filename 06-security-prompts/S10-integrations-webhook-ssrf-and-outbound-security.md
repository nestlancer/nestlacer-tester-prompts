# S10 — Integrations, webhook SSRF and outbound-delivery security

**Priority:** P0  
**Role:** Integration security auditor  
**Scope:** Admin integrations, outgoing webhooks, inbound webhooks, URL validation, DNS/private-network safety and retry behavior.

## Pair with existing prompts

- P35, P38, P43, P44, P45, P46
- A15, A16, A17, A18, A19, A20

## Mandatory checks

1. Verify webhook target URL validation rejects loopback, link-local, private IP ranges, metadata endpoints, localhost aliases, invalid schemes and credentials-in-URL.
2. Verify DNS rebinding/private resolution is rechecked at delivery time, not only at save time.
3. Verify enable/disable/delete/test webhook operations require admin permissions and explicit confirmations.
4. Verify webhook secrets are generated/stored/rotated safely and never printed in debug/logs/UI after creation.
5. Verify outgoing webhook signing and delivery retries to demo sink.
6. Verify inbound provider webhooks require signatures and idempotency.
7. Verify malformed provider payloads fail safely without 500 stack traces or partial state changes.
8. Verify integrations cannot be used as generic internal network scanners through timing/error messages.
9. Verify `/api-keys` alias to integrations does not expose unfinished key-management controls.

## Output

```markdown
# Result — S10 Integrations/webhook SSRF/outbound security

## URL safety ledger
| URL class | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|

## Webhook security ledger
| Flow | Signature/secret/retry/idempotency check | Verdict | Evidence |
|---|---|---|---|

## Findings
...
```
