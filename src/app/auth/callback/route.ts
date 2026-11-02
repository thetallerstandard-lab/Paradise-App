import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/redirects";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for links in Supabase emails (confirm sign-up, reset password).
 * Handles both the PKCE `code` flow and the `token_hash` flow, then sends the
 * user on to a same-origin `next` path.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let ok = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    ok = !error;
  }

  if (!ok) return NextResponse.redirect(`${origin}/sign-in?error=link`);
  return NextResponse.redirect(`${origin}${next}`);
}
