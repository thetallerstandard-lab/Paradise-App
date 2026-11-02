import { describe, expect, it } from "vitest";

import { EnvError, parsePublicEnv, parseServerEnv } from "@/lib/env";

const validPublic = {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

describe("parsePublicEnv", () => {
  it("accepts a complete public config and treats the Mapbox token as optional", () => {
    expect(parsePublicEnv(validPublic)).toEqual(validPublic);
  });

  it("treats empty strings as missing and names the missing keys", () => {
    expect(() => parsePublicEnv({ ...validPublic, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
    );
  });

  it("rejects a malformed Supabase URL", () => {
    expect(() => parsePublicEnv({ ...validPublic, NEXT_PUBLIC_SUPABASE_URL: "not a url" })).toThrow(EnvError);
  });
});

describe("parseServerEnv", () => {
  it("requires the Supabase secret key without echoing its value", () => {
    expect(() => parseServerEnv({})).toThrow(/SUPABASE_SECRET_KEY/);
    expect(parseServerEnv({ SUPABASE_SECRET_KEY: "sb_secret_x" }).SUPABASE_SECRET_KEY).toBe("sb_secret_x");
  });
});
