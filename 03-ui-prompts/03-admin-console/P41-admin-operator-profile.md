# P41 — Admin operator profile and self-account surface

**Priority:** P1  
**Primary role:** operator/admin  
**Scope:** Dedicated `/profile` admin page and user-menu entry, separate from managed user detail

## 0. Demo-production mode for this prompt

This suite is intended for a production-like app with demo data. Execute create/update/delete/session actions only when the target is the signed-in demo operator account and the operator approves. Never expose tokens/cookies/password values.

## 1. Source-code anchors to read before browser testing

### Frontend
- `apps/admin/src/app/(dashboard)/profile/page.tsx`
- `apps/admin/src/features/profile/OperatorProfileClient.tsx`
- `apps/admin/src/components/admin/AdminUserMenu.tsx`
- `apps/admin/src/app/(dashboard)/AdminConsoleLayout.tsx`
- `packages/auth/src/AuthProvider.tsx`

### Backend / API surfaces expected in browser Network
- Signed-in profile: `GET /api/v1/users/profile`
- Logout/refresh as used by the admin user menu
- If quick links open other pages: dashboard/system/audit requests from those pages only

## 2. Routes / surfaces to walk
- admin `/profile`
- admin user menu entry that opens `/profile`
- quick links on profile: `/dashboard`, `/system`, `/audit`

## 3. What this prompt must prove
- The admin operator profile page is not skipped just because it is small/read-only.
- It displays the signed-in operator identity accurately and does not leak client-only profile controls.
- Quick links and audited-session copy are correct.

## 4. Mandatory browser walk
1. Open `/profile` from the admin user menu, not only by URL.
2. Record displayed avatar/initials, name, email, role/copy, and “Enterprise operator access. Session activity is audited.” text.
3. Click Dashboard, System configuration, and Audit logs quick links; verify each route opens and browser back returns correctly.
4. Confirm the page has no misleading editable profile/password controls; if it claims profile fields are managed through client account APIs, follow the path where that actually happens or record the gap.
5. Compare the displayed operator identity with the sidebar identity chip and `/users/[id]` if the operator user can be found safely.
6. Verify 375px layout, keyboard traversal, focus ring, and screen-reader names on icon buttons/links.
7. Logout from the user menu and verify `/profile` is guarded afterward.

## 5. Controls and page-in-page units that must be inventoried
- User menu → Profile
- Dashboard quick link
- System configuration quick link
- Audit logs quick link
- Logout from user menu
- Any profile/account link that appears in future builds

## 6. Data and safety fences
Read-only except optional logout. Do not change the shared admin password or 2FA from this page.

## 7. Required evidence
- `/profile` screenshot at 1440 and 375.
- User menu screenshot showing the profile entry.
- Network row for profile bootstrap request.
- Console errors/warnings.
- Keyboard traversal notes.

## 8. Edge states / negative probes
- Visit `/profile` while logged out.
- Force refresh with expired token.
- Open `/profile` in mobile drawer mode.
- Compare with a managed user detail page so the two surfaces are not confused.

## 9. Defects this prompt is designed to catch
- Admin profile route omitted from coverage.
- Operator identity mismatch between sidebar/user menu/profile.
- Profile page promises account management but has no reachable path.
- Quick links point to removed or unauthorized pages.

## 10. Output format for this prompt

```markdown
# Result — P41 — Admin operator profile and self-account surface

## Session summary
- Host/environment:
- Operator account:
- Routes walked:

## Coverage table
| Unit | Route/subsurface | Status | Evidence | Notes |
|---|---|---|---|---|

## Bugs / gaps
...
```

## Security addendum — mandatory for this prompt

Run the relevant checks from [`00-SECURITY-RUNBOOK.md`](../../06-security-prompts/00-SECURITY-RUNBOOK.md) before closing this prompt.

At minimum, while executing this UI prompt verify:
- Protected UI/API calls are not accessible anonymously or by the wrong role.
- Demo user A cannot view or mutate demo user B objects by changing IDs, URLs, filters or request bodies.
- All text/query/file/template fields safely handle malicious-looking input without XSS, open redirect, path traversal, stack traces or debug leakage.
- Mutating controls are resistant to CSRF/clickjacking assumptions and have correct confirmation/audit behavior.
- Browser storage, console output, debug panels, generated artifacts and network responses do not leak tokens, cookies, OTPs, reset links, private URLs, provider secrets or unnecessary PII.
- If this prompt touches payments, webhooks, media, documents, messaging, notifications, exports or system operations, also run the matching `S##` security prompt from `06-security-prompts/`.

Add a `Security findings` section to the prompt result using the security runbook output template. Stop and escalate P0 for auth bypass, cross-user data, token leakage, stored XSS, duplicate charge, unsigned webhook acceptance, unsafe webhook target acceptance or impersonation attribution failure.

