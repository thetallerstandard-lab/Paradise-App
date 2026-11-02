# Tech stack

Ranges live in `package.json`; exact versions in `package-lock.json`. Resolved on 2026-11-02:
Next.js 15.5.28, React 19.1.1, `@opennextjs/cloudflare` 1.20.15, Wrangler 4.156.2, supabase-js 2.118.0,
`@supabase/ssr` 0.7.0, Zod 4.6.7, Tailwind 4.3.3, Vitest 3.2.7, Playwright 1.64.1, TypeScript 5.9.3.
Developed on Node.js 26 (LTS); CI uses Node 22.

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js `~15.5` (App Router) | 15.5 chosen over 16 for the most proven OpenNext Cloudflare support, including Edge-runtime `middleware.ts`. Re-evaluate 16 after Milestone 1 is verified. |
| Language | TypeScript 5.9, `strict` + `noUncheckedIndexedAccess` | |
| UI | React 19, Tailwind CSS v4, shadcn/ui (new-york, CSS variables), Lucide | Components are copied into `src/components/ui`. |
| Validation | Zod 4 | Env, form input, domain rules. |
| Database | Supabase Postgres + PostGIS | |
| DB access | `@supabase/supabase-js` + `@supabase/ssr` (HTTP) | See decision below. |
| Auth | Supabase Auth, cookie sessions | [AUTHENTICATION.md](AUTHENTICATION.md) |
| Files | Supabase Storage | Cloudflare R2 may come later. |
| Maps | Mapbox GL JS | Milestone 2; not installed yet. |
| Unit tests | Vitest 3 + Testing Library + jsdom | |
| E2E tests | Playwright | Mobile + desktop projects. |
| Hosting | Cloudflare Workers | [ADR-0002](../decisions/ADR-0002-cloudflare-hosting.md) |
| Adapter | `@opennextjs/cloudflare` 1.x | |
| CLI | Wrangler 4 | |
| CI | GitHub Actions | Workflow written, not yet run. |

## Database access decision

**All application database access goes through Supabase's HTTP APIs using
`supabase-js`** (PostgREST for tables, RPC for SQL functions), created per request via `@supabase/ssr`.

Why:
- Works in the Workers runtime with plain `fetch`; no TCP sockets or connection pools.
- Carries the user's JWT, so **Postgres RLS applies to every query**. An ORM with a
  direct connection would run as a privileged role and bypass RLS.
- One consistent pattern for browser, server and middleware.

Trade-offs: complex queries (PostGIS proximity, multi-step writes) are written as
Postgres functions and called with `.rpc()`. Multi-statement transactions must
live in SQL functions. Schema changes are SQL migrations, not ORM models.

Not used: Prisma, Drizzle with a direct connection, `pg`, Cloudflare Hyperdrive.
Revisit only if a workload needs it; record an ADR.
