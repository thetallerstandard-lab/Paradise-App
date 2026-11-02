# Next steps

## Finish code-based email verification

Domain `paradisetrades.com` is live and the `/verify-email` page is deployed. Remaining:

1. **Owner decides the email provider** for Supabase custom SMTP:
   - **Cloudflare Email Sending** — `smtp.mx.cloudflare.net:465`, username `api_token`, password = a Cloudflare API
     token with *Email Sending: Edit*. Sending to arbitrary recipients requires **Workers Paid ($5/month)**.
     DNS (SPF/DKIM) is set automatically because the zone is on Cloudflare.
   - **Resend** — free tier (3,000 emails/month, 100/day); owner creates the account, domain verified with DNS
     records in Cloudflare; SMTP `smtp.resend.com:465`, username `resend`, password = Resend API key.
2. Owner pastes the SMTP credentials into Supabase → Authentication → Emails → SMTP Settings
   (sender `no-reply@paradisetrades.com`, name `Paradise`). Credentials never go in Git or chat.
3. Switch the "Confirm sign up" template to the code template in
   [AUTHENTICATION.md](../architecture/AUTHENTICATION.md); raise Supabase's minimum password length to 10.
4. Owner does one real sign-up at https://paradisetrades.com/sign-up and enters the code.

## Then

- Add `NEXT_PUBLIC_SUPABASE_*` GitHub repository secrets.
- Milestone 2b — contractor map (Mapbox token, nonce-based CSP). See
  [features/network/CONTRACTOR_MAP.md](../features/network/CONTRACTOR_MAP.md).
- Milestone 3 — Exchange. See [milestones/MILESTONE_03_EXCHANGE.md](../milestones/MILESTONE_03_EXCHANGE.md).
