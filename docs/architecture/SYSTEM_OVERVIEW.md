# System overview

Paradise is a **modular monolith**: one Next.js application, deployed as one
Cloudflare Worker, backed by one Supabase project.

```
Browser ──HTTPS──► Cloudflare Worker "paradise" (Next.js via OpenNext)
   │                 ├─ static assets (Workers Assets binding)
   │                 ├─ middleware: refresh Supabase session cookies
   │                 └─ server components / actions / route handlers
   │                          │  supabase-js over HTTPS (PostgREST, Auth, Storage)
   │                          ▼
   └──(publishable key, RLS)─► Supabase: Postgres + PostGIS, Auth, Storage
Browser ──► Mapbox GL (tiles, public token)              [Milestone 2]
```

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routes & UI | `src/app` | Pages, layouts, route handlers, server actions. Thin. |
| Shared UI | `src/components` | shadcn/ui primitives, layout, brand. |
| Domains | `src/modules/*` | Validation, business rules, data access per domain. |
| Infrastructure | `src/lib` | Supabase clients, env, utilities. |
| Database | `supabase/migrations` | Schema, RLS, triggers — the final authority on data rules. |

## Domain boundaries

`identity`, `organizations`, `network`, `marketplace` are active for the MVP.
`points`, `business`, `marketing`, `billing` are documented placeholders.
See [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md).

## Key properties

- **Stateless compute.** Workers keep no connection pools or in-memory sessions; all state is in Supabase.
- **Defence in depth.** Server-side checks in modules, plus RLS and triggers in Postgres ([AUTHORIZATION.md](AUTHORIZATION.md)).
- **No extra infrastructure.** No Redis, queues, D1, KV or microservices ([ADR-0001](../decisions/ADR-0001-initial-architecture.md)).

Related: [CLOUDFLARE_ARCHITECTURE.md](CLOUDFLARE_ARCHITECTURE.md), [DATABASE_DESIGN.md](DATABASE_DESIGN.md).
