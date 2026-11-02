# Environment variables

Validated by `src/lib/env.ts` (public) and `src/lib/env.server.ts` (server). Templates: `.env.example`, `.dev.vars.example`.

| Variable | Required | Scope | When read | Description |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (for auth) | Public | Build | Canonical origin, used for auth redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for auth/data) | Public | Build | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes (for auth/data) | Public | Build | `sb_publishable_…` or legacy anon key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | From Milestone 2 | Public | Build | Mapbox `pk.…`, URL-restricted |
| `SUPABASE_SECRET_KEY` | Only for admin tasks | **Server secret** | Runtime | `sb_secret_…` or legacy service_role. Bypasses RLS |
| `APP_ENV` | No | Server | Runtime | `development` / `production`, set in `wrangler.jsonc` / `.dev.vars` |
| `NEXTJS_ENV` | No | Server | Runtime | Which `.env.*` file OpenNext's preview loads (`.dev.vars`) |
| `PLAYWRIGHT_BASE_URL` | No | Test | Test | Point e2e tests at another URL |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | CI only | CI secret | Deploy | Non-interactive Wrangler auth |

## Where values live

| Context | File / mechanism |
| --- | --- |
| `npm run dev` | `.env.local` |
| `npm run preview` (workerd) | `.env.local` (build) + `.dev.vars` (runtime) |
| Production build | shell / CI environment or `.env.production` |
| Production runtime | `wrangler.jsonc` `vars` + `wrangler secret put` |

## Missing configuration today

No Supabase project, Mapbox token, or Cloudflare account connection exists yet
([CURRENT_STATUS.md](../CURRENT_STATUS.md)). The app renders without them; auth and data features need them.
