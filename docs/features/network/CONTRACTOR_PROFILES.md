# Contractor profiles

**Status: Implemented and tested locally (Milestone 2), not yet deployed.** Editor at `/profile`, public page at
`/c/<organization-slug>`. Town is chosen from `LANCASTER_TOWNS`; service radius 10/25/50 miles creates the
organization's "Primary service area". Publishing requires a main trade, headline and town.

## What a profile is

The public face of an **organization** (not a person). One per organization.

| Field | Notes |
| --- | --- |
| Name, slug | From `organizations` |
| Headline (≤160), bio (≤4000) | |
| Trades | `contractor_profile_trades`, one may be primary; max 10 |
| Years in business | 0–150 |
| Licence number, insured flag | Self-reported for MVP; verification later |
| Map point | Approximate location ([GEOSPATIAL](../../architecture/GEOSPATIAL.md)) |
| Service areas | Radius or polygon |
| Visibility | `draft` (members only) or `published` (public) |

## Rules

- Owners and admins edit; any member can view drafts.
- Public pages show only `published` profiles of non-archived organizations.
- Planned URL: `/c/<organization-slug>`.

## Open questions

- Pennsylvania HIC registration number as a distinct, verifiable field?
- Logo / photo uploads (Supabase Storage bucket and size limits).
