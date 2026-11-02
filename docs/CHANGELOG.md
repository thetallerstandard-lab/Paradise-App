# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/). Versions are
assigned at first release.

## [Unreleased]

### Changed — 2026-11-02, contractor experience: onboarding and navigation

- **3-step onboarding** with a progress bar: `/onboarding/business` (name, town, phone; web address chosen
  automatically) → `/onboarding/trade` (main trade + other trades as chips, travel radius) → `/onboarding/publish`
  (live preview, "Go live" or "finish later"). `/onboarding` resumes at the first unfinished step; steps can't be skipped.
- **Tab navigation**: bottom tab bar on phones, tabs in the header on desktop — Home, Requests, My business.
- **Home** is now action cards: resume setup, "You're live" with copy-link/share, "Strengthen your profile"
  (completeness % and the next missing details, each linking straight into the field), Exchange teaser.
- **Requests** tab: explains what's coming (Milestone 3).
- **My business** (`/profile`): plain wording (Live/Hidden, "Save and go live"); headline no longer required to go live.
- Plain-language errors on onboarding; dark-mode contrast fix for success banners.
- Fixes found in the preview walkthrough: (1) a per-request cache returned stale data inside a server action, and
  (2) server-action `redirect()` from onboarding landed on a stale cached `/` on the Workers runtime. Onboarding and
  profile actions now return `redirectTo` and the browser navigates (`useFormAction`).
- Tests: 65 unit/component, 26 e2e. Deployed as `856b099f`.

### Changed — 2026-11-02, 6-digit codes

- Supabase "Email OTP length" 8 → 6 (owner asked for 4; Supabase's minimum is 6).
- Root cause of the SMTP failures: the Browser pane's copy button did not reach the Windows clipboard, so a
  different 117-character value was pasted as the password. Key `supabase-smtp-4`, created and copied in the
  owner's own browser, works; sign-up verified 19:54 UTC. Unused keys `supabase-smtp`, `-2`, `-3` deleted.

### Fixed — 2026-11-02, sign-ups failing (SMTP auth)

- Incident 19:35–19:40 UTC: every sign-up returned 500 because Resend rejected Supabase's SMTP password
  (`535 Authentication credentials invalid`); the saved value was not the full API key. No partial accounts
  were created (Supabase rolls back). Owner created key `supabase-smtp-2` and saved it in full (config reload 19:39:58).
- Sign-up and resend-code now show "We couldn't send your verification email…" on 5xx and log
  `signup_failed` / `resend_code_failed` (status, code, message; no email address) to Workers Logs. Version `e80cbbdd`.

### Released — 2026-11-02, verification codes by email

- Supabase custom SMTP via Resend (`no-reply@paradisetrades.com`); Resend DNS records in Cloudflare.
- "Confirm sign up" template now sends an 8-digit code (`{{ .Token }}`) instead of a link.
- Supabase minimum password length 6 → 10. Verify page copy updated. Worker version `fc4da62e`.

### Released — 2026-11-02, paradisetrades.com

- Custom domains `paradisetrades.com` and `www.paradisetrades.com` on the Worker (`wrangler.jsonc` routes);
  www → apex 308 redirect in middleware. Supabase Site URL switched. Version `d8b5dbfb`.
- Code-based verification page deployed with this release.

### Changed — 2026-11-02, code-based email verification

- `/check-email` replaced by `/verify-email`: users type the emailed code (`verifyOtp`, type `email`);
  "Send a new code" (`resend`, type `signup`). Unconfirmed sign-ins are routed there.
- Supabase "Confirm sign up" template still sends a link until custom SMTP is configured; the page
  says the link also works.
- Tests: 59 unit/component, 22 e2e.

### Released — 2026-11-02, Milestone 2 deploy

- Worker version `5dfa87fa-0579-439b-97c7-5dd7585dd17e`. Supabase Auth Site URL and redirect URLs set.
- E2E selector fix: filter `role=alert` by text (Next.js route announcer also uses that role in production).

### Added — 2026-11-02, Milestone 2 Network

- Full landing page; route groups `(marketing)`, `(auth)`, `(app)`; global 404.
- Email/password sign-up with confirmation, sign-in, POST sign-out, forgot/reset password, `/auth/callback`
  (PKCE code and token_hash), open-redirect-safe `next` handling.
- Middleware protects `/dashboard`, `/onboarding`, `/profile`; signed-in users skip `/sign-in`, `/sign-up`.
- Onboarding (create organization with auto slug), business profile editor (main + other trades, town,
  service radius, years, licence, insurance, draft/publish), dashboard checklist, public profile `/c/<slug>`.
- Migrations: `contractor_profiles.base_town`, `save_contractor_profile()` atomic RLS-checked RPC,
  last-owner guard trigger, RPC parameter defaults.
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- Tests: 48 unit/component, 18 e2e (signed-out flows, headers, validation, 404).

### Released — 2026-11-02, first deploy

- Worker `paradise` deployed to https://paradise.paradise-contractors.workers.dev
  (version `e0af56b7-a718-4781-9170-0367c59415d8`). Placeholder home page, `/api/health`, `/api/health/db`.
- Cloudflare account workers.dev subdomain changed from `thetallerstandard` to `paradise-contractors`.

### Added — 2026-11-02, GitHub

- Pushed to public repository `thetallerstandard-lab/Paradise-App`; CI run #1 passed.

### Added — 2026-11-02, Supabase connected

- Supabase project `iaruniafwipktocripud` (us-east-1): initial schema applied, trade categories seeded.
- Migration `harden_functions_and_policies`: helpers moved to `private` schema, trigger functions not
  API-callable, FK indexes, per-command write policies. Security advisor now clean.
- `supabase/tests/rls_smoke.sql` (13 checks, rolled back) — passes.
- `src/types/database.ts` regenerated from the live project.
- `/api/health/db` readiness endpoint; verified from the Workers preview.
- Wrangler logged in to the Cloudflare account.

### Verified — 2026-11-02

- Installed dependencies (lockfile committed with the first commit). Typecheck, lint, 19 unit/component tests,
  6 Playwright tests on `next dev`, OpenNext Cloudflare build, and 6 Playwright tests on the local Workers preview all pass.
- `wrangler.jsonc` compatibility date bumped to `2026-10-15`.
- `allowScripts` added to `package.json` for `esbuild` and `workerd` (npm 11).

### Added — 2026-11-02, Milestone 1 Foundation

- Next.js App Router project with strict TypeScript, Tailwind CSS v4, shadcn/ui configuration.
- Paradise design tokens (forest green, ivory, charcoal, brass) and base UI components.
- Placeholder home page, site header/footer, `/api/health`.
- Supabase browser, server, admin and middleware clients via `@supabase/ssr`; Zod env validation.
- Initial schema migration (users/profiles, organizations, memberships, trade categories,
  contractor profiles, service areas, resource requests, exchange offers) with RLS. Not applied.
- Domain modules with validation schemas: identity, organizations, network, marketplace.
  README-only placeholders: points, business, marketing, billing.
- OpenNext Cloudflare adapter config, `wrangler.jsonc`, deployment scripts.
- ESLint, Vitest, Playwright configuration; unit, component and e2e smoke tests (not yet run).
- GitHub Actions CI workflow (not yet run).
- Documentation tree under `docs/` and root `CLAUDE.md`.
