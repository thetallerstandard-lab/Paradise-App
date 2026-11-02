# Next steps

## Finish Milestone 2

1. **Supabase Auth → URL configuration** (dashboard):
   - Site URL: `https://paradise.paradise-contractors.workers.dev`
   - Redirect URLs: `https://paradise.paradise-contractors.workers.dev/**`, `http://localhost:3000/**`, `http://localhost:8787/**`
2. **Deploy** (owner approval required):
   `$env:NEXT_PUBLIC_SITE_URL = "https://paradise.paradise-contractors.workers.dev"; npm run deploy`,
   then run the e2e suite against production and one real sign-up with a real inbox (confirm link, onboarding, publish).
3. **Custom SMTP** for Supabase Auth (e.g. Resend, Postmark) before inviting real contractors.
4. Add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` GitHub repository secrets.

## Then: Milestone 2b — contractor map

Mapbox GL in a client component, `contractors_in_bbox()` Postgres function (SECURITY INVOKER) returning published
profiles' approximate points, trade filter, list view. Needs a URL-restricted Mapbox public token.
See [features/network/CONTRACTOR_MAP.md](../features/network/CONTRACTOR_MAP.md).

## After that: Milestone 3 — Exchange

See [milestones/MILESTONE_03_EXCHANGE.md](../milestones/MILESTONE_03_EXCHANGE.md).
