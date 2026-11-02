# Cloudflare architecture

**Status:** configuration **Tested locally** — `cf:build` and the workerd preview pass
(2026-11-02, gzip bundle 1.03 MiB). **Never deployed.** Decision record: [ADR-0002](../decisions/ADR-0002-cloudflare-hosting.md).

## How Paradise runs on Cloudflare

`@opennextjs/cloudflare` compiles the Next.js build into `.open-next/`:

- `.open-next/worker.js` — the Worker entry (`main` in `wrangler.jsonc`). Handles SSR, route
  handlers, server actions, and middleware in the Workers runtime with `nodejs_compat`.
- `.open-next/assets/` — static files, served by the **Workers Assets** binding `ASSETS`.

| Binding / setting | Value | Why |
| --- | --- | --- |
| `name` | `paradise` | Worker name, also the `*.workers.dev` subdomain |
| `compatibility_flags` | `nodejs_compat`, `global_fetch_strictly_public` | Required by OpenNext; safer fetch |
| `compatibility_date` | `2026-10-15` | Pin; bump deliberately |
| `ASSETS` | `.open-next/assets` | Static assets |
| `WORKER_SELF_REFERENCE` | service binding to `paradise` | Used by OpenNext for revalidation |
| `observability.enabled` | `true` | Workers Logs |
| `vars.APP_ENV` | `production` | Non-secret runtime flag |
| Secret `SUPABASE_SECRET_KEY` | via `wrangler secret put` | Never in config |

## Environment variables on Workers

- **`NEXT_PUBLIC_*` are build-time.** Next.js inlines them into client and server bundles during
  `opennextjs-cloudflare build`. They must be in the shell or `.env.production` when building — setting
  them only in the Cloudflare dashboard has no effect.
- **Server secrets are runtime.** OpenNext copies Worker vars and secrets into `process.env` per request,
  so `process.env.SUPABASE_SECRET_KEY` works in server code. `getCloudflareContext().env` is the typed alternative.
- Locally, `.dev.vars` supplies runtime values to `npm run preview`.

## Runtime constraints we design around

- No persistent TCP connections → database over HTTP with `supabase-js` ([TECH_STACK.md](TECH_STACK.md)).
- No writable filesystem → uploads go to Supabase Storage.
- Isolates are reused across requests → no per-user state at module scope; create clients per request.
- Worker size limit (3 MiB compressed on Free, 10 MiB on Paid) → watch bundle size; avoid heavy server deps.
- CPU time limits per request → keep heavy work in Postgres functions.

## Not used (yet)

- **Incremental cache (R2) / ISR.** Pages are dynamic. Add an R2 incremental cache in `open-next.config.ts` if ISR is adopted.
- **Image optimization binding.** Not configured; `next/image` is not used yet.
- **D1, KV, Durable Objects, Queues, Hyperdrive.** Postgres is the only database ([ADR-0001](../decisions/ADR-0001-initial-architecture.md)).
- **R2 for uploads.** Supabase Storage for now.

Operations: [../development/CLOUDFLARE_DEPLOYMENT.md](../development/CLOUDFLARE_DEPLOYMENT.md).
