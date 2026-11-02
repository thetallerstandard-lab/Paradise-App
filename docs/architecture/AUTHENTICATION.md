# Authentication

**Status:** clients and session middleware **Implemented** (unverified, no
Supabase project). Sign-up/sign-in UI **Planned** for Milestone 2.

## Approach

Supabase Auth with cookie-based sessions via `@supabase/ssr`, which works on
Cloudflare Workers because it only needs `fetch` and the Next.js cookie APIs.

| File | Runs in | Key | Purpose |
| --- | --- | --- | --- |
| `src/lib/supabase/client.ts` | Browser | publishable | Client components |
| `src/lib/supabase/server.ts` | Server (per request) | publishable + user cookies | Server components, actions, route handlers; RLS applies |
| `src/lib/supabase/middleware.ts` + `src/middleware.ts` | Middleware | publishable | Refreshes the session on each request and rewrites cookies |
| `src/lib/supabase/admin.ts` | Server only | **secret** | Bypasses RLS; trusted jobs only |

Rules:
- On the server, trust `supabase.auth.getUser()` (validates with Supabase Auth), never `getSession()` alone.
- Never create a Supabase client at module scope on the server; Workers isolates are shared across requests.
- Middleware is a no-op until `NEXT_PUBLIC_SUPABASE_URL` and the publishable key are set, so the site renders without credentials.

## Integration plan (Milestone 2)

1. Create Supabase project; enable email + password and magic link. Set Site URL and redirect
   URLs for `http://localhost:3000`, `http://localhost:8787` (Workers preview) and the production domain.
2. Add `src/app/auth/callback/route.ts` to exchange the code for a session (`exchangeCodeForSession`).
3. Build `/sign-up`, `/sign-in`, `/sign-out` with server actions using `identity` schemas.
4. Add `getCurrentUser()` in `src/modules/identity` and a protected `(app)` route group that redirects anonymous users.
5. Onboarding: create organization (owner membership is automatic) → contractor profile.
6. **Verify on Workers:** run `npm run preview`, sign in, reload, confirm the session persists and cookies are
   `HttpOnly`, `Secure` (in production), `SameSite=Lax`. Repeat on the deployed Worker.

Later: Google sign-in, phone OTP, MFA for organization owners.

Related: [AUTHORIZATION.md](AUTHORIZATION.md), [SECURITY.md](SECURITY.md).
