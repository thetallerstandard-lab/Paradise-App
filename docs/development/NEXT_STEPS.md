# Next steps

## Milestone 1 — complete

Done on 2026-11-02: local verification, Supabase project + migrations + seed, generated types,
GitHub repository with green CI, and first deploy to https://paradise.paradise-contractors.workers.dev.

## Next: Milestone 2 (Prompt 2)

Complete Paradise landing page, authentication experience (sign-up, sign-in, sign-out, callback,
protected routes), and contractor onboarding (create organization → contractor profile).

First tasks:
1. Supabase Auth → URL configuration: Site URL `https://paradise.paradise-contractors.workers.dev`;
   redirect URLs for that origin, `http://localhost:3000/**` and `http://localhost:8787/**`.
2. Add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` GitHub repository secrets.
3. Decide on deploys from CI (Workers Builds or a GitHub Action with a scoped API token) vs. manual.

See [MILESTONE_02_NETWORK.md](../milestones/MILESTONE_02_NETWORK.md).
