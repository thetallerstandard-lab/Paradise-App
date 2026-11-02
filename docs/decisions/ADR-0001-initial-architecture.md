# ADR-0001: Initial architecture — modular monolith on Next.js + Supabase

- Status: Accepted
- Date: 2026-11-02

## Context

Paradise is a small team's long-term product with five planned ecosystems. It must
launch an MVP quickly, run cheaply, and stay changeable for years. Data is
relational, organization-scoped, and partly geospatial.

## Decision

1. **Modular monolith.** One Next.js App Router application. Domains live in
   `src/modules/<domain>` with explicit public `index.ts` APIs. No microservices.
2. **Supabase** for Postgres (+ PostGIS), Auth, and Storage. Postgres is the only primary database.
3. **Database access over HTTP with `supabase-js` / `@supabase/ssr`**, per request, as the
   signed-in user so **RLS applies to every query**. Complex reads/writes become Postgres
   functions called via RPC. No ORM with a direct privileged connection.
4. **Organization-first authorization** enforced in server code *and* RLS/triggers.
5. **No extra infrastructure** (Redis, queues, Kubernetes, D1, KV) until a measured need exists.
6. Strict TypeScript, Zod at boundaries, Vitest + Playwright.

## Consequences

- Fast to build; one deploy; easy local reasoning.
- Security rules live in SQL and must be tested at the database level.
- Supabase vendor dependency for auth and storage; Postgres itself remains portable.
- Transactions spanning several tables must be SQL functions.

## Alternatives considered

- **Prisma/Drizzle with direct Postgres:** better TS ergonomics, but bypasses RLS and needs
  TCP/pooling on Workers (Hyperdrive). Rejected for now.
- **Separate API service:** more infrastructure with no MVP benefit.
