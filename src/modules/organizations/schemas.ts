import { z } from "zod";

// Must match the CHECK constraint on organizations.slug.
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Turns a business name into a URL slug, e.g. "Miller & Sons Roofing" -> "miller-sons-roofing". */
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

export const organizationSlugSchema = z.string().min(2).max(64).regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens");

export const createOrganizationInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: organizationSlugSchema,
  phone: z.string().trim().max(32).optional(),
  website: z.url().optional(),
});

export const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

export type CreateOrganizationInput = z.infer<typeof createOrganizationInputSchema>;
