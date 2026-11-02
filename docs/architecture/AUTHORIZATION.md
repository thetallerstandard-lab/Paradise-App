# Authorization

**Status:** RLS policies **Implemented as SQL, not applied or tested**.

## Model

Organization-first. Users act **on behalf of an organization**. Roles per membership:

| Role | Can |
| --- | --- |
| `owner` | Everything an admin can; future: billing, deleting the organization |
| `admin` | Edit organization and contractor profile, manage members and service areas, accept/decline offers |
| `member` | Read the organization's data, create requests and offers for it |

Only `active` memberships count.

## Enforcement layers

1. **Server code** (modules / server actions) checks the user, their membership and role before acting,
   and returns friendly errors.
2. **Postgres RLS** using `is_org_member(org_id)` and `has_org_role(org_id, roles)` decides which rows a user can
   read or write. This holds even if server code has a bug or the browser calls Supabase directly.
3. **Triggers** enforce state transitions RLS cannot express (`enforce_exchange_offer_rules`).

The admin client bypasses layers 2–3; every use must do layer 1 explicitly.

## Policy summary

| Table | Read | Write |
| --- | --- | --- |
| `profiles` | Signed-in users | Own row |
| `organizations` | Anyone (non-archived); members always | Create as self; owners/admins update |
| `organization_memberships` | Own rows + same-org members | Owners/admins |
| `trade_categories` | Anyone (active) | Secret key only |
| `contractor_profiles`, `contractor_profile_trades`, `service_areas` | Anyone if published; members always | Owners/admins |
| `resource_requests` | Signed-in users see `open`; members see all of theirs | Members create; creator or owners/admins update |
| `exchange_offers` | Members of the offering or requesting org | Offering members create; updates checked by trigger |

## Must verify when the migration is first applied

- Organization insert with `.select()` returns the new row (owner membership is created by an `AFTER INSERT` trigger).
- `enforce_membership_rules` blocks changing your own role and reserves granting/revoking `owner` for owners.
  Confirm it, and that the creator's first owner membership still succeeds.
- An organization can currently lose its last owner if an owner removes themselves; add a guard before invites ship.
- Write pgTAP or integration tests for each policy before Milestone 3 ships.

Related: [SECURITY.md](SECURITY.md), [DATABASE_DESIGN.md](DATABASE_DESIGN.md).
