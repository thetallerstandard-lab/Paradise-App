import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Refreshes the Supabase session on every matched request and writes the
 * rotated auth cookies to both the request (for downstream server code) and
 * the response (for the browser). Pattern from the @supabase/ssr docs.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Before Supabase credentials exist the site still renders; auth is simply off.
  if (!isSupabaseConfigured()) return response;

  const env = getPublicEnv();
  const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // Do not put code between createServerClient and getUser(): it validates
  // the JWT with Supabase Auth and triggers the refresh above.
  await supabase.auth.getUser();

  return response;
}
