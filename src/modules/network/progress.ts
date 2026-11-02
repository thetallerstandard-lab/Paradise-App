/**
 * Onboarding and profile-completeness rules, kept pure so pages, actions and
 * tests agree on them.
 */

export type ProfileSnapshot = {
  baseTown: string | null;
  primaryTradeId: string | null;
  isPublished: boolean;
  headline: string | null;
  bio: string | null;
  yearsInBusiness: number | null;
  licenseNumber: string | null;
  isInsured: boolean;
};

export const ONBOARDING_STEPS = [
  { key: "business", label: "Your business", path: "/onboarding/business" },
  { key: "trade", label: "Your trade", path: "/onboarding/trade" },
  { key: "publish", label: "Go live", path: "/onboarding/publish" },
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number]["key"];

/** The first unfinished step, or "done" once the profile is published. */
export function nextOnboardingStep(hasBusiness: boolean, profile: ProfileSnapshot | null): OnboardingStepKey | "done" {
  if (!hasBusiness || !profile?.baseTown) return "business";
  if (!profile.primaryTradeId) return "trade";
  if (!profile.isPublished) return "publish";
  return "done";
}

export function stepIndex(step: OnboardingStepKey): number {
  return ONBOARDING_STEPS.findIndex((s) => s.key === step);
}

/** Optional details that make a profile more trustworthy, in the order we suggest them. */
const STRENGTH_ITEMS = [
  { key: "headline", label: "Add a one-line headline", done: (p: ProfileSnapshot) => Boolean(p.headline) },
  { key: "yearsInBusiness", label: "Say how long you've been in business", done: (p: ProfileSnapshot) => p.yearsInBusiness != null },
  { key: "isInsured", label: "Confirm you carry insurance", done: (p: ProfileSnapshot) => p.isInsured },
  { key: "licenseNumber", label: "Add your PA HIC or licence number", done: (p: ProfileSnapshot) => Boolean(p.licenseNumber) },
  { key: "bio", label: "Write a few lines about your business", done: (p: ProfileSnapshot) => Boolean(p.bio) },
] as const;

/**
 * Completeness as a percentage. The three onboarding essentials (town, trade,
 * published) count for half; the optional trust details share the other half.
 */
export function profileStrength(profile: ProfileSnapshot) {
  const essentials = [Boolean(profile.baseTown), Boolean(profile.primaryTradeId), profile.isPublished];
  const essentialScore = essentials.filter(Boolean).length / essentials.length;
  const missing = STRENGTH_ITEMS.filter((item) => !item.done(profile)).map(({ key, label }) => ({ key, label }));
  const optionalScore = (STRENGTH_ITEMS.length - missing.length) / STRENGTH_ITEMS.length;
  return { percent: Math.round((essentialScore * 0.5 + optionalScore * 0.5) * 100), missing };
}
