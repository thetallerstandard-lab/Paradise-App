import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { slugCandidates, type CreateOrganizationInput } from "@/modules/organizations/schemas";

export type MyOrganization = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member";
};

/**
 * Active organizations the current user belongs to, oldest membership first.
 * Uncached: server actions that create or change organizations must use this,
 * because a server action's redirect renders the next page in the same
 * request, where the cached version would still return the old answer.
 */
export async function fetchMyOrganizations(userId: string): Promise<MyOrganization[]> {
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
}

/** Cached per request, for pages and layouts. */
export const getMyOrganizations = cache(fetchMyOrganizations);

/**
 * The organization the user is acting for. MVP rule: their first active
 * membership. A switcher (stored choice) comes with multi-organization support.
 * Pass `{ fresh: true }` from server actions (see fetchMyOrganizations).
 */
export async function getActiveOrganization(
  userId: string,
  options: { fresh?: boolean } = {},
): Promise<MyOrganization | null> {
  const organizations = options.fresh ? await fetchMyOrganizations(userId) : await getMyOrganizations(userId);
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

/**
 * Creates the business with an automatically chosen web address, trying the
 * next candidate whenever one is taken. Users never see a "slug" field.
 */
export async function createOrganizationWithAutoSlug(
  userId: string,
  input: { name: string; phone?: string; town?: string },
): Promise<CreateOrganizationResult> {
  for (const slug of slugCandidates(input.name, input.town)) {
    const result = await createOrganization(userId, { name: input.name, slug, phone: input.phone });
    if (result.ok || result.reason !== "slug_taken") return result;
  }
  return { ok: false, reason: "error", message: "We couldn't create your business. Please try again." };
}

/** Updates the business name and phone (owners and admins; enforced by RLS). */
export async function updateOrganizationBasics(
  organizationId: string,
  input: { name: string; phone?: string },
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update({ name: input.name, phone: input.phone ?? null })
    .eq("id", organizationId);
  return { ok: !error };
}

/** Name, slug and phone for the active business. */
export async function getOrganizationDetails(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, name, slug, phone")
    .eq("id", organizationId)
    .maybeSingle();
  return data;
}
