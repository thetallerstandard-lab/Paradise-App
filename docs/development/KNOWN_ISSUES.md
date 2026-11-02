# Known issues

| # | Issue | Impact | Workaround / next action |
| --- | --- | --- | --- |
| 1 | OpenNext warns it is not fully compatible with Windows | Build and preview passed on Windows 11 on 2026-11-02, but future failures are possible | Use WSL 2 or the Linux CI job if a Windows-only failure appears |
| 2 | npm 11 blocks install scripts unless allowed; `allowScripts` in `package.json` pins exact `esbuild` and `workerd` versions | After upgrading Wrangler/OpenNext, new versions of these may be blocked and `cf:build`/`preview` fail | Run `npm install-scripts approve esbuild workerd` after upgrades, then commit `package.json` |
| 3 | Migration never executed | SQL syntax and RLS behaviour unverified | Apply to a dev Supabase project; add pgTAP tests |
| 4 | `src/types/database.ts` is hand-written | Could drift from the real schema | Regenerate with `supabase gen types` after applying the migration |
| 5 | An owner can remove themselves and leave an organization ownerless | Orphaned organization | Add a "last owner" guard before member management ships (Milestone 2) |
| 6 | `profiles` FKs use `ON DELETE RESTRICT` | Deleting an auth user with created records fails | Design account-deletion flow ([DATA_LIFECYCLE](../architecture/DATA_LIFECYCLE.md)) |
| 7 | Security headers (CSP etc.) not set | Weaker browser hardening | Milestone 2 |
| 8 | `next/font/google` downloads fonts at build time | Builds need network access | Acceptable; self-host fonts if CI is offline |
| 9 | CI workflow untested | May need fixes on first run | Push to GitHub and observe |
| 10 | ESLint 9.39 is flagged deprecated by npm | None today | Move to the ESLint version supported by `eslint-config-next` when upgrading Next.js |
| 11 | Next.js 15.5 rather than 16 | Misses Next 16 features | Evaluate an upgrade once Milestone 2 is stable; verify with `cf:build` + preview |
