# Paradise

**Independent by Trade. Connected by Paradise.**

Paradise is a hyperlocal professional network for independent contractors,
launching in Lancaster County, Pennsylvania. The first release covers
**Paradise Network** (profiles, map, trust) and **Paradise Exchange** (resource
requests and point-denominated offers).

> **Status:** Milestone 1 (Foundation) — locally verified (tests, Cloudflare build, Workers preview). Not deployed; Supabase not connected.
> See [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md).

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Supabase
(Postgres, Auth, PostGIS, Storage) · Mapbox · Zod · Vitest · Playwright ·
Cloudflare Workers via OpenNext. Details: [docs/architecture/TECH_STACK.md](docs/architecture/TECH_STACK.md).

## Quick start

Requires Node.js 20.18+ (22 LTS recommended) and Git.

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

| Task | Command |
| --- | --- |
| Next.js dev server | `npm run dev` |
| Type check / lint / unit tests | `npm run typecheck` · `npm run lint` · `npm run test` |
| End-to-end smoke tests | `npm run test:e2e` |
| Workers build only | `npm run cf:build` |
| Local Workers preview | `npm run preview` |
| Deploy to Cloudflare | `npm run deploy` (needs approval — see deployment docs) |

Full setup: [docs/development/SETUP.md](docs/development/SETUP.md) ·
Deployment: [docs/development/CLOUDFLARE_DEPLOYMENT.md](docs/development/CLOUDFLARE_DEPLOYMENT.md)

## Documentation

Start at [docs/README.md](docs/README.md). Contributors (human or AI) read
[CLAUDE.md](CLAUDE.md) first.
