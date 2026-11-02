import "server-only";

import { redirect } from "next/navigation";

import { requireUser } from "@/modules/identity/server";
import { nextOnboardingStep, ONBOARDING_STEPS, stepIndex, type OnboardingStepKey, type ProfileSnapshot } from "@/modules/network";
import { getProfileForEditing } from "@/modules/network/server";
import { getActiveOrganization, getOrganizationDetails } from "@/modules/organizations/server";

export async function loadOnboarding(returnTo: string) {
  const user = await requireUser(returnTo);
  const organization = await getActiveOrganization(user.id);
  const [details, profile] = organization
    ? await Promise.all([getOrganizationDetails(organization.id), getProfileForEditing(organization.id)])
    : [null, null];

  const snapshot: ProfileSnapshot | null = profile
    ? {
        baseTown: profile.base_town,
        primaryTradeId: profile.primaryTradeId,
        isPublished: profile.visibility === "published",
        headline: profile.headline,
        bio: profile.bio,
        yearsInBusiness: profile.years_in_business,
        licenseNumber: profile.license_number,
        isInsured: profile.is_insured,
      }
    : null;

  return { user, organization, details, profile, snapshot, next: nextOnboardingStep(Boolean(organization), snapshot) };
}

/**
 * Keeps people on the right step: no jumping ahead past unfinished steps, and
 * members (not owners/admins) never edit the business.
 */
export async function guardStep(step: OnboardingStepKey) {
  const state = await loadOnboarding(ONBOARDING_STEPS[stepIndex(step)]!.path);
  if (state.organization?.role === "member") redirect("/dashboard");
  if (state.next !== "done" && stepIndex(state.next) < stepIndex(step)) {
    redirect(ONBOARDING_STEPS[stepIndex(state.next)]!.path);
  }
  return state;
}
