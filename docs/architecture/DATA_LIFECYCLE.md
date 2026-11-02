# Data lifecycle

**Status:** design only. Deletion and export flows are **Planned**.

| Data | Created | Changed | Ended |
| --- | --- | --- | --- |
| Auth user + `profiles` | Sign-up (trigger creates profile) | User edits profile | Account deletion removes `auth.users`; `profiles` cascades |
| Organization | Onboarding | Owners/admins | **Archived** via `archived_at` (soft). Hard delete only by support, after requests/offers are resolved |
| Membership | Org creation (owner) or invite | Role changes by owners/admins | `status = 'removed'` keeps history |
| Contractor profile | Onboarding (`draft`) | Owners/admins; `published` to appear publicly | Cascades with organization |
| Resource request | `draft` → `open` | Creator / admins | `fulfilled`, `cancelled`, or `expired` (expiry job planned) |
| Exchange offer | `pending` | Offering org edits while pending | `accepted`, `declined`, `withdrawn` — final |
| Uploads (Supabase Storage) | Planned | | Removed with owning record (job planned) |

## Notes

- `profiles` referenced by `organizations.created_by`, `resource_requests.created_by` and
  `exchange_offers.created_by` use `ON DELETE RESTRICT`. Account deletion must first transfer or
  anonymize those references. Design the deletion flow before launch.
- Accepted offers will become the basis for future ledger entries; once the ledger exists, offers that
  produced ledger entries must never be deleted.
- Backups: Supabase managed backups (check plan tier). Point-in-time recovery is a paid add-on — decide before launch.
