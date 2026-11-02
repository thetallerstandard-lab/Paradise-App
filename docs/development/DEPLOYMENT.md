# Deployment

**Status: deployed** 2026-11-02 (manual `npm run deploy` from the owner's machine).
Production deploys require explicit approval from the project owner.

## Environments

| Environment | Runtime | Database | URL |
| --- | --- | --- | --- |
| Local dev | `next dev` (Node.js) | Supabase (hosted dev project or local stack) | http://localhost:3000 |
| Local Workers preview | `wrangler dev` via `npm run preview` (workerd) | same as dev | http://localhost:8787 |
| Production | Cloudflare Worker `paradise` | Supabase project `iaruniafwipktocripud` | https://paradise.paradise-contractors.workers.dev → custom domain (TBD) |
| Staging (planned) | Worker `paradise-staging` (wrangler `env.staging`) | Supabase staging project | TBD |

## Pipeline

1. PR → GitHub Actions runs typecheck, lint, unit tests, `cf:build`, Playwright ([.github/workflows/ci.yml](../../.github/workflows/ci.yml)).
2. Merge to `main`.
3. Database migrations applied first (`npx supabase db push` against production), backwards-compatible with the running code.
4. `npm run deploy` (manual, approved). Later: Workers Builds (Cloudflare's Git integration) or a GitHub Action with a scoped API token.

Cloudflare specifics, secrets, domains, troubleshooting and rollback:
[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md).
