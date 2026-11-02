# Next steps

## Close out Milestone 1

Local verification passed on 2026-11-02 ([CURRENT_STATUS.md](../CURRENT_STATUS.md)). Remaining:

1. Create the GitHub repository, push `main` (initial commit done), and confirm CI passes.
2. **Supabase project**: create it, fill `.env.local` / `.dev.vars`, `npx supabase link` + `npx supabase db push`,
   run `supabase/seed.sql`, regenerate `src/types/database.ts`, and confirm the middleware session refresh
   works under both `npm run dev` and `npm run preview`.
3. **Cloudflare**: owner runs `npx wrangler login`, then `npx wrangler whoami`.
4. Optional first deploy to `*.workers.dev` — **only with the project owner's explicit approval**.

## Then: Milestone 2 (Prompt 2)

Complete Paradise landing page, authentication experience (sign-up, sign-in, sign-out, callback,
protected routes), and contractor onboarding (create organization → contractor profile).
See [MILESTONE_02_NETWORK.md](../milestones/MILESTONE_02_NETWORK.md).
