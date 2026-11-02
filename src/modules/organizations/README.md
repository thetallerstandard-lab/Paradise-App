# organizations

Contractor businesses and who belongs to them. Every business record in Paradise
(profiles, requests, offers, and later CRM data) is owned by an organization,
not by an individual user.

- Tables: `organizations`, `organization_memberships` (roles: owner, admin, member).
- Database helpers: `private.is_org_member(org_id)`, `private.has_org_role(org_id, roles)` used by RLS.
- Implemented: input validation schemas, slug helper (`schemas.ts`).
- Planned (Milestone 2): create-organization flow, active-organization selection, invites.

Docs: [AUTHORIZATION.md](../../../docs/architecture/AUTHORIZATION.md)
