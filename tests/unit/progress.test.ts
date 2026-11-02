import { describe, expect, it } from "vitest";

import { nextOnboardingStep, profileStrength, type ProfileSnapshot } from "@/modules/network";
import { slugCandidates } from "@/modules/organizations";

const empty: ProfileSnapshot = {
  baseTown: null,
  primaryTradeId: null,
  isPublished: false,
  headline: null,
  bio: null,
  yearsInBusiness: null,
  licenseNumber: null,
  isInsured: false,
};

describe("nextOnboardingStep", () => {
  it("walks business → trade → publish → done", () => {
    expect(nextOnboardingStep(false, null)).toBe("business");
    expect(nextOnboardingStep(true, empty)).toBe("business");
    expect(nextOnboardingStep(true, { ...empty, baseTown: "Lititz" })).toBe("trade");
    expect(nextOnboardingStep(true, { ...empty, baseTown: "Lititz", primaryTradeId: "t" })).toBe("publish");
    expect(nextOnboardingStep(true, { ...empty, baseTown: "Lititz", primaryTradeId: "t", isPublished: true })).toBe("done");
  });
});

describe("profileStrength", () => {
  it("is 0% for an empty profile and lists every optional detail", () => {
    const s = profileStrength(empty);
    expect(s.percent).toBe(0);
    expect(s.missing.map((m) => m.key)).toEqual(["headline", "yearsInBusiness", "isInsured", "licenseNumber", "bio"]);
  });

  it("gives half credit for finishing onboarding and 100% when everything is filled", () => {
    const live = { ...empty, baseTown: "Lititz", primaryTradeId: "t", isPublished: true };
    expect(profileStrength(live).percent).toBe(50);
    const full = { ...live, headline: "h", bio: "b", yearsInBusiness: 0, licenseNumber: "PA1", isInsured: true };
    expect(profileStrength(full)).toEqual({ percent: 100, missing: [] });
  });

  it("counts zero years in business as answered", () => {
    expect(profileStrength({ ...empty, yearsInBusiness: 0 }).missing.map((m) => m.key)).not.toContain("yearsInBusiness");
  });
});

describe("slugCandidates", () => {
  it("tries the name, then name + town, then numbered versions", () => {
    expect(slugCandidates("Miller & Sons Roofing", "Lititz")).toEqual([
      "miller-sons-roofing",
      "miller-sons-roofing-lititz",
      "miller-sons-roofing-2",
      "miller-sons-roofing-3",
      "miller-sons-roofing-4",
      "miller-sons-roofing-5",
    ]);
  });

  it("falls back to a generic slug for names with no letters or digits", () => {
    expect(slugCandidates("!!!")[0]).toBe("business");
  });
});
