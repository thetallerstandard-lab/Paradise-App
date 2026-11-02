# Milestone 2 — Network

**Status: Implemented and tested locally (dev + Workers preview), not yet deployed.** 2026-11-02.
Built from this document (no separate Prompt 2 spec). The contractor map is deferred to Milestone 2b.

## Delivered

| Scope item | Status | Where |
| --- | --- | --- |
| Landing page | Tested | `src/app/(marketing)/page.tsx` — hero, how it works, Network, Exchange, Points, local towns, future ecosystems, CTA |
| Sign-up (email + password, email confirmation) | Implemented; form validation tested | `src/app/(auth)/sign-up`, `actions.ts` |
| Sign-in / sign-out | Tested (Workers preview, manual) | `src/app/(auth)/sign-in`, `src/app/auth/sign-out/route.ts` (POST) |
| Email link callback (PKCE code + token_hash) | Implemented; invalid-link path tested | `src/app/auth/callback/route.ts` |
| Password reset | Implemented, **not exercised end-to-end** (needs a real inbox) | `forgot-password`, `reset-password` |
| Protected route group | Tested | `src/middleware.ts` + `requireUser()` in `(app)/layout.tsx` |
| Onboarding: create organization | Tested (manual) | `src/app/(app)/onboarding` |
| Contractor profile editor (trades, town, radius, credentials, draft/publish) | Tested (manual) | `src/app/(app)/profile`, `save_contractor_profile()` RPC |
| Dashboard with setup checklist | Tested (manual) | `src/app/(app)/dashboard` |
| Public profile page `/c/<slug>` | Tested | `src/app/(marketing)/c/[slug]` |
| Security headers (CSP, HSTS, nosniff, frame-ancestors, referrer, permissions) | Tested (e2e) | `next.config.ts` |
| Last-owner guard | Tested (SQL) | migration `20261102020000_onboarding.sql` |
| Contractor map (Mapbox) | **Deferred** | Data is ready: `map_point`, `base_town`, primary service area |
| pgTAP RLS tests in CI | **Deferred** | Manual SQL smoke tests exist |

## Exit criteria

| Criterion | State |
| --- | --- |
| New contractor goes from landing page to published profile | ✅ on Workers preview (test user created confirmed via SQL; email confirmation link itself not exercised) |
| Session persists across navigation on Workers preview | ✅ |
| Session persists on deployed Worker | ⏳ after next deploy |
| Unit, component, e2e and `cf:build` pass | ✅ locally; CI on push |
| Visible on the map | ⏳ Milestone 2b |
