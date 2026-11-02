import { describe, expect, it } from "vitest";

import { SLUG_PATTERN, createOrganizationInputSchema, slugify } from "@/modules/organizations";

describe("slugify", () => {
  it.each([
    ["Miller & Sons Roofing", "miller-sons-roofing"],
    ["  Stoltzfus Excavating, LLC ", "stoltzfus-excavating-llc"],
    ["Café Renovations", "cafe-renovations"],
  ])("%s -> %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
    expect(SLUG_PATTERN.test(slugify(input))).toBe(true);
  });

  it("never exceeds 64 characters or ends with a hyphen", () => {
    const slug = slugify(`${"a".repeat(63)} b`);
    expect(slug.length).toBeLessThanOrEqual(64);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("createOrganizationInputSchema", () => {
  it("rejects slugs the database would reject", () => {
    const result = createOrganizationInputSchema.safeParse({ name: "Acme", slug: "Acme--Co" });
    expect(result.success).toBe(false);
  });
});
