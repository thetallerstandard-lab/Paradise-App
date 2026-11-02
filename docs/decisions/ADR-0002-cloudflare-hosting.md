# ADR-0002: Host on Cloudflare Workers via OpenNext

- Status: Accepted
- Date: 2026-11-02

## Context

The project owner chose Cloudflare as the hosting platform. Next.js does not run
natively on Workers; an adapter is required. Vercel-specific features must not be relied on.

## Decision

- Deploy the Next.js app as a single **Cloudflare Worker** (`paradise`) using
  **`@opennextjs/cloudflare`** (the adapter Cloudflare documents for Next.js), with **Wrangler 4**.
- Use **Next.js 15.5** for the initial build: mature OpenNext support, Edge-runtime middleware.
- `compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"]`.
- Static assets via the Workers Assets binding; no ISR/incremental cache initially.
- Server secrets via `wrangler secret put`; `NEXT_PUBLIC_*` provided at build time.
- Keep server code Workers-safe: HTTP-only database access, no filesystem writes, no native addons,
  no module-scope per-request state.
- Do not adopt D1/KV/R2 merely because we are on Cloudflare (see ADR-0001).

## Consequences

- Global edge execution, generous free tier, one platform for DNS, domain and hosting.
- Every change to server dependencies or config must be verified with `npm run cf:build` / `npm run preview`,
  not only `next dev` (which runs on Node.js).
- Worker bundle-size limits constrain heavy server dependencies.
- OpenNext's Windows support is limited; builds should run in CI (Linux) or WSL. See KNOWN_ISSUES.
- Some Next.js features may lag on OpenNext; check its docs before adopting new ones.

## Alternatives considered

- **Cloudflare Pages + `@cloudflare/next-on-pages`:** older, Edge-runtime-only approach; Cloudflare now
  recommends OpenNext on Workers.
- **Static export to Pages:** loses SSR, auth middleware and server actions.
- **Vercel:** excluded by the project owner.
