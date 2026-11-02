# Paradise Business — overview

**Status: Planned (post-MVP).** No code. Module placeholder: `src/modules/business`.

Operational tools for a contractor's own business:

- **Customers / CRM** — clients, contacts, job history, notes.
- **Estimating** — line-item estimates, templates by trade, convert to job.
- **Scheduling** — crew and equipment calendar, linked to Exchange requests.
- **Operations** — job status, documents, photos.

## Architecture notes

- Every record is organization-scoped with RLS, same pattern as the MVP tables.
- Customer data is private to the organization; never visible across organizations.
- Likely integrations (accounting, e-signature) must offer HTTP APIs usable from Workers.
