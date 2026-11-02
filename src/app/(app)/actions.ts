"use server";

import { redirect } from "next/navigation";

import { fieldErrorsFrom, textField, type FormState } from "@/lib/forms";
import { getCurrentUser } from "@/modules/identity/server";
import { contractorProfileFormSchema, findTown } from "@/modules/network";
import { saveContractorProfile } from "@/modules/network/server";
import { createOrganizationInputSchema } from "@/modules/organizations";
import { createOrganization, getActiveOrganization } from "@/modules/organizations/server";

export async function createOrganizationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/onboarding");

  const parsed = createOrganizationInputSchema.safeParse({
    name: textField(formData, "name"),
    slug: textField(formData, "slug"),
    phone: textField(formData, "phone"),
    website: textField(formData, "website"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const result = await createOrganization(user.id, parsed.data);
  if (!result.ok) {
    return result.reason === "slug_taken" ? { fieldErrors: { slug: [result.message] } } : { error: result.message };
  }
  redirect("/profile?welcome=1");
}

export async function saveProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/profile");

  const organization = await getActiveOrganization(user.id);
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
  if (parsed.data.publish && (!parsed.data.headline || !parsed.data.baseTown)) {
    return {
      error: "Add a headline and your town before publishing.",
      fieldErrors: {
        headline: parsed.data.headline ? undefined : ["Add a short headline to publish"],
        baseTown: parsed.data.baseTown ? undefined : ["Choose your town to publish"],
      },
    };
  }

  const result = await saveContractorProfile(organization.id, parsed.data);
  if (!result.ok) return { error: result.message };
  redirect(`/profile?saved=${parsed.data.publish ? "published" : "draft"}`);
}
