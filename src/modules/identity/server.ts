import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user for this request, validated with Supabase Auth
 * (`getUser`, not the unverified cookie session). Cached per request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

/** Redirects anonymous visitors to sign-in, returning here afterwards. */
export async function requireUser(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export function displayNameOf(user: { email?: string; user_metadata?: Record<string, unknown> }): string {
  const name = user.user_metadata?.display_name;
  return typeof name === "string" && name.trim() !== "" ? name : (user.email ?? "");
}
