# Next steps

## Close out Milestone 1

Done on 2026-11-02: local verification, Supabase project + migrations + seed, generated types,
Wrangler login. Remaining:

1. Create the GitHub repository, push `main`, and confirm CI passes.
2. Optional first deploy to `*.workers.dev` — **only with the project owner's explicit approval**.
   Before deploying, build with production `NEXT_PUBLIC_*` values and check `/api/health/db` after deploy.

## Then: Milestone 2 (Prompt 2)

Complete Paradise landing page, authentication experience (sign-up, sign-in, sign-out, callback,
protected routes), and contractor onboarding (create organization → contractor profile).
First tasks: configure Supabase Auth Site URL and redirect URLs; set `SUPABASE_SECRET_KEY` locally if
an admin task needs it. See [MILESTONE_02_NETWORK.md](../milestones/MILESTONE_02_NETWORK.md).
