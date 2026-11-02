import { describe, expect, it } from "vitest";

import {
  LANCASTER_TOWNS,
  contractorProfileFormSchema,
  findTown,
  isInLaunchMarket,
  metersToMiles,
  milesToMeters,
} from "@/modules/network";

const trade = "6f1c2c1e-4b8a-4d3e-9a51-2a7f0c9b8d10";
const base = {
  isInsured: false,
  serviceRadiusMiles: "25",
  primaryTradeId: trade,
  tradeIds: [],
  publish: false,
};

describe("LANCASTER_TOWNS", () => {
  it("are all inside the launch market and uniquely named", () => {
    for (const town of LANCASTER_TOWNS) expect(isInLaunchMarket(town)).toBe(true);
    expect(new Set(LANCASTER_TOWNS.map((t) => t.name)).size).toBe(LANCASTER_TOWNS.length);
  });

  it("findTown matches exact names only", () => {
    expect(findTown("Lititz")?.lat).toBeCloseTo(40.157, 2);
    expect(findTown("lititz")).toBeUndefined();
    expect(findTown("123 Main St")).toBeUndefined();
  });

  it("converts service radius both ways", () => {
    expect(milesToMeters(25)).toBe(40234);
    expect(metersToMiles(milesToMeters(50))).toBe(50);
  });
});

describe("contractorProfileFormSchema", () => {
  it("accepts a minimal draft and normalises blanks", () => {
    const parsed = contractorProfileFormSchema.parse({ ...base, headline: "", yearsInBusiness: "" });
    expect(parsed.headline).toBeUndefined();
    expect(parsed.yearsInBusiness).toBeUndefined();
    expect(parsed.serviceRadiusMiles).toBe(25);
  });

  it("requires a main trade", () => {
    const result = contractorProfileFormSchema.safeParse({ ...base, primaryTradeId: "" });
    expect(result.success).toBe(false);
  });

  it.each(["-1", "151", "2.5", "lots"])("rejects years in business %s", (yearsInBusiness) => {
    expect(contractorProfileFormSchema.safeParse({ ...base, yearsInBusiness }).success).toBe(false);
  });

  it("rejects radii that are not offered", () => {
    expect(contractorProfileFormSchema.safeParse({ ...base, serviceRadiusMiles: "500" }).success).toBe(false);
  });
});
