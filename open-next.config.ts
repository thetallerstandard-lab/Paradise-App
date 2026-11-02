import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental (ISR) cache is configured yet: Paradise pages are dynamic and
// per-user. If we adopt ISR later, add an R2 incremental cache here and an R2
// bucket binding in wrangler.jsonc. See docs/architecture/CLOUDFLARE_ARCHITECTURE.md.
export default defineCloudflareConfig({});
