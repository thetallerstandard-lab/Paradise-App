import { redirect } from "next/navigation";

import { ONBOARDING_STEPS, stepIndex } from "@/modules/network";

import { loadOnboarding } from "./state";

/** Sends people to the first unfinished onboarding step. */
export default async function OnboardingIndex() {
  const { next } = await loadOnboarding("/onboarding");
  if (next === "done") redirect("/dashboard");
  redirect(ONBOARDING_STEPS[stepIndex(next)]!.path);
}
