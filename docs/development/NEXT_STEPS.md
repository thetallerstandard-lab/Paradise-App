# Next steps

## Code-based email verification (in progress)

App side done and tested (`/verify-email`), not deployed. Blocked on email:
1. Owner chooses an email provider and connects it as custom SMTP in Supabase (Authentication → Emails → SMTP Settings).
   A sending domain the owner controls is strongly recommended for deliverability.
2. Set the "Confirm sign up" template to the code template in AUTHENTICATION.md.
3. Deploy, then one real sign-up to confirm the code arrives and verifies.

## Close out Milestone 2

Done 2026-11-02: Supabase Auth URL configuration, deploy (version `5dfa87fa`), production e2e green.

1. **Owner:** sign up at https://paradise.paradise-contractors.workers.dev/sign-up with a real email, click the
   confirmation link, create the business, publish the profile, open the public page, sign out and back in, and
   try "Forgot your password". Report anything that breaks.
2. **Custom SMTP** for Supabase Auth (e.g. Resend, Postmark) before inviting real contractors — the built-in
   sender is rate-limited and for testing only.
3. Add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` GitHub repository secrets.

## Then: Milestone 2b — contractor map

Mapbox GL in a client component, `contractors_in_bbox()` Postgres function (SECURITY INVOKER) returning published
profiles' approximate points, trade filter, list view. Needs a URL-restricted Mapbox public token, and a
nonce-based CSP before loading Mapbox scripts. See [features/network/CONTRACTOR_MAP.md](../features/network/CONTRACTOR_MAP.md).

## After that: Milestone 3 — Exchange

See [milestones/MILESTONE_03_EXCHANGE.md](../milestones/MILESTONE_03_EXCHANGE.md).
