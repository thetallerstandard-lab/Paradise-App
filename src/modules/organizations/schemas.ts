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

export const organizationSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Use at least 2 characters")
  .max(64, "Use at most 64 characters")
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens");

/** Optional website: accepts "example.com" and adds https://. */
const websiteSchema = z
  .string()
  .trim()
  .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
  .pipe(z.url("Enter a valid website address"));

export const createOrganizationInputSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name").max(120),
  slug: organizationSlugSchema,
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[0-9+().\-\s]*$/, "Use digits and + ( ) - . only")
    .optional(),
  website: websiteSchema.optional(),
});

export const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

export type CreateOrganizationInput = z.infer<typeof createOrganizationInputSchema>;
