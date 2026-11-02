# Current status

_Last updated: 2026-11-02 (Milestone 1 session)._

## Summary

Milestone 1 (Foundation) is **complete and deployed**. The foundation placeholder
site is live at **https://paradise.paradise-contractors.workers.dev** (Cloudflare
Workers, version `e0af56b7-a718-4781-9170-0367c59415d8`, deployed 2026-11-02) and
reads from the live Supabase project. No user-facing product features exist yet.

## Environments

| Service | Identifier | State |
| --- | --- | --- |
| Supabase | project `paradise`, ref `iaruniafwipktocripud`, region us-east-1, org `paradise` | Active. Both migrations applied, trade categories seeded. $0/month (Free). |
| Cloudflare | account `d871a8cd21f162e2dbd035a12ccea458`, workers.dev subdomain `paradise-contractors` | Worker `paradise` deployed. Workers Free plan. |
| GitHub | [thetallerstandard-lab/Paradise-App](https://github.com/thetallerstandard-lab/Paradise-App) (**public**) | `main` pushed 2026-11-02 |

## Verification log — 2026-11-02, Windows 11, Node.js 26.13.0, npm 11.20.0

| Check | Command | Result |
| --- | --- | --- |
| Install | `npm install` | Pass (`esbuild`, `workerd` install scripts approved in `allowScripts`) |
| Type check / lint | `npm run typecheck`, `npm run lint` | **Pass** |
| Unit + component tests | `npm run test` | **Pass** — 4 files, 19 tests |
| E2E vs `next dev` (Supabase configured) | `npm run test:e2e` | **Pass** — 6 tests |
| Cloudflare build | `npm run cf:build` | **Pass** (OpenNext warns Windows is not fully supported) |
| E2E vs Workers preview | `PLAYWRIGHT_BASE_URL=http://localhost:8787 npx playwright test` | **Pass** — 6 tests |
| Supabase from workerd | `GET /api/health/db` on preview | **Pass** — `{"status":"ok","tradeCategories":12}` |
| Migrations | `initial_schema`, `harden_functions_and_policies` | **Applied** |
| Supabase security advisor | — | **0 findings** (after hardening migration) |
| Supabase performance advisor | — | Only "unused index" (INFO; empty database) |
| RLS / trigger behaviour | `supabase/tests/rls_smoke.sql` | **Pass** — 13/13 steps as expected (rolled back) |
| REST exposure | anon `GET /rest/v1/resource_requests` → `[]`; `POST /rest/v1/rpc/is_org_member` → 404 | **As intended** |
| Bundle size | `wrangler deploy --dry-run` | 1.03 MiB gzip (Free limit 3 MiB) |
| CI workflow (GitHub Actions, ubuntu, Node 22) | [run #1](https://github.com/thetallerstandard-lab/Paradise-App/actions/runs/41498281949) on `2b94286` | **Pass** — npm ci, typecheck, lint, unit tests, OpenNext build, Playwright e2e |
| Production deploy (owner-approved) | `NEXT_PUBLIC_SITE_URL=https://paradise.paradise-contractors.workers.dev npm run deploy` | **Pass** — 1.14 MiB gzip, 18 ms startup |
| Production smoke | `/`, `/api/health`, `/api/health/db` (`tradeCategories: 12`) | **Pass** |
| E2E vs production | `PLAYWRIGHT_BASE_URL=https://paradise.paradise-contractors.workers.dev npx playwright test` | **Pass** — 6 tests |

Resolved versions: Next.js 15.5.28, React 19.1.1, `@opennextjs/cloudflare` 1.20.15, Wrangler 4.156.2,
`@supabase/supabase-js` 2.118.0, `@supabase/ssr` 0.7.0, Zod 4.6.7, Tailwind 4.3.3, Vitest 3.2.7,
Playwright 1.64.1, TypeScript 5.9.3, ESLint 9.39.5.

## Capability status

| Area | Status | Notes |
| --- | --- | --- |
| Next.js app, root page, `/api/health` | **Released** | Placeholder home page only |
| `/api/health/db` readiness check | **Released** | Verified in production; not in CI e2e (CI has no Supabase credentials) |
| Tailwind v4 + shadcn/ui tokens and components | Implemented | Rendered; no visual review yet |
| Environment validation | Tested | |
| Supabase clients | Tested (anonymous reads) | Server client verified from workerd; signed-in sessions untested (no auth UI) |
| Database schema, RLS, triggers | Tested | Applied; SQL smoke test passes |
| `src/types/database.ts` | Generated | From the live project |
| Domain validation + offer transition rules | Tested | |
| OpenNext + Wrangler config | Released | Deployed from Windows with Wrangler; no CI deploy yet |
| GitHub Actions CI | Tested | Run #1 green |
| Auth UI, onboarding, map, exchange UI | Planned | Milestones 2–3 |
| Paradise Points transfers / ledger | Planned | Excluded from MVP |

## Open items

1. **CI repository secrets** — `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` not set, so CI builds
   with placeholders (fine for current tests).
2. **`SUPABASE_SECRET_KEY`** not set locally or in Cloudflare (not needed until an admin task exists).
   Copy it from Supabase → Project Settings → API Keys; never commit it.
3. **Supabase Auth URL configuration** (Site URL, redirect URLs) not yet set — needed in Milestone 2.
4. **No Mapbox token** (Milestone 2).

See also [development/KNOWN_ISSUES.md](development/KNOWN_ISSUES.md).
