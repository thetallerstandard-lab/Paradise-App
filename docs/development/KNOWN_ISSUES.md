# Known issues

| # | Issue | Impact | Workaround / next action |
| --- | --- | --- | --- |
| 1 | OpenNext warns it is not fully compatible with Windows | Build and preview passed on Windows 11 on 2026-11-02, but future failures are possible | Use WSL 2 or the Linux CI job if a Windows-only failure appears |
| 2 | npm 11 blocks install scripts unless allowed; `allowScripts` in `package.json` pins exact `esbuild` and `workerd` versions | After upgrading Wrangler/OpenNext, new versions may be blocked and `cf:build`/`preview` fail | Run `npm install-scripts approve esbuild workerd` after upgrades, then commit `package.json` |
| 3 | RLS smoke test is a manual SQL script, not in CI | Policy regressions not caught automatically | Convert to pgTAP (`supabase test db`) before Milestone 3 |
| 4 | An owner can remove themselves and leave an organization ownerless | Orphaned organization | Add a "last owner" guard before member management ships (Milestone 2) |
| 5 | `profiles` FKs use `ON DELETE RESTRICT` | Deleting an auth user with created records fails | Design account-deletion flow ([DATA_LIFECYCLE](../architecture/DATA_LIFECYCLE.md)) |
| 6 | Security headers (CSP etc.) not set | Weaker browser hardening | Milestone 2 |
| 7 | `next/font/google` downloads fonts at build time | Builds need network access | Acceptable; self-host fonts if CI is offline |
| 8 | CI builds with placeholder Supabase values (no repository secrets set) | `/api/health/db` would report error in a CI-built Worker; current tests unaffected | Add `NEXT_PUBLIC_SUPABASE_*` repository secrets before CI builds anything deployable |
| 11 | Repository is public | Code, docs, schema and Supabase project ref are world-readable (no secrets committed) | Owner's choice (2026-11-02). Never commit `.env.local` / `.dev.vars`; keep secrets in Wrangler/GitHub secrets |
| 9 | ESLint 9.39 is flagged deprecated by npm | None today | Upgrade with the next Next.js upgrade |
| 10 | Next.js 15.5 rather than 16 | Misses Next 16 features | Evaluate after Milestone 2; verify with `cf:build` + preview |
