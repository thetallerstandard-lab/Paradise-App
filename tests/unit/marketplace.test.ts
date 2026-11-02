import { describe, expect, it } from "vitest";

import { canTransitionOffer, exchangeOfferInputSchema, resourceRequestInputSchema } from "@/modules/marketplace";
import { LANCASTER_COUNTY_CENTER, isInLaunchMarket } from "@/modules/network";

describe("exchangeOfferInputSchema", () => {
  const requestId = "6f1c2c1e-4b8a-4d3e-9a51-2a7f0c9b8d10";

  it("accepts a positive whole number of points", () => {
    expect(exchangeOfferInputSchema.safeParse({ requestId, pointsAmount: 250 }).success).toBe(true);
  });

  it.each([0, -5, 12.5])("rejects %s points", (pointsAmount) => {
    expect(exchangeOfferInputSchema.safeParse({ requestId, pointsAmount }).success).toBe(false);
  });
});

describe("resourceRequestInputSchema", () => {
  it("rejects an end date before the start date", () => {
    const result = resourceRequestInputSchema.safeParse({
      kind: "equipment_rental",
      title: "Need a mini excavator",
      neededFrom: "2026-11-10",
      neededUntil: "2026-11-09",
    });
    expect(result.success).toBe(false);
  });
});

describe("canTransitionOffer (mirrors the database trigger)", () => {
  it("lets only the offering side withdraw", () => {
    expect(canTransitionOffer("pending", "withdrawn", { side: "offering" })).toBe(true);
    expect(canTransitionOffer("pending", "withdrawn", { side: "requesting", role: "owner" })).toBe(false);
  });

  it("lets only requesting owners and admins accept or decline", () => {
    expect(canTransitionOffer("pending", "accepted", { side: "requesting", role: "admin" })).toBe(true);
    expect(canTransitionOffer("pending", "declined", { side: "requesting", role: "member" })).toBe(false);
    expect(canTransitionOffer("pending", "accepted", { side: "offering" })).toBe(false);
  });

  it("treats non-pending offers as final", () => {
    expect(canTransitionOffer("accepted", "withdrawn", { side: "offering" })).toBe(false);
  });
});

describe("launch market", () => {
  it("contains the Lancaster city center and excludes Philadelphia", () => {
    expect(isInLaunchMarket(LANCASTER_COUNTY_CENTER)).toBe(true);
    expect(isInLaunchMarket({ lng: -75.1652, lat: 39.9526 })).toBe(false);
  });
});
