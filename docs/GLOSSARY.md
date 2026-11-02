# Glossary

| Term | Meaning |
| --- | --- |
| **Contractor** | An independent tradesperson or small trade business using Paradise. |
| **Organization** | The business entity in Paradise. Owns profiles, requests, offers. A user can belong to several. Table `organizations`. |
| **Membership** | A user's link to an organization with a role: `owner`, `admin`, `member`. Table `organization_memberships`. |
| **Profile (user)** | Per-person record tied to a Supabase Auth user. Table `profiles`. |
| **Contractor profile** | An organization's public business profile shown in the directory and on the map. Table `contractor_profiles`. |
| **Trade category** | A trade such as Electrical or Roofing. Table `trade_categories`. |
| **Service area** | Where an organization works: a radius around a point or a polygon. Table `service_areas`. |
| **Map point** | The deliberately approximate location shown on the public map. Never a home address. |
| **Resource request** | An Exchange post asking for equipment, labor, materials, or a subcontractor. Table `resource_requests`. |
| **Exchange offer** | One organization's response to a request, with a proposed point amount. Table `exchange_offers`. |
| **Paradise Points** | Paradise's internal unit of value. In the MVP, points only denominate offers; nothing is transferred. |
| **Ledger** | Future append-only, double-entry record of point transfers. Not built. |
| **Launch market** | Lancaster County, Pennsylvania. |
| **RLS** | Postgres Row Level Security — the database enforces who can read and write each row. |
| **OpenNext** | Adapter that builds a Next.js app into a Cloudflare Worker (`@opennextjs/cloudflare`). |
| **Worker** | A Cloudflare Workers deployment; Paradise runs as one Worker named `paradise`. |
| **Maestro** | Separate nonprofit partner for apprenticeships and workforce development. |
| **ADR** | Architecture Decision Record, in `docs/decisions/`. |
