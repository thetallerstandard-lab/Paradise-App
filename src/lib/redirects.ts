/**
 * Returns `raw` only if it is a same-origin path ("/dashboard", "/c/acme?x=1").
 * Anything else — absolute URLs, protocol-relative "//evil.com", backslash
 * tricks, empty values — falls back. Use for every user-controlled `next`.
 */
export function safeNextPath(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(raw)) return fallback;
  return raw;
}

/** Routes that need a signed-in user. Kept here so middleware and tests share it. */
export const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/profile"] as const;

/** Auth pages a signed-in user should skip. */
export const GUEST_ONLY_PATHS = ["/sign-in", "/sign-up"] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isGuestOnlyPath(pathname: string): boolean {
  return (GUEST_ONLY_PATHS as readonly string[]).includes(pathname);
}
