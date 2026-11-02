# identity

Users, sign-up, sign-in, sessions, and the `profiles` table.

- Auth is Supabase Auth; sessions live in cookies managed by `@supabase/ssr`
  (`src/lib/supabase/*`, `src/middleware.ts`).
- Implemented: input validation schemas (`schemas.ts`).
- Planned (Milestone 2): sign-up/sign-in flows, `getCurrentUser()` helper, profile editing.

Docs: [AUTHENTICATION.md](../../../docs/architecture/AUTHENTICATION.md)
