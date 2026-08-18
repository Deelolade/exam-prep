/**
 * Central env access — every environment variable is read and validated here.
 * Other files must import from this module instead of touching process.env
 * directly.
 *
 * - NEXT_PUBLIC_* values are kept as literal `process.env.NEXT_PUBLIC_...`
 *   references so Next.js can inline them into client bundles (do not wrap
 *   them in dynamic lookups).
 * - Server-only secrets are exposed as lazy getters: they are validated on
 *   first access so a missing key fails with a clear message at the call
 *   site instead of breaking unrelated routes or the edge middleware.
 */

// --- Public (inlined into client bundles by Next.js) ---
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// --- Server-only secrets (validated lazily) ---
export const getSupabaseSecretKey = () => requireEnv("SUPABASE_SECRET_KEY");
export const getResendApiKey = () => requireEnv("RESEND_API_KEY");
export const getEmailFrom = () => requireEnv("EMAIL_FROM");
export const getOpenAIKey = () => requireEnv("OPENAI_API_KEY");

// --- Server-only options (with defaults) ---
export const getAiBaseUrl = () =>
  process.env.AI_BASE_URL?.trim() || "https://api.openai.com/v1";
export const getAiModel = () => process.env.AI_MODEL?.trim() || "gpt-4o-mini";
