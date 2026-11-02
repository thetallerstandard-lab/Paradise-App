"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { fieldErrorsFrom, textField, type FormState } from "@/lib/forms";
import { getCurrentUser } from "@/modules/identity/server";
import { contractorProfileFormSchema, findTown, SERVICE_RADIUS_MILES } from "@/modules/network";
import { saveContractorProfile, updateContractorProfile } from "@/modules/network/server";
import {
  createOrganizationWithAutoSlug,
  getActiveOrganization,
  updateOrganizationBasics,
} from "@/modules/organizations/server";

async function requireEditor(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
  // Uncached: the redirect at the end of an action renders the next page in
  // this same request, and must see the business this action just created.
  const organization = await getActiveOrganization(user.id, { fresh: true });
  return { user, organization };
}

const phoneSchema = z
  .string()
  .trim()
  .max(32)
  .regex(/^[0-9+().\-\s]*$/, "Use digits and + ( ) - . only")
  .optional();

const businessStepSchema = z.object({
  name: z.string({ error: "Enter your business name" }).trim().min(2, "Enter your business name").max(120),
  phone: phoneSchema,
  baseTown: z
    .string({ error: "Choose your town" })
    .refine((v) => Boolean(findTown(v)), "Choose your town from the list"),
});

/** Onboarding step 1: create (or update) the business and set its town. */
export async function onboardingBusinessAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user, organization } = await requireEditor("/onboarding/business");
  const parsed = businessStepSchema.safeParse({
    name: textField(formData, "name"),
    phone: textField(formData, "phone"),
    baseTown: textField(formData, "baseTown"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  const { name, phone, baseTown } = parsed.data;

  let organizationId = organization?.id;
  if (organizationId) {
    if (organization?.role === "member") return { error: "Only the business owner can change these details." };
    const updated = await updateOrganizationBasics(organizationId, { name, phone });
    if (!updated.ok) return { error: "We couldn't save your business. Please try again." };
  } else {
    const created = await createOrganizationWithAutoSlug(user.id, { name, phone, town: baseTown });
    if (!created.ok) return { error: created.message };
    organizationId = created.organization.id;
  }

  const saved = await updateContractorProfile(organizationId, { baseTown });
  if (!saved.ok) return { error: saved.message };
  return { redirectTo: "/onboarding/trade" };
}

const tradeStepSchema = z.object({
  primaryTradeId: z.uuid("Choose your main trade"),
  tradeIds: z.array(z.uuid()).max(10, "Choose at most 10 trades"),
  serviceRadiusMiles: z.coerce
    .number()
    .refine((v) => (SERVICE_RADIUS_MILES as readonly number[]).includes(v), "Choose how far you travel"),
});

/** Onboarding step 2: main trade, other trades, travel radius. */
export async function onboardingTradeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { organization } = await requireEditor("/onboarding/trade");
  if (!organization) redirect("/onboarding/business");
  if (organization.role === "member") redirect("/dashboard");

  const parsed = tradeStepSchema.safeParse({
    primaryTradeId: textField(formData, "primaryTradeId") ?? "",
    tradeIds: formData.getAll("tradeIds").filter((v): v is string => typeof v === "string"),
    serviceRadiusMiles: textField(formData, "serviceRadiusMiles") ?? "",
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const saved = await updateContractorProfile(organization.id, {
    primaryTradeId: parsed.data.primaryTradeId,
    tradeIds: parsed.data.tradeIds.filter((id) => id !== parsed.data.primaryTradeId),
    serviceRadiusMiles: parsed.data.serviceRadiusMiles,
  });
  if (!saved.ok) return { error: saved.message };
  return { redirectTo: "/onboarding/publish" };
}

/** Onboarding step 3: go live now, or finish later. */
export async function onboardingPublishAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { organization } = await requireEditor("/onboarding/publish");
  if (!organization) redirect("/onboarding/business");
  if (organization.role === "member") redirect("/dashboard");

  const publish = formData.get("intent") === "publish";
  const saved = await updateContractorProfile(organization.id, { publish });
  if (!saved.ok) return { error: saved.message };
  return { redirectTo: publish ? "/dashboard?welcome=live" : "/dashboard?welcome=later" };
}

/** Full editor on "My business". */
export async function saveProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { organization } = await requireEditor("/profile");
  if (!organization) redirect("/onboarding");
  if (organization.role === "member") {
    return { error: "Only owners and admins can edit the business profile." };
  }

  const parsed = contractorProfileFormSchema.safeParse({
    headline: textField(formData, "headline"),
    bio: textField(formData, "bio"),
    yearsInBusiness: textField(formData, "yearsInBusiness"),
    licenseNumber: textField(formData, "licenseNumber"),
    isInsured: formData.get("isInsured") === "on",
    baseTown: textField(formData, "baseTown"),
    serviceRadiusMiles: textField(formData, "serviceRadiusMiles") ?? "",
    primaryTradeId: textField(formData, "primaryTradeId") ?? "",
    tradeIds: formData.getAll("tradeIds").filter((v): v is string => typeof v === "string"),
    publish: formData.get("intent") === "publish",
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  if (parsed.data.baseTown && !findTown(parsed.data.baseTown)) {
    return { fieldErrors: { baseTown: ["Choose a town from the list"] } };
  }
  if (parsed.data.publish && !parsed.data.baseTown) {
    return { error: "Choose your town before going live.", fieldErrors: { baseTown: ["Choose your town to go live"] } };
  }

  const result = await saveContractorProfile(organization.id, parsed.data);
  if (!result.ok) return { error: result.message };
  return { redirectTo: `/profile?saved=${parsed.data.publish ? "published" : "draft"}` };
}
