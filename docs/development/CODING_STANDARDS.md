# Coding standards

## TypeScript

- `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` stay on.
- No `any`, `@ts-ignore` or non-null `!` to silence errors; narrow types instead.
- Validate untrusted input (forms, params, env, webhooks) with Zod; infer types from schemas.
- Prefer named exports. Pages, layouts and route handlers use Next.js default-export conventions.

## Structure

- Follow [DIRECTORY_STRUCTURE.md](../architecture/DIRECTORY_STRUCTURE.md). Keep `src/app` thin; logic goes in modules.
- Imports via the `@/` alias. Cross-module imports only through `index.ts`.
- Server-only files import `server-only`.

## React / Next.js

- Server Components by default; add `"use client"` only where needed (state, effects, browser APIs).
- Mutations via Server Actions or route handlers that authenticate, validate, authorize, then call Supabase.
- Create Supabase clients inside the request (never at module scope).

## Workers compatibility

- No `fs` writes, `child_process`, native addons, or long-lived TCP connections in server code.
- Before adding a server-side dependency, check it works on Workers with `nodejs_compat`, then run `npm run cf:build`.

## Styling

- Tailwind utilities with semantic tokens (`bg-primary`, `text-muted-foreground`), not raw hex.
- Mobile-first: base styles for phones, `sm:`/`md:`/`lg:` to enhance.
- Use `cn()` to merge classes. Add shadcn components with `npx shadcn@latest add`.

## Database

- New migration file per change: `supabase/migrations/<YYYYMMDDHHMMSS>_<name>.sql`.
- Every new table: UUID PK, timestamps, RLS enabled, policies, indexes on FKs.
- Functions: `set search_path = ''`; `SECURITY DEFINER` only with justification in a comment.

## Git

- Small commits with imperative messages. Branch per feature; PR into `main` once a remote exists.
- Never commit `.env.local`, `.dev.vars`, or keys.
