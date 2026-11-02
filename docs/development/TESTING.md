# Testing

**Status: all suites pass locally** (2026-11-02): typecheck, lint, 19 Vitest tests, 6 Playwright
tests against `next dev` and 6 against the Workers preview. CI not yet run.

| Layer | Tool | Location | Command |
| --- | --- | --- | --- |
| Types | `tsc` | whole repo | `npm run typecheck` |
| Lint | ESLint 9 (next/core-web-vitals, next/typescript) | whole repo | `npm run lint` |
| Unit | Vitest + jsdom | `tests/unit` | `npm run test` |
| Component | Vitest + Testing Library | `tests/components` | `npm run test` |
| End-to-end | Playwright (Pixel 7 + Desktop Chrome) | `tests/e2e` | `npm run test:e2e` |
| Workers build | OpenNext | — | `npm run cf:build` |
| Database (manual) | SQL smoke test, rolls back | `supabase/tests/rls_smoke.sql` | Supabase SQL editor |
| Database (planned) | pgTAP via `supabase test db` | `supabase/tests` | — |

`npm run check` = typecheck + lint + unit tests.

## Current tests

- `tests/unit/env.test.ts` — env validation, missing-key messages.
- `tests/unit/organizations.test.ts` — slug generation matches the DB constraint.
- `tests/unit/marketplace.test.ts` — offer/request validation, offer transition rules, launch-market bounds.
- `tests/components/home-page.test.tsx` — root page renders brand statement and ecosystems.
- `tests/e2e/smoke.spec.ts` — `/` returns 200 with the H1, no horizontal overflow on mobile, `/api/health` JSON.

## E2E against the Workers runtime

```bash
npm run preview                                      # serves on http://localhost:8787
PLAYWRIGHT_BASE_URL=http://localhost:8787 npm run test:e2e   # in a second terminal
```

PowerShell: `$env:PLAYWRIGHT_BASE_URL="http://localhost:8787"; npm run test:e2e`.
First run needs browsers: `npx playwright install chromium`.

## Rules

- Record results honestly in [CURRENT_STATUS.md](../CURRENT_STATUS.md): what ran, where, pass/fail.
- RLS policies need database-level tests before Milestone 3 ships.
