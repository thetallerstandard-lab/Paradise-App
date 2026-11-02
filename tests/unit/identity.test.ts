import { describe, expect, it } from "vitest";

import { resetPasswordInputSchema, verificationCodeSchema, verifyEmailInputSchema } from "@/modules/identity";

describe("verificationCodeSchema", () => {
  it.each([
    ["12345678", "12345678"],
    ["1234 5678", "12345678"],
    ["1234-5678", "12345678"],
    [" 123456 ", "123456"],
  ])("accepts %j", (input, expected) => {
    expect(verificationCodeSchema.parse(input)).toBe(expected);
  });

  it.each(["", "12345", "12345678901", "12ab5678", "１２３４５６７８"])("rejects %j", (input) => {
    expect(verificationCodeSchema.safeParse(input).success).toBe(false);
  });
});

describe("verifyEmailInputSchema", () => {
  it("normalises the email and the code together", () => {
    expect(verifyEmailInputSchema.parse({ email: " Owner@Example.COM ", code: "8765 4321" })).toEqual({
      email: "owner@example.com",
      code: "87654321",
    });
  });
});

describe("resetPasswordInputSchema", () => {
  it("requires matching passwords", () => {
    const result = resetPasswordInputSchema.safeParse({ password: "long-enough-1", confirmPassword: "long-enough-2" });
    expect(result.success).toBe(false);
  });
});
