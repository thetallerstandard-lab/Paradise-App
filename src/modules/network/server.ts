import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { ContractorProfileForm } from "@/modules/network/schemas";
import { findTown, metersToMiles, milesToMeters } from "@/modules/network/towns";

export const listTradeCategories = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trade_categories")
    .select("id, slug, name")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(`Could not load trades: ${error.message}`);
  return data;
});

/** The organization's own profile for editing (members can read drafts). */
export async function getProfileForEditing(organizationId: string) {
  const supabase = await createClient();
  const [{ data: profile, error }, { data: area }] = await Promise.all([
    supabase
      .from("contractor_profiles")
      .select(
        "id, headline, bio, years_in_business, license_number, is_insured, base_town, visibility, contractor_profile_trades(trade_category_id, is_primary)",
      )
      .eq("organization_id", organizationId)
      .maybeSingle(),
    supabase
      .from("service_areas")
      .select("radius_meters")
      .eq("organization_id", organizationId)
      .eq("name", "Primary service area")
      .maybeSingle(),
  ]);
  if (error) throw new Error(`Could not load profile: ${error.message}`);
  if (!profile) return null;

  const trades = profile.contractor_profile_trades;
  return {
    ...profile,
    primaryTradeId: trades.find((t) => t.is_primary)?.trade_category_id ?? null,
    tradeIds: trades.filter((t) => !t.is_primary).map((t) => t.trade_category_id),
    serviceRadiusMeters: area?.radius_meters ?? null,
  };
}

export type SaveProfileResult = { ok: true } | { ok: false; message: string };

/** Everything save_contractor_profile writes. Main trade may be unset mid-onboarding. */
export type ProfileValues = Omit<ContractorProfileForm, "primaryTradeId"> & { primaryTradeId?: string };

type EditableProfile = NonNullable<Awaited<ReturnType<typeof getProfileForEditing>>>;

function toProfileValues(profile: EditableProfile | null): ProfileValues {
  return {
    headline: profile?.headline ?? undefined,
    bio: profile?.bio ?? undefined,
    yearsInBusiness: profile?.years_in_business ?? undefined,
    licenseNumber: profile?.license_number ?? undefined,
    isInsured: profile?.is_insured ?? false,
    baseTown: profile?.base_town ?? undefined,
    serviceRadiusMiles: profile?.serviceRadiusMeters ? metersToMiles(profile.serviceRadiusMeters) : 25,
    primaryTradeId: profile?.primaryTradeId ?? undefined,
    tradeIds: profile?.tradeIds ?? [],
    publish: profile?.visibility === "published",
  };
}

/**
 * Changes only the given fields. The RPC overwrites every column, so this
 * reads the current profile first and merges.
 */
export async function updateContractorProfile(
  organizationId: string,
  patch: Partial<ProfileValues>,
): Promise<SaveProfileResult> {
  const current = toProfileValues(await getProfileForEditing(organizationId));
  return saveContractorProfile(organizationId, { ...current, ...patch });
}

/** Saves profile, trades and primary service area atomically (RLS-checked RPC). */
export async function saveContractorProfile(
  organizationId: string,
  form: ProfileValues,
): Promise<SaveProfileResult> {
  const town = findTown(form.baseTown);
  const supabase = await createClient();
  const { error } = await supabase.rpc("save_contractor_profile", {
    p_organization_id: organizationId,
    p_headline: form.headline,
    p_bio: form.bio,
    p_years_in_business: form.yearsInBusiness,
    p_license_number: form.licenseNumber,
    p_is_insured: form.isInsured,
    p_base_town: town?.name,
    p_lng: town?.lng,
    p_lat: town?.lat,
    p_service_radius_meters:
      town && form.serviceRadiusMiles !== undefined ? milesToMeters(form.serviceRadiusMiles) : undefined,
    p_primary_trade_id: form.primaryTradeId,
    p_trade_ids: form.tradeIds,
    p_publish: form.publish,
  });
  if (error) return { ok: false, message: "We couldn't save your profile. Please try again." };
  return { ok: true };
}

/** Public profile by organization slug. RLS returns drafts only to members. */
export async function getPublicProfile(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select(
      `id, name, slug, phone, website,
       contractor_profiles(headline, bio, years_in_business, license_number, is_insured, base_town, visibility,
         contractor_profile_trades(is_primary, trade_categories(name, slug))),
       service_areas(name, radius_meters)`,
    )
    .eq("slug", slug)
    .is("archived_at", null)
    .maybeSingle();
  if (error) throw new Error(`Could not load profile: ${error.message}`);
  if (!data || !data.contractor_profiles) return null;

  const profile = data.contractor_profiles;
  const trades = [...profile.contractor_profile_trades]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .map((t) => ({ ...t.trade_categories, isPrimary: t.is_primary }));
  const area = data.service_areas.find((a) => a.name === "Primary service area");

  return {
    name: data.name,
    slug: data.slug,
    phone: data.phone,
    website: data.website,
    headline: profile.headline,
    bio: profile.bio,
    yearsInBusiness: profile.years_in_business,
    licenseNumber: profile.license_number,
    isInsured: profile.is_insured,
    baseTown: profile.base_town,
    isPublished: profile.visibility === "published",
    trades,
    serviceRadiusMeters: area?.radius_meters ?? null,
  };
}
