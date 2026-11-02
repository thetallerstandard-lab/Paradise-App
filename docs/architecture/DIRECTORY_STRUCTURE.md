# Directory structure

Actual layout as of Milestone 1:

```
.
├── CLAUDE.md                     rules for AI/human contributors
├── README.md
├── package.json                  scripts and dependency ranges
├── tsconfig.json                 strict TypeScript, @/* -> src/*
├── next.config.ts                Next.js config + OpenNext dev hook
├── open-next.config.ts           OpenNext Cloudflare adapter config
├── wrangler.jsonc                Cloudflare Worker config
├── eslint.config.mjs · postcss.config.mjs · components.json
├── vitest.config.ts · playwright.config.ts
├── .env.example · .dev.vars.example
├── .github/workflows/ci.yml
├── docs/                         documentation (this tree)
├── supabase/
│   ├── migrations/               ordered SQL migrations
│   └── seed.sql                  trade categories
├── src/
│   ├── app/                      routes, layouts, route handlers
│   │   ├── layout.tsx · page.tsx · globals.css
│   │   └── api/health/route.ts
│   ├── components/
│   │   ├── ui/                   shadcn/ui primitives
│   │   ├── layout/               container, header, footer
│   │   └── brand/                wordmark
│   ├── modules/                  business domains (see below)
│   ├── lib/
│   │   ├── supabase/             client.ts, server.ts, admin.ts, middleware.ts
│   │   ├── env.ts · env.server.ts · brand.ts · utils.ts
│   ├── types/database.ts         Supabase Database type
│   └── middleware.ts             session refresh
└── tests/
    ├── unit/ · components/       Vitest
    └── e2e/                      Playwright
```

## Modules

| Module | Owns | Status |
| --- | --- | --- |
| `identity` | Users, auth flows, `profiles` | Schemas implemented |
| `organizations` | Organizations, memberships, roles | Schemas implemented |
| `network` | Contractor profiles, trades, service areas, map | Schemas implemented |
| `marketplace` | Resource requests, exchange offers | Schemas + transition rules implemented |
| `points` | Paradise Points balances and ledger | Planned |
| `business` | CRM, estimating, scheduling | Planned |
| `marketing` | Portfolios, promotion | Planned |
| `billing` | Subscriptions, payments | Planned |

## Rules

- `src/app` may import from `modules`, `components`, `lib`, `types`.
- `modules/<a>` may import `lib`, `types`, and other modules **only through their `index.ts`**.
- `components` must not import server-only code (`lib/supabase/admin`, `lib/env.server`) — enforced by ESLint for the admin client.
- `lib` must not import `modules` or `app`.
