# Frontend special route handlers and middleware inventory (code-derived)

## landing
- middleware: `apps/landing/src/middleware.ts`
- `/api/v1/[...path]` `route.ts` — `apps/landing/src/app/api/v1/[...path]/route.ts`
- `/blog` `layout.tsx` — `apps/landing/src/app/blog/layout.tsx`
- `/` `error.tsx` — `apps/landing/src/app/error.tsx`
- `/` `layout.tsx` — `apps/landing/src/app/layout.tsx`
- `/` `not-found.tsx` — `apps/landing/src/app/not-found.tsx`
- `/portfolio` `layout.tsx` — `apps/landing/src/app/portfolio/layout.tsx`
- `/` `robots.ts` — `apps/landing/src/app/robots.ts`
- `/services` `layout.tsx` — `apps/landing/src/app/services/layout.tsx`
- `/` `sitemap.ts` — `apps/landing/src/app/sitemap.ts`

## web
- middleware: `apps/web/src/middleware.ts`
- `/` `layout.tsx` — `apps/web/src/app/(auth)/layout.tsx`
- `/login` `loading.tsx` — `apps/web/src/app/(auth)/login/loading.tsx`
- `/register` `loading.tsx` — `apps/web/src/app/(auth)/register/loading.tsx`
- `/invoices/[id]` `not-found.tsx` — `apps/web/src/app/(dashboard)/invoices/[id]/not-found.tsx`
- `/` `layout.tsx` — `apps/web/src/app/(dashboard)/layout.tsx`
- `/messages` `layout.tsx` — `apps/web/src/app/(dashboard)/messages/layout.tsx`
- `/messages` `loading.tsx` — `apps/web/src/app/(dashboard)/messages/loading.tsx`
- `/payments/invoice/[id]` `not-found.tsx` — `apps/web/src/app/(dashboard)/payments/invoice/[id]/not-found.tsx`
- `/profile` `layout.tsx` — `apps/web/src/app/(dashboard)/profile/layout.tsx`
- `/projects/[id]` `error.tsx` — `apps/web/src/app/(dashboard)/projects/[id]/error.tsx`
- `/projects/[id]` `loading.tsx` — `apps/web/src/app/(dashboard)/projects/[id]/loading.tsx`
- `/projects/[id]` `not-found.tsx` — `apps/web/src/app/(dashboard)/projects/[id]/not-found.tsx`
- `/projects` `loading.tsx` — `apps/web/src/app/(dashboard)/projects/loading.tsx`
- `/quotes/[id]` `not-found.tsx` — `apps/web/src/app/(dashboard)/quotes/[id]/not-found.tsx`
- `/requests` `loading.tsx` — `apps/web/src/app/(dashboard)/requests/loading.tsx`
- `/settings` `layout.tsx` — `apps/web/src/app/(dashboard)/settings/layout.tsx`
- `/blog/feed/atom` `route.ts` — `apps/web/src/app/(public)/blog/feed/atom/route.ts`
- `/blog/feed/rss` `route.ts` — `apps/web/src/app/(public)/blog/feed/rss/route.ts`
- `/blog` `layout.tsx` — `apps/web/src/app/(public)/blog/layout.tsx`
- `/` `layout.tsx` — `apps/web/src/app/(public)/layout.tsx`
- `/api/auth/callback` `route.ts` — `apps/web/src/app/api/auth/callback/route.ts`
- `/api/auth/impersonate` `route.ts` — `apps/web/src/app/api/auth/impersonate/route.ts`
- `/api/auth/login` `route.ts` — `apps/web/src/app/api/auth/login/route.ts`
- `/api/auth/logout` `route.ts` — `apps/web/src/app/api/auth/logout/route.ts`
- `/api/auth/refresh` `route.ts` — `apps/web/src/app/api/auth/refresh/route.ts`
- `/api/auth/verify-2fa` `route.ts` — `apps/web/src/app/api/auth/verify-2fa/route.ts`
- `/api/v1/[...path]` `route.ts` — `apps/web/src/app/api/v1/[...path]/route.ts`
- `/api/webhooks/razorpay` `route.ts` — `apps/web/src/app/api/webhooks/razorpay/route.ts`
- `/` `error.tsx` — `apps/web/src/app/error.tsx`
- `/` `layout.tsx` — `apps/web/src/app/layout.tsx`
- `/` `not-found.tsx` — `apps/web/src/app/not-found.tsx`
- `/` `robots.ts` — `apps/web/src/app/robots.ts`
- `/` `sitemap.ts` — `apps/web/src/app/sitemap.ts`

## admin
- middleware: `apps/admin/src/middleware.ts`
- `/` `layout.tsx` — `apps/admin/src/app/(dashboard)/layout.tsx`
- `/api/auth/login` `route.ts` — `apps/admin/src/app/api/auth/login/route.ts`
- `/api/auth/logout` `route.ts` — `apps/admin/src/app/api/auth/logout/route.ts`
- `/api/auth/refresh` `route.ts` — `apps/admin/src/app/api/auth/refresh/route.ts`
- `/api/auth/verify-2fa` `route.ts` — `apps/admin/src/app/api/auth/verify-2fa/route.ts`
- `/api/v1/[...path]` `route.ts` — `apps/admin/src/app/api/v1/[...path]/route.ts`
- `/` `error.tsx` — `apps/admin/src/app/error.tsx`
- `/` `layout.tsx` — `apps/admin/src/app/layout.tsx`
- `/nl-absent` `route.ts` — `apps/admin/src/app/nl-absent/route.ts`
- `/` `not-found.tsx` — `apps/admin/src/app/not-found.tsx`
- `/` `robots.ts` — `apps/admin/src/app/robots.ts`

## Cross-package middleware helpers
- `packages/config/proxy-api-v1.mjs`
- `packages/config/csp-middleware.mjs`
- `packages/config/request-log.mjs`
- `packages/auth/src/middleware.ts`
- `packages/auth/src/bff-gateway-login.ts`
- `packages/auth/src/silentRefresh.ts`
