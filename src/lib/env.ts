import { z } from "zod";

/**
 * Typed environment access. Public values are read with literal
 * `process.env.NEXT_PUBLIC_*` expressions so Next.js can inline them into the
 * client bundle at build time. Server values are read lazily at request time;
 * on Cloudflare, OpenNext populates process.env from Worker vars and secrets.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1).optional(),
});

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

export class EnvError extends Error {
  override name = "EnvError";
}

function emptyToUndefined(value: string | undefined) {
  return value === "" ? undefined : value;
}

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const result = publicSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: emptyToUndefined(source.NEXT_PUBLIC_SITE_URL),
    NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(source.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: emptyToUndefined(source.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    NEXT_PUBLIC_MAPBOX_TOKEN: emptyToUndefined(source.NEXT_PUBLIC_MAPBOX_TOKEN),
  });
  if (!result.success) {
    const keys = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new EnvError(`Missing or invalid public environment variables: ${keys}. See .env.example.`);
  }
  return result.data;
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse({
    SUPABASE_SECRET_KEY: emptyToUndefined(source.SUPABASE_SECRET_KEY),
  });
  if (!result.success) {
    const keys = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new EnvError(`Missing or invalid server environment variables: ${keys}. See .env.example.`);
  }
  return result.data;
}

export function getPublicEnv(): PublicEnv {
  return parsePublicEnv({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  });
}

/** True when Supabase public config is present. Lets middleware skip auth work before credentials exist. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
