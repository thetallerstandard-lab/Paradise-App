import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

// Readiness check: proves this runtime (Node in dev, workerd on Cloudflare)
// can reach Supabase over HTTP with the publishable key and that RLS lets
// anonymous users read public reference data. Returns no row contents.
export async function GET() {
  const headers = { "cache-control": "no-store" };

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: "unconfigured" }, { status: 503, headers });
  }

  const supabase = await createClient();
  const { count, error } = await supabase.from("trade_categories").select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ status: "error" }, { status: 503, headers });
  }
  return NextResponse.json({ status: "ok", tradeCategories: count }, { headers });
}
