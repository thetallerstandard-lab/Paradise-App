# Cloudflare deployment

**Status: build and local preview pass (2026-11-02); never deployed; Wrangler not logged in.** Architecture:
[CLOUDFLARE_ARCHITECTURE.md](../architecture/CLOUDFLARE_ARCHITECTURE.md).

## 1. Account setup

1. Create or sign in to a Cloudflare account (dash.cloudflare.com). The Workers Free plan is enough to
   start; Workers Paid ($5/mo) raises the bundle-size and CPU limits and is recommended before launch.
2. Workers & Pages → note your `*.workers.dev` subdomain.
3. If using a custom domain, add the domain to Cloudflare (nameservers pointed at Cloudflare).

## 2. Wrangler authentication

```bash
npx wrangler login      # opens a browser to authorize
npx wrangler whoami     # confirm account
```

For CI, create an API token (My Profile → API Tokens → "Edit Cloudflare Workers" template) and set
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub secrets. Never commit them.

## 3. Environment variables and secrets

| Name | Kind | How to set for production |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build-time | shell / CI env / `.env.production` when running the build |
| `NEXT_PUBLIC_SUPABASE_URL` | build-time | same |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | build-time | same |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | build-time | same (from Milestone 2) |
| `SUPABASE_SECRET_KEY` | runtime **secret** | `npx wrangler secret put SUPABASE_SECRET_KEY` |
| `APP_ENV` | runtime var | `wrangler.jsonc` → `vars` |

`NEXT_PUBLIC_*` values set only in the Cloudflare dashboard **do nothing**: they are compiled in at build time.
Full list: [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md).

## 4. Build

```bash
npm run cf:build        # next build + OpenNext transform -> .open-next/
```

## 5. Preview locally in the Workers runtime

```bash
npm run preview         # build + wrangler dev on http://localhost:8787, reads .dev.vars
```

Check `/`, `/api/health`, and (from Milestone 2) sign-in/out with session persistence.

## 6. Deploy (requires approval)

```bash
npm run deploy          # build + upload + activate immediately
```

Safer, staged alternative:

```bash
npm run upload                                # uploads a new version without routing traffic to it
npx wrangler versions deploy                  # choose the version / gradual percentage
```

## 7. Custom domain

Workers & Pages → `paradise` → Settings → Domains & Routes → **Add Custom Domain** (e.g. `paradise.example`).
Cloudflare issues the certificate. Or add to `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "app.example.com", "custom_domain": true }]
```

Then update `NEXT_PUBLIC_SITE_URL`, rebuild, and add the domain to Supabase Auth redirect URLs and the Mapbox token's allowed URLs.

## 8. Production troubleshooting

| Symptom | Check |
| --- | --- |
| 500 on every page | `npx wrangler tail` for the stack trace; Workers Logs in the dashboard (observability enabled) |
| `Missing or invalid public environment variables` | `NEXT_PUBLIC_*` were absent at **build** time; rebuild with them set |
| `Missing or invalid server environment variables` | `npx wrangler secret list`; set the secret |
| Users logged out on each request | Supabase redirect URL / Site URL mismatch; cookies blocked; middleware matcher excludes the route |
| Error mentioning a Node.js module | Dependency not Workers-compatible; confirm `nodejs_compat`; replace the dependency |
| `Script startup exceeded CPU time limit` or size errors | Bundle too large; inspect `.open-next/`, remove heavy server deps; consider Workers Paid |
| Works in `next dev`, fails deployed | Reproduce with `npm run preview` (same runtime as production) |

## 9. Rollback

```bash
npx wrangler deployments list     # find the last good version
npx wrangler rollback [version-id]
```

Or dashboard → Workers → `paradise` → Deployments → Rollback. Rollback restores code only:
**database migrations are not rolled back**, which is why migrations must stay backwards-compatible
with the previous release. Secrets are shared across versions.
