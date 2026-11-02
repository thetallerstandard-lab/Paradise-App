# Next steps

## Milestone 1 — complete except first deploy

Done on 2026-11-02: local verification, Supabase project + migrations + seed, generated types,
Wrangler login, GitHub repository with green CI. Optional remaining item:

- First deploy to `*.workers.dev` — **only with the project owner's explicit approval**.
  Build with production `NEXT_PUBLIC_*` values, `npm run deploy`, then check `/` and `/api/health/db`.

## Next: Milestone 2 (Prompt 2)

Complete Paradise landing page, authentication experience (sign-up, sign-in, sign-out, callback,
protected routes), and contractor onboarding (create organization → contractor profile).
First tasks: configure Supabase Auth Site URL and redirect URLs; add `NEXT_PUBLIC_SUPABASE_*` GitHub
repository secrets. See [MILESTONE_02_NETWORK.md](../milestones/MILESTONE_02_NETWORK.md).
