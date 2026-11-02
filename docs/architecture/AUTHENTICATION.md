# Authentication

**Status (2026-11-02):** clients, middleware, sign-in and sign-out **tested** on the Workers preview.
Sign-up (with email confirmation) and password reset **implemented**; their email links are not yet
verified end to end. Not deployed.

## Routes

| Route | Purpose |
| --- | --- |
| `/sign-up` | Email + password + name; `signUp` with `emailRedirectTo=/auth/callback?next=/onboarding` → `/check-email` |
| `/sign-in` | `signInWithPassword`; honours a same-origin `next` (`safeNextPath`) |
| `/forgot-password` | `resetPasswordForEmail` → link to `/auth/callback?next=/reset-password`; same reply whether or not the account exists |
| `/reset-password` | Signed-in (via the link) user sets a new password |
| `/auth/callback` | Exchanges `code` (PKCE) or verifies `token_hash`, then redirects to `next`; failures → `/sign-in?error=link` |
| `/auth/sign-out` | **POST only**, 303 to `/` |

Middleware redirects anonymous users from `/dashboard`, `/onboarding`, `/profile` to `/sign-in?next=…`, and
signed-in users from `/sign-in`, `/sign-up` to `/dashboard`. The `(app)` layout re-checks with `requireUser()`.

**Supabase configuration required:** Auth → URL configuration → Site URL = production origin; redirect URLs for
production, `http://localhost:3000/**`, `http://localhost:8787/**`. Custom SMTP before launch.

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
