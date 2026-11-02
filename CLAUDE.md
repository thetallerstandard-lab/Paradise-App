# CLAUDE.md

Authoritative rules for Claude Code sessions in this repository.

## Before changing anything

1. Read `README.md`, `docs/CURRENT_STATUS.md`, and `docs/development/NEXT_STEPS.md`.
2. Inspect the existing code you are about to touch. Do not rewrite what you have not read.

## While working

3. **Preserve existing functionality and data.** Never drop tables, delete migrations,
   or overwrite working code without explaining the consequence and getting approval.
   Schema changes go in new files under `supabase/migrations/`; never edit an applied migration.
4. **Follow the modular monolith.** Routes in `src/app`, domain logic in `src/modules/<domain>`,
   infrastructure in `src/lib`, shared UI in `src/components`. Modules import each other only
   via `index.ts`. Do not implement planned modules (`points`, `business`, `marketing`, `billing`)
   unless the task says so.
5. **Keep TypeScript strict.** No `any`, no `@ts-ignore`, no loosening `tsconfig.json`.
   Validate external input with Zod.
6. **Secure by default, organization-scoped.** Business data belongs to an organization.
   Every table has RLS enabled with policies using `private.is_org_member` / `private.has_org_role`.
   After any schema change: run the Supabase advisors, re-run `supabase/tests/rls_smoke.sql`, regenerate types.
   Authorize on the server; the UI hiding a button is not authorization.
   `src/lib/supabase/admin.ts` (bypasses RLS) is server-only and needs an explicit authorization check at each call site.
   Never expose secrets to the client or prefix them with `NEXT_PUBLIC_`.
7. **Preserve Cloudflare Workers compatibility.** No Vercel APIs. No long-lived TCP database
   connections, `fs` writes, or native Node addons in server code. Database access goes through
   `@supabase/supabase-js` / `@supabase/ssr` over HTTP. Create Supabase clients per request.

## Before finishing

8. Run the relevant checks: `npm run typecheck`, `npm run lint`, `npm run test`, and
   `npm run test:e2e` for UI changes.
9. **Run `npm run cf:build`** (or `npm run preview`) whenever you change server-side dependencies,
   middleware, `next.config.ts`, `open-next.config.ts`, or `wrangler.jsonc`.
10. Update the docs your change affects, plus `docs/CURRENT_STATUS.md`, `docs/CHANGELOG.md`,
    and `docs/development/NEXT_STEPS.md`. Record decisions as ADRs in `docs/decisions/`.
11. Record incomplete work and blockers in `docs/CURRENT_STATUS.md` and
    `docs/development/KNOWN_ISSUES.md`.
12. **Never claim a feature is complete, tested, or deployed without having verified it in this
    session.** Use the status vocabulary in `docs/README.md` (Planned / Implemented / Tested / Released).

Never deploy to production (`npm run deploy`) without explicit approval from the project owner.
