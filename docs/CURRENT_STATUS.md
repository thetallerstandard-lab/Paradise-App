# Current status

_Last updated: 2026-11-02 (Milestone 1 session)._

## Summary

Milestone 1 (Foundation) is **implemented and locally verified**, including a
Cloudflare Workers build and a local Workers-runtime preview. Nothing is
deployed. Supabase is **not connected** (no project exists), so auth and data
paths are implemented but unexercised.

## Verification log — 2026-11-02, Windows 11, Node.js 26.13.0, npm 11.20.0

| Check | Command | Result |
| --- | --- | --- |
| Install | `npm install` | Pass (758 packages; `esbuild`, `workerd` install scripts approved in `allowScripts`) |
| Type check | `npm run typecheck` | **Pass** |
| Lint | `npm run lint` | **Pass** |
| Unit + component tests | `npm run test` | **Pass** — 4 files, 19 tests |
| E2E vs `next dev` | `npm run test:e2e` | **Pass** — 6 tests (3 × mobile, desktop) |
| Cloudflare build | `npm run cf:build` | **Pass** — `.open-next/worker.js` produced (OpenNext warns Windows is not fully supported) |
| Workers preview | `opennextjs-cloudflare preview` on :8787 | **Pass** — `/` 200 with H1, `/api/health` 200 |
| E2E vs Workers preview | `PLAYWRIGHT_BASE_URL=http://localhost:8787 npx playwright test` | **Pass** — 6 tests |
| Bundle size | `wrangler deploy --dry-run` | 4.92 MiB raw / **1.03 MiB gzip** (Free limit 3 MiB) |
| Cloudflare account | `wrangler whoami` | **Not authenticated** (Wrangler CLI). The Cloudflare connector in Claude Code reaches an account with 0 Workers. |
| Supabase connection | — | **Not tested** — no project exists |
| CI workflow | — | **Not run** — no GitHub remote |

Resolved versions: Next.js 15.5.28, React 19.1.1, `@opennextjs/cloudflare` 1.20.15, Wrangler 4.156.2,
`@supabase/supabase-js` 2.118.0, `@supabase/ssr` 0.7.0, Zod 4.6.7, Tailwind 4.3.3, Vitest 3.2.7,
Playwright 1.64.1, TypeScript 5.9.3, ESLint 9.39.5.

## Capability status

| Area | Status | Notes |
| --- | --- | --- |
| Next.js app (App Router, strict TS) | Tested | Dev server and Workers preview |
| Root page, layout, `/api/health` | Tested | Unit + e2e on both runtimes |
| Tailwind v4 + shadcn/ui tokens and base components | Implemented | Built and rendered; no visual review yet |
| Environment validation (Zod) | Tested | `tests/unit/env.test.ts` |
| Supabase clients + session middleware | Implemented | Middleware runs (no-op without credentials); never connected to Supabase |
| Database schema + RLS migration | Implemented as SQL, **not applied** | Never executed against Postgres |
| `src/types/database.ts` | Implemented (hand-written) | Type-checks; regenerate after migration |
| Domain validation + offer transition rules | Tested | `tests/unit/organizations.test.ts`, `marketplace.test.ts` |
| OpenNext + Wrangler config | Tested (local) | Build + preview pass; never deployed |
| GitHub Actions CI | Implemented | Not run |
| Documentation + `CLAUDE.md` | Implemented | |
| Auth UI, onboarding, map, exchange UI | Planned | Milestones 2–3 |
| Paradise Points transfers / ledger | Planned | Deliberately excluded from MVP |
| Production deployment | **Not released** | Requires owner approval |

## Blockers / open items

1. **No Supabase project** — create one, then apply the migration ([development/NEXT_STEPS.md](development/NEXT_STEPS.md)).
2. **Wrangler not logged in** — owner runs `npx wrangler login` (browser OAuth).
3. **No GitHub remote** — initial commit `220f4de` exists locally on `main`; CI has never run.
4. **No Mapbox token** (needed from Milestone 2).

See also [development/KNOWN_ISSUES.md](development/KNOWN_ISSUES.md).
