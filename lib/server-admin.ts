import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, getSupabaseSecretKey } from "@/utils/env";

/**
 * Server-side client with the Supabase secret key (sb_secret_...) for
 * trusted writes (e.g. persisting AI-generated questions). Bypasses RLS —
 * never expose this client or the key to the browser. Requires
 * SUPABASE_SECRET_KEY in the server env.
 */
export function createAdminClient() {
  return createSupabaseClient(SUPABASE_URL, getSupabaseSecretKey());
}
