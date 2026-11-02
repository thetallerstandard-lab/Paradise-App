import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { CreateOrganizationInput } from "@/modules/organizations/schemas";

export type MyOrganization = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member";
};

/** Active organizations the current user belongs to, oldest membership first. */
export const getMyOrganizations = cache(async (userId: string): Promise<MyOrganization[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("role, created_at, organizations!inner(id, name, slug, archived_at)")
    .eq("user_id", userId)
    .eq("status", "active")
    .is("organizations.archived_at", null)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load organizations: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.organizations.id,
    name: row.organizations.name,
    slug: row.organizations.slug,
    role: row.role,
  }));
});

/**
 * The organization the user is acting for. MVP rule: their first active
 * membership. A switcher (stored choice) comes with multi-organization support.
 */
export async function getActiveOrganization(userId: string): Promise<MyOrganization | null> {
  const organizations = await getMyOrganizations(userId);
  return organizations[0] ?? null;
}

export type CreateOrganizationResult =
  | { ok: true; organization: { id: string; slug: string } }
  | { ok: false; reason: "slug_taken" | "error"; message: string };

/** Creates an organization; the database makes the creator its owner. */
export async function createOrganization(
  userId: string,
  input: CreateOrganizationInput,
): Promise<CreateOrganizationResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name: input.name,
      slug: input.slug,
      phone: input.phone ?? null,
      website: input.website ?? null,
      created_by: userId,
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, reason: "slug_taken", message: "That web address is already taken. Try another." };
    }
    return { ok: false, reason: "error", message: "We couldn't create your business. Please try again." };
  }
  return { ok: true, organization: data };
}
