# Known issues

| # | Issue | Impact | Workaround / next action |
| --- | --- | --- | --- |
| 1 | OpenNext warns it is not fully compatible with Windows | Build, preview and deploy have all worked on Windows 11; future failures possible | Use WSL 2 or CI if a Windows-only failure appears |
| 2 | npm 11 `allowScripts` pins exact `esbuild` and `workerd` versions | Upgrades may block their install scripts | `npm install-scripts approve esbuild workerd` after upgrades |
| 3 | RLS/RPC smoke tests are manual SQL scripts, not in CI | Policy regressions not caught automatically | Convert to pgTAP before Milestone 3 |
| 4 | Supabase built-in email: low rate limit, testing only | Sign-up/reset emails may be throttled or land in spam | Configure custom SMTP before launch |
| 5 | Confirmation and password-reset email links not verified end to end | Possible misconfiguration unnoticed | Real sign-up with a real inbox after setting Auth URL config and deploying |
| 6 | CSP allows `'unsafe-inline'` scripts | Weaker XSS defence than a nonce-based CSP | Move to nonces (middleware) before adding third-party scripts (Mapbox) |
| 7 | Marketing header is static and always shows "Sign in / Join" | Signed-in users see sign-in links on public pages (middleware sends them to the dashboard) | Acceptable; a client-side account menu could replace it later |
| 8 | One active organization per user (first membership) | Users in several organizations cannot switch | Add an organization switcher with multi-organization support |
| 9 | `profiles` FKs use `ON DELETE RESTRICT` | Deleting an auth user who created records fails | Design account-deletion flow ([DATA_LIFECYCLE](../architecture/DATA_LIFECYCLE.md)) |
| 10 | `next/font/google` downloads fonts at build time | Builds need network access | Self-host fonts if CI goes offline |
| 11 | CI builds with placeholder Supabase values | CI-built Workers would fail `/api/health/db` | Add repository secrets before CI deploys |
| 12 | Repository is public | Code, docs and schema are world-readable (no secrets committed) | Owner's choice; keep secrets out of Git |
| 13 | Next.js 15.5 rather than 16 | Misses Next 16 features | Evaluate later; verify with `cf:build` + preview |
