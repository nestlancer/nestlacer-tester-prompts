# S09 — Realtime, messaging, notification and content-abuse security

**Priority:** P1  
**Role:** Realtime/content-abuse security QA  
**Scope:** WebSockets, messages, notifications, broadcasts, comments, moderation and user-generated content.

**Target hosts:** `https://nestlancer.com` · `https://app.nestlancer.com` · `https://admin.nestlancer.com` · `https://api.nestlancer.com`
**API base URL:** `https://api.nestlancer.com/api/v1`
**Mode:** public-domain only — do not call localhost, Docker IPs, or microservice host ports.
**Accounts:** see [`DEMO-ACCOUNTS.md`](../00-start-here/DEMO-ACCOUNTS.md)

## Pair with existing prompts

- P04, P13, P14, P19, P33, P34, P36, P45
- A07, A08, A10, A15, A16, A18, A19

## Mandatory checks

1. Verify WebSocket auth does not put JWTs in query strings and rejects missing/wrong-role/stale tokens.
2. Verify clients can subscribe only to their own project/message/notification rooms.
3. Verify message edit/delete/pin/read/unread events enforce ownership and role rules.
4. Verify message/comment/notification/broadcast content is sanitized on render, email, PDF and push/websocket delivery.
5. Verify unread counts cannot be inflated by orphan/inaccessible messages.
6. Verify notification preferences and preference gate are honored for email/push/in-app where applicable.
7. Verify broadcast/segment sends require admin permission, confirmation and demo recipient scope during testing.
8. Verify moderation flags/reports cannot reveal private threads or escalate privileges.
9. Verify rate limits/anti-spam controls for messages, comments, contact and notification send paths.
10. Verify realtime reconnect/resubscribe does not leak events from previous impersonated/user sessions.

## Output

```markdown
# Result — S09 Realtime/messaging/notification/content abuse security

## Realtime auth ledger
| Event/room | Role | Expected | Actual | Verdict | Evidence |
|---|---|---|---|---|---|

## Content-abuse ledger
| Surface | Abuse class | Expected | Actual | Verdict |
|---|---|---|---|---|

## Findings
...
```
