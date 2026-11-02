# Database design

**Status: Implemented as SQL, not applied.** Source:
`supabase/migrations/20261102000000_initial_schema.sql`. It has never been run
against Postgres, so syntax and policy behaviour are unverified.

## Conventions

- UUID primary keys (`gen_random_uuid()`), except `profiles.id` which equals `auth.users.id`.
- `created_at` / `updated_at` (`timestamptz`), maintained by the `set_updated_at` trigger.
- Enums for closed sets of states. Text length limits enforced by `CHECK`.
- PostGIS `geography(..., 4326)` for locations, with GiST indexes.
- RLS enabled on every table. Functions are `SECURITY DEFINER` only when needed and always `set search_path = ''`.
- Migrations are append-only; never edit one after it is applied.

## Entities

```
auth.users 1─1 profiles 1─* organization_memberships *─1 organizations
organizations 1─0..1 contractor_profiles *─* trade_categories (contractor_profile_trades)
organizations 1─* service_areas
organizations 1─* resource_requests 1─* exchange_offers *─1 organizations (offering)
```

| Table | Purpose | Key columns |
| --- | --- | --- |
| `profiles` | One row per auth user, created by trigger `on_auth_user_created` | `display_name`, `avatar_url`, `phone` |
| `organizations` | Contractor business | `name`, unique `slug`, `created_by`, `archived_at` |
| `organization_memberships` | User ↔ organization with role | `role` (owner/admin/member), `status`, unique (org, user) |
| `trade_categories` | Reference list of trades, optional parent | unique `slug`, `is_active` |
| `contractor_profiles` | Public business profile, one per organization | `visibility` (draft/published), `map_point`, `is_insured` |
| `contractor_profile_trades` | Trades a profile offers | `is_primary` |
| `service_areas` | Where an org works: radius **or** polygon | `center` + `radius_meters`, or `boundary` |
| `resource_requests` | Exchange post | `kind`, `status`, `location`, `budget_points` |
| `exchange_offers` | Offer on a request | `points_amount > 0`, `status`, `responded_at` |

## Integrity rules in the database

- Creating an organization makes its creator an `owner` (`on_organization_created`).
- `enforce_membership_rules`: no one changes their own role; only owners grant, change or revoke `owner`.
- At most one `pending` offer per organization per request; at most one `accepted` offer per request (partial unique indexes).
- `enforce_exchange_offer_rules` trigger: no offers on your own request; offers only on `open` requests;
  only the offering org may edit or withdraw; only requesting-org owners/admins may accept or decline;
  non-pending offers are final.
- Service area must be exactly one shape (`service_areas_shape_check`).

## Deliberately absent

- **No Paradise Points balances or ledger.** `budget_points` and `points_amount` are numbers on a
  request/offer only. See [../features/exchange/TRANSACTION_LEDGER.md](../features/exchange/TRANSACTION_LEDGER.md).
- No exact street addresses for contractors ([GEOSPATIAL.md](GEOSPATIAL.md)).
- No CRM, billing or media tables.

## Applying

Once a Supabase project exists: `npx supabase link --project-ref <ref>` then
`npx supabase db push`, then regenerate `src/types/database.ts`
([../development/SETUP.md](../development/SETUP.md)). Policies: [AUTHORIZATION.md](AUTHORIZATION.md).
