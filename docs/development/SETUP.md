# Local setup

## Prerequisites

| Tool | Version | Check |
| --- | --- | --- |
| Node.js | 22 LTS (≥ 20.18) | `node --version` |
| npm | bundled with Node | `npm --version` |
| Git | any recent | `git --version` |
| Supabase CLI (optional, for local DB) | latest via `npx supabase` | needs Docker Desktop for `supabase start` |

On Windows: `winget install OpenJS.NodeJS.LTS` and `winget install Git.Git`. For Cloudflare
builds, **WSL 2 (Ubuntu) is recommended** — see [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## First run

```bash
npm install                   # npm 11+: if prompted, `npm install-scripts approve esbuild workerd`
cp .env.example .env.local    # PowerShell: Copy-Item .env.example .env.local
cp .dev.vars.example .dev.vars
npm run dev
```

Open http://localhost:3000. Without Supabase values the home page still renders; auth middleware is skipped.

## Supabase

### Hosted project (simplest)

1. Create a project at supabase.com (region: US East, closest to Pennsylvania).
2. Project Settings → API: copy the URL and **publishable** key into `.env.local`; the **secret** key into
   `.env.local` and `.dev.vars` as `SUPABASE_SECRET_KEY`.
3. Apply the schema:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```
4. Seed trade categories: run `supabase/seed.sql` in the SQL editor.
5. Regenerate types: `npx supabase gen types typescript --project-id <ref> > src/types/database.ts`.
6. Auth → URL configuration: add `http://localhost:3000/**` and `http://localhost:8787/**` as redirect URLs.

### Local stack (optional)

`npx supabase init` (creates `supabase/config.toml`; keep existing migrations), then `npx supabase start`
and `npx supabase db reset` to apply migrations + seed. Use the printed local URL and keys.

## Everyday commands

See the table in the root [README.md](../../README.md) and [TESTING.md](TESTING.md).
