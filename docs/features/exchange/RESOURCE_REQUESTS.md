# Resource requests

**Status: Planned.** Table `resource_requests` and `resourceRequestInputSchema` implemented, unverified.

## Kinds

| Kind | Example |
| --- | --- |
| `equipment_rental` | "Need a 12k lb mini excavator Tue–Thu near Ephrata" |
| `labor` | "Two framers for one day" |
| `materials` | "Leftover architectural shingles, Weathered Wood" |
| `subcontracting` | "Licensed electrician for a basement finish" |

## Fields

Title (4–140), description (≤4000), optional trade, optional location, optional
date range (`needed_until ≥ needed_from`), optional `budget_points` (≥0).

## Lifecycle

`draft` → `open` → `fulfilled` | `cancelled` | `expired`.

- Only `open` requests are visible to other organizations, and only to signed-in users.
- Only `open` requests accept offers (trigger-enforced).
- Accepting an offer should move the request to `fulfilled` — to be done in one Postgres function in Milestone 3.
- Automatic expiry after `needed_until` is planned (scheduled job; Cloudflare Cron Trigger or `pg_cron`, decide in M3).

Related: [OFFERS.md](OFFERS.md).
