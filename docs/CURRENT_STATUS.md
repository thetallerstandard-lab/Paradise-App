# Current status

_Last updated: 2026-11-02 (Milestone 2 session)._

## Summary

- **Milestone 1 (Foundation): complete and deployed** to https://paradise.paradise-contractors.workers.dev.
- **Milestone 2 (Network): implemented and tested locally**, including the full signed-in journey on the
  Workers preview. **Not yet deployed** — production still serves the Milestone 1 placeholder.
  The contractor map is deferred. See [milestones/MILESTONE_02_NETWORK.md](milestones/MILESTONE_02_NETWORK.md).

## Environments

| Service | Identifier | State |
| --- | --- | --- |
| Supabase | project `paradise`, ref `iaruniafwipktocripud`, us-east-1 | 5 migrations applied. Auth URL configuration: see open items. |
| Cloudflare | account `d871a8cd21f162e2dbd035a12ccea458`, subdomain `paradise-contractors` | Worker `paradise` version `e0af56b7` (Milestone 1 build) |
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

Not verified: sign-up confirmation email and password-reset email links end to end (the test user was
created already-confirmed via SQL to avoid sending mail to a fake inbox); session on the deployed Worker.

## Capability status

| Area | Status |
| --- | --- |
| Landing page, public profile pages | Tested (not released) |
| Sign-up / sign-in / sign-out / reset | Sign-in & sign-out tested; sign-up & reset implemented, email links unverified |
| Onboarding, profile editor, dashboard | Tested (manual) |
| Security headers | Tested |
| Contractor map | Planned (Milestone 2b) |
| Exchange (requests/offers UI) | Planned (Milestone 3) |
| Paradise Points ledger | Planned |
| Milestone 1 placeholder site, `/api/health`, `/api/health/db` | Released |

## Open items

1. **Supabase Auth URL configuration** — Site URL `https://paradise.paradise-contractors.workers.dev` and redirect
   URLs must be set before real users sign up, or confirmation links point at localhost.
2. **Deploy Milestone 2** — needs owner approval.
3. **Supabase built-in email** is rate-limited (a few emails/hour) and for testing only — configure custom SMTP before launch.
4. **GitHub repository secrets** for `NEXT_PUBLIC_SUPABASE_*` not set (CI builds with placeholders).
5. **Mapbox token** — needed for Milestone 2b.

See also [development/KNOWN_ISSUES.md](development/KNOWN_ISSUES.md).
