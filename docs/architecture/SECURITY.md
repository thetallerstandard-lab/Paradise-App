# Security

## Secrets

| Value | Exposure | Where it lives |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public by design; RLS protects data | Build env, `.env.local` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Public; restrict by URL in Mapbox | Build env |
| `SUPABASE_SECRET_KEY` | **Server only**; bypasses RLS | `wrangler secret put`, `.dev.vars`, `.env.local` |

- `src/lib/env.server.ts` and `src/lib/supabase/admin.ts` import `server-only`, so a client import fails the build.
- ESLint blocks importing the admin client from `src/components`.
- `.env*` and `.dev.vars` are git-ignored except the `*.example` templates.

## Application

- Validate all input with Zod at the server boundary.
- Authorize on the server and in RLS ([AUTHORIZATION.md](AUTHORIZATION.md)).
- Use `supabase.auth.getUser()` on the server for identity.
- Server actions rely on Next.js's built-in Origin checks for CSRF; do not add GET endpoints that mutate.
- `poweredByHeader` is disabled. Security headers are set for every route in `next.config.ts` (tested by e2e):
  CSP (`default-src 'self'`, Supabase in `connect-src`, `frame-ancestors 'none'`, `form-action 'self'`,
  `object-src 'none'`), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
  Scripts still allow `'unsafe-inline'` (Next.js bootstrap); move to nonces before adding Mapbox.
- Open redirects: every user-supplied `next` goes through `safeNextPath()` (same-origin paths only).
- Stored URLs (organization website) are rendered as links only if they start with `http(s)://`, because owners
  can write rows directly through the API.
- Sign-out is POST-only; forgot-password responses do not reveal whether an account exists.
- `global_fetch_strictly_public` is enabled in Wrangler.

## Data

- Contractor locations are approximate map points, not addresses ([GEOSPATIAL.md](GEOSPATIAL.md)).
- Points are not money and do not move in the MVP.
- Retention and deletion: [DATA_LIFECYCLE.md](DATA_LIFECYCLE.md).

## Reporting

Until a security contact exists, report issues privately to the project owner.
