# Milestone 2 — Network

**Status: Planned.** Starts after Milestone 1 is verified.

## Scope

1. **Landing page** — full marketing page per [LANDING_PAGE.md](../product/LANDING_PAGE.md).
2. **Authentication** — sign-up, sign-in, sign-out, email confirmation callback, password reset,
   protected route group, `getCurrentUser()` ([AUTHENTICATION.md](../architecture/AUTHENTICATION.md)).
3. **Onboarding** — create organization (slug from name), create contractor profile (trades,
   details, map point, service area), publish.
4. **Contractor directory + map** — Mapbox map of published profiles, trade filter, public profile pages
   ([CONTRACTOR_MAP.md](../features/network/CONTRACTOR_MAP.md)).
5. Security headers; last-owner guard; first pgTAP tests for RLS.

## Exit criteria

- A new contractor can go from landing page to published profile visible on the map.
- Session persists across reloads **on the Workers preview and the deployed Worker**.
- Unit, component, e2e (incl. auth happy path) and `cf:build` pass in CI.
- Docs and status updated.
