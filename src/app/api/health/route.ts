import { NextResponse } from "next/server";

// Liveness check for the deployed Worker. Deliberately touches no external
// service so it isolates "is the Worker up" from "is Supabase reachable".
export function GET() {
  return NextResponse.json({ status: "ok", service: "paradise" }, { headers: { "cache-control": "no-store" } });
}
