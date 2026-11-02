# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/). Versions are
assigned at first release.

## [Unreleased]

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
