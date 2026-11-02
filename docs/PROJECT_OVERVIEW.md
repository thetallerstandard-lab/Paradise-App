# Project overview

**Paradise** — *Independent by Trade. Connected by Paradise.*

A hyperlocal professional network and business platform for independent
contractors: owner-operators and small crews in the building trades.

## Problem

Independent contractors depend on local relationships for referrals, borrowed
equipment, extra hands, and subcontract work, but those relationships live in
phone contacts and word of mouth. Finding a trusted excavator with a free day,
or renting a lift from a nearby contractor instead of a rental yard, is slow
and informal.

## Product

Five long-term ecosystems ([VISION.md](VISION.md)):

| Ecosystem | Purpose | Status |
| --- | --- | --- |
| Paradise Network | Profiles, local map, trust, referrals | Planned (MVP) |
| Paradise Exchange | Equipment, labor, materials, subcontracting requests; point-denominated offers | Planned (MVP) |
| Paradise Business | CRM, estimating, scheduling, operations | Planned (later) |
| Paradise Media | Portfolios, promotion, marketing | Planned (later) |
| Maestro Integration | Apprenticeships with a separate nonprofit | Planned (later) |

## MVP scope

Contractors can register, create an organization and business profile, appear
on a map, post resource requests, and submit or accept offers denominated in
Paradise Points. **Points do not transfer in the MVP**; that needs the ledger
described in [features/exchange/TRANSACTION_LEDGER.md](features/exchange/TRANSACTION_LEDGER.md).

## Launch market

Lancaster County, Pennsylvania.

## Hosting and data

Cloudflare Workers (Next.js via OpenNext) with Supabase Postgres/Auth/Storage.
See [architecture/SYSTEM_OVERVIEW.md](architecture/SYSTEM_OVERVIEW.md).
