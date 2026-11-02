import "server-only";

import { parseServerEnv, type ServerEnv } from "@/lib/env";

/** Server-only secrets. Importing this from a client component fails the build. */
export function getServerEnv(): ServerEnv {
  return parseServerEnv({ SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY });
}
