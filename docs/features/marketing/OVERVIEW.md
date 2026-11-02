# Paradise Media — overview

**Status: Planned (post-MVP).** No code. Module placeholder: `src/modules/marketing`.

- **Project portfolios** — before/after photos and write-ups on contractor profiles.
- **Contractor promotion** — featured placement, local campaigns.
- **Media** — Paradise-produced content showcasing local trades.

## Architecture notes

- Images start in Supabase Storage; move to Cloudflare R2 + Images if egress or transformation costs justify it (ADR required).
- Public portfolio pages are good candidates for ISR caching (would need the R2 incremental cache — see
  [CLOUDFLARE_ARCHITECTURE](../../architecture/CLOUDFLARE_ARCHITECTURE.md)).
