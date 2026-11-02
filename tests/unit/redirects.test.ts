import { describe, expect, it } from "vitest";

import { isGuestOnlyPath, isProtectedPath, safeNextPath } from "@/lib/redirects";

describe("safeNextPath", () => {
  it.each(["/dashboard", "/c/alpha-roofing", "/profile?saved=draft"])("keeps same-origin path %s", (path) => {
    expect(safeNextPath(path)).toBe(path);
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "dashboard",
    "",
    null,
    undefined,
    "/ok\nSet-Cookie: x",
  ])("rejects %s", (raw) => {
    expect(safeNextPath(raw)).toBe("/dashboard");
  });

  it("uses the given fallback", () => {
    expect(safeNextPath("//x", "/")).toBe("/");
  });
});

describe("route classification", () => {
  it("protects app routes but not lookalikes", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/profile")).toBe(true);
    expect(isProtectedPath("/onboarding/step")).toBe(true);
    expect(isProtectedPath("/profiles-public")).toBe(false);
    expect(isProtectedPath("/c/acme")).toBe(false);
  });

  it("sends signed-in users away from sign-in and sign-up only", () => {
    expect(isGuestOnlyPath("/sign-in")).toBe(true);
    expect(isGuestOnlyPath("/sign-up")).toBe(true);
    expect(isGuestOnlyPath("/reset-password")).toBe(false);
  });
});
