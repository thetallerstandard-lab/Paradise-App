# Known issues

| # | Issue | Impact | Workaround / next action |
| --- | --- | --- | --- |
| 1 | OpenNext warns it is not fully compatible with Windows | Build, preview and deploy have all worked on Windows 11; future failures possible | Use WSL 2 or CI if a Windows-only failure appears |
| 2 | npm 11 `allowScripts` pins exact `esbuild` and `workerd` versions | Upgrades may block their install scripts | `npm install-scripts approve esbuild workerd` after upgrades |
| 3 | RLS/RPC smoke tests are manual SQL scripts, not in CI | Policy regressions not caught automatically | Convert to pgTAP before Milestone 3 |
| 4 | Resend free tier: 3,000 emails/month, 100/day; DMARC is `p=none` (monitor only) | Throttling if sign-ups spike; spoofing not yet rejected | Upgrade Resend or move to Cloudflare Email Sending when volume grows; tighten DMARC to `quarantine` after a few weeks of clean reports |
| 4b | Project folder is inside OneDrive | `next dev`/`next build` can fail with `EINVAL readlink .next\...` | `cmd /c "rmdir /s /q .next"` and retry; long term, move the repo outside OneDrive (e.g. `C:\dev\paradise`) |
| 4c | Production e2e can flake right after a deploy | 1–2 tests time out on a cold Worker | Rerun; consider a short warm-up request before the suite |
| 5 | Confirmation and password-reset email links not verified end to end | Possible misconfiguration unnoticed | Real sign-up with a real inbox after setting Auth URL config and deploying |
| 6 | CSP allows `'unsafe-inline'` scripts | Weaker XSS defence than a nonce-based CSP | Move to nonces (middleware) before adding third-party scripts (Mapbox) |
| 7 | Marketing header is static and always shows "Sign in / Join" | Signed-in users see sign-in links on public pages (middleware sends them to the dashboard) | Acceptable; a client-side account menu could replace it later |
| 8 | One active organization per user (first membership) | Users in several organizations cannot switch | Add an organization switcher with multi-organization support |
| 9 | `profiles` FKs use `ON DELETE RESTRICT` | Deleting an auth user who created records fails | Design account-deletion flow ([DATA_LIFECYCLE](../architecture/DATA_LIFECYCLE.md)) |
| 10 | `next/font/google` downloads fonts at build time | Builds need network access | Self-host fonts if CI goes offline |
| 11 | CI builds with placeholder Supabase values | CI-built Workers would fail `/api/health/db` | Add repository secrets before CI deploys |
| 12 | Repository is public | Code, docs and schema are world-readable (no secrets committed) | Owner's choice; keep secrets out of Git |
| 13 | Next.js 15.5 rather than 16 | Misses Next 16 features | Evaluate later; verify with `cf:build` + preview |
