import { NextResponse, type NextRequest } from "next/server";

import { isGuestOnlyPath, isProtectedPath } from "@/lib/redirects";
import { redirectWithCookies, updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // One canonical host: www.paradisetrades.com -> paradisetrades.com.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const { response, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  // Fast path only: protected pages also check the user server-side.
  if (!user && isProtectedPath(pathname)) {
    const next = encodeURIComponent(`${pathname}${search}`);
    return redirectWithCookies(request, response, "/sign-in", `?next=${next}`);
  }
  if (user && isGuestOnlyPath(pathname)) {
    return redirectWithCookies(request, response, "/dashboard");
  }
  return response;
}

export const config = {
  // Skip static assets, images and the health checks.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
