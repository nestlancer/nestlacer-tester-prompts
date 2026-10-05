# Demo accounts & public-domain fixtures

Use this ledger when running any `P##` / `A##` / `S##` prompt against **production domains** via an external LLM. Do **not** invent localhost, Docker IPs, or microservice host ports.

**Tooling:** Playwright CLI for frontend pages; `curl` for direct API endpoints. Do **not** use browser MCP / Chrome DevTools MCP / browser-use.

## Canonical hosts (required)

| Surface | Origin | Notes |
|---|---|---|
| Marketing / landing | `https://nestlancer.com` | Landing app |
| Client portal + app-host public | `https://app.nestlancer.com` | Web app (blog/portfolio/share live here too) |
| Admin console | `https://admin.nestlancer.com` | Admin app |
| API gateway | `https://api.nestlancer.com` | Paths under `/api/v1/*` |
| Browser same-origin API | `{portal}/api/v1/*` | Prefer for cookie/BFF/CORS checks |
| WebSocket | `https://api.nestlancer.com` (Socket.IO path `/ws/socket.io`) | Same gateway host; do not invent `:4100` |

**Forbidden for public-domain runs:** `localhost`, `127.0.0.1`, `host.docker.internal`, Docker bridge IPs, direct service ports (`:3001`–`:3016`, `:4000`, `:4100`, `:9000`, `:9100`–`:9120`) unless the operator marks the session as **local lab mode**.

Session preamble:

```text
Mode: public-domain [ ]  local-lab [ ]
Portals: nestlancer.com [ ]  app.nestlancer.com [ ]  admin.nestlancer.com [ ]  api.nestlancer.com [ ]
Actual origins if override: ______________________________
Accounts file used: 00-start-here/DEMO-ACCOUNTS.md
```

## Shared demo password

Seeded demo password for **admin and all client accounts**:

```text
Brick2@Build
```

Never paste tokens/cookies/OTPs/reset links into evidence. Password may appear in the preamble once as the known demo seed secret.

Outbound email is **suppressed** in demo seed (`suppressOutboundEmail: true`). Treat password-reset / verify-email / 2FA email **content** checks as **BLOCKED** unless an operator provides a mail sink. API status codes and UI flows can still be exercised.

## Admin

| Role | Email | Password | Use for |
|---|---|---|---|
| Admin / operator | `admin@nestlancer.com` | `Brick2@Build` | P18–P41, A11–A15, most S## |
| Ops alias (if present) | `ops@nestlancer.com` | same if seeded | Optional ops checks |

## Client demo accounts (15)

| seedKey | Name | Email | Typical use |
|---|---|---|---|
| `arjun-mehta` | Arjun Mehta | `arjun.mehta@nestlancer.com` | Primary client A; wholesale / active project |
| `samira-patel` | Samira Patel | `samira.patel@nestlancer.com` | Marketing / creative project |
| `rahul-desai` | Rahul Desai | `rahul.desai@nestlancer.com` | Logistics / ops; cross-user B for IDOR |
| `ananya-iyer` | Ananya Iyer | `ananya.iyer@nestlancer.com` | Fintech / engineering |
| `priya-nair` | Priya Nair | `priya.nair@nestlancer.com` | Edtech / L&D |
| `vikram-shah` | Vikram Shah | `vikram.shah@nestlancer.com` | Textiles / export portal |
| `kavya-reddy` | Kavya Reddy | `kavya.reddy@nestlancer.com` | Pharma / batch tracking |
| `rajan-kumar` | Rajan Kumar | `rajan.kumar@nestlancer.com` | Manufacturing / shop floor |
| `divya-sharma` | Divya Sharma | `divya.sharma@nestlancer.com` | Craft marketplace / e-com |
| `amit-verma` | Amit Verma | `amit.verma@nestlancer.com` | Real estate / CRM |
| `neha-gupta` | Neha Gupta | `neha.gupta@nestlancer.com` | HR SaaS / attendance |
| `suresh-iyer` | Suresh Iyer | `suresh.iyer@nestlancer.com` | Agro / mandi app |
| `pooja-kulkarni` | Pooja Kulkarni | `pooja.kulkarni@nestlancer.com` | Clinic booking |
| `karthik-menon` | Karthik Menon | `karthik.menon@nestlancer.com` | PayTech / UPI |
| `sandeep-chopra` | Sandeep Chopra | `sandeep.chopra@nestlancer.com` | Fleet / GPS |

**IDOR pairs:** pick two distinct clients (e.g. `arjun.mehta@…` vs `rahul.desai@…`) and swap resource IDs.

**Disposable mutations:** prefer creating `AUDIT-<PROMPT-ID>-<YYYYMMDD>-<n>` records rather than permanently damaging a named demo client. For password/session/2FA experiments, create a fresh registerable account when possible, or use one demo client and restore password to `Brick2@Build` afterward via admin.

## Catalog expectations (after seed)

| Resource | Expected |
|---|---|
| Blog categories / tags / published posts | 4 / 6 / ~110 |
| Portfolio categories / published items | 4 / 8 |
| Email templates | ~10 |
| Feature flags | ~12 |
| Notification templates | ~52 |
| Quote blocks / service packages | ~7 / 1 |
| Demo clients + admin | 15 + 1 |
| Demo projects (scenario seed) | ~15 |

If public blog/portfolio pages look empty after seed, bust HTTP cache (operator) rather than assuming content is missing — see P46 / A20.

## Public-domain vs operator-only checks

| Allowed on public domains | Operator / local-lab only (mark BLOCKED otherwise) |
|---|---|
| Browser walks on the three portals | `bash seed/seed.sh`, Infisical export, DB truncate |
| `https://api.nestlancer.com/api/v1/*` HTTP | Direct microservice URLs / Docker network |
| Portal same-origin `/api/v1/*` BFF | MinIO/Redis/Postgres shell access |
| Creating AUDIT-* fixtures via UI/API | Worker process kill / queue purge |
| Comparing portal BFF vs API gateway | Comparing gateway vs internal service ports |

## Webhook / payment sinks

- Webhooks: use an operator-approved **public HTTPS** demo sink (e.g. requestbin / webhook.site used only for this audit). **Never** `localhost`, private IPs, or metadata endpoints.
- Payments: Razorpay **test** keys / low-value demo only. No real cards or live settlement.

## Related prompts

- UI fixture readiness: `03-ui-prompts/04-cross-portal-regression-platform/P46-demo-seed-fixtures-and-destructive-flow-readiness.md`
- API/seed readiness: `04-api-prompts/02-platform-backend/A20-demo-seed-data-scripts-and-fixture-readiness.md`
- Security runbook: `06-security-prompts/00-SECURITY-RUNBOOK.md`
