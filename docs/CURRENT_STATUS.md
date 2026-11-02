# Current status

_Last updated: 2026-11-02 (Milestone 2 session)._

## Summary

- **Milestone 1 (Foundation): complete and deployed** to https://paradise.paradise-contractors.workers.dev.
- **Milestone 2 (Network): deployed** 2026-11-02 (Worker version `5dfa87fa-0579-439b-97c7-5dd7585dd17e`).
  Signed-out flows verified in production by the e2e suite; the full signed-in journey was verified on the
  Workers preview. A real sign-up on production (real inbox) is the remaining check.
  The contractor map is deferred. See [milestones/MILESTONE_02_NETWORK.md](milestones/MILESTONE_02_NETWORK.md).

## Update — 2026-11-02, custom domain

- **https://paradisetrades.com** is live (Worker version `d8b5dbfb-33a4-425c-b709-5dabf3027d41`); `www` → 308 to apex;
  workers.dev still works. Production e2e: 22/22 pass on the new domain.
- Supabase Auth Site URL is now `https://paradisetrades.com`; redirect URLs: paradisetrades.com, workers.dev,
  localhost:3000, localhost:8787.
- **Code-based email verification is live** (Worker version `fc4da62e-0bf5-40d3-a725-df607d61bab8`): Supabase sends via
  Resend from `no-reply@paradisetrades.com` (domain verified, DKIM/DMARC in Cloudflare DNS); the "Confirm sign up"
  email contains a 6-digit code only (Supabase minimum; 4 is not supported); Supabase minimum password length
  raised to 10. **Verified 19:53–19:54 UTC:** a real sign-up received the code and verified. Resend key in use:
  `supabase-smtp-4` (Sending access, paradisetrades.com); unused keys deleted.

## Environments

| Service | Identifier | State |
| --- | --- | --- |
| Supabase | project `paradise`, ref `iaruniafwipktocripud`, us-east-1 | 5 migrations applied. Auth Site URL = production; redirect URLs = production, localhost:3000, localhost:8787 |
| Cloudflare | account `d871a8cd21f162e2dbd035a12ccea458`, subdomain `paradise-contractors` | Worker `paradise` version `5dfa87fa` (Milestone 2) |
| GitHub | [thetallerstandard-lab/Paradise-App](https://github.com/thetallerstandard-lab/Paradise-App) (public) | `main` |

## Verification log — Milestone 2, 2026-11-02 (Windows 11, Node 26.13)

| Check | Result |
| --- | --- |
| `npm run typecheck`, `npm run lint` | **Pass** |
| `npm run test` | **Pass** — 6 files, 48 tests |
| `npm run test:e2e` (dev server) | **Pass** — 18 tests (9 × mobile, desktop): landing, overflow, security headers, health, protected redirect, sign-up validation keeps input, auth links, expired-link handling, 404 profile |
| `npm run cf:build` | **Pass** |
| Manual journey on Workers preview (:8787) | **Pass** — protected redirect → sign-in → dashboard → create organization (rejected `javascript:` website, slug auto-filled) → publish blocked without trade → publish profile → values persist on reload → anonymous visitor sees public page → sign-out → protected again |
| Migrations `onboarding`, `profile_rpc_defaults` | **Applied**; security advisor 0 findings |
| `save_contractor_profile` + last-owner SQL test (rolled back) | **Pass** — 7/7 |
| Test data cleanup | All app tables and `auth.users` back to 0 rows |
| Deploy (owner-approved) | `NEXT_PUBLIC_SITE_URL=https://paradise.paradise-contractors.workers.dev npm run deploy` — 1.42 MiB gzip, 19 ms startup |
| Production `/api/health/db` | `{"status":"ok","tradeCategories":12}` |
| E2E vs production | **Pass** — 18 tests (after fixing an over-broad `role=alert` selector that matched Next's route announcer) |

Not verified: sign-up confirmation and password-reset email links end to end, and a signed-in session on
the deployed Worker (test accounts are only used on local hosts). Owner to do one real sign-up in production.

## Capability status

| Area | Status |
| --- | --- |
| Landing page, public profile pages | **Released** |
| Sign-up / sign-in / sign-out / reset | **Released**; sign-in & sign-out tested on preview; email links unverified |
| Onboarding, profile editor, dashboard | **Released**; tested on preview (manual) |
| Security headers | **Released**, tested in production |
| Contractor map | Planned (Milestone 2b) |
| Exchange (requests/offers UI) | Planned (Milestone 3) |
| Paradise Points ledger | Planned |
| Milestone 1 placeholder site, `/api/health`, `/api/health/db` | Released |

## Open items


1. **Real sign-up on production** with a real inbox (confirm link → onboarding → publish → public page).
2. **Password reset** end to end with a real inbox.
3. **Supabase built-in email** is rate-limited (a few emails/hour) and for testing only — configure custom SMTP before launch.
4. **GitHub repository secrets** for `NEXT_PUBLIC_SUPABASE_*` not set (CI builds with placeholders).
5. **Mapbox token** — needed for Milestone 2b.

See also [development/KNOWN_ISSUES.md](development/KNOWN_ISSUES.md).
