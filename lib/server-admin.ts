import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, getSupabaseServiceRoleKey } from "@/utils/env";

/**
 * Service-role client for trusted server-side writes (e.g. persisting
 * AI-generated questions). Bypasses RLS — never expose this client or the
 * key to the browser. Requires SUPABASE_SERVICE_ROLE_KEY in the server env.
 */
export function createAdminClient() {
  return createSupabaseClient(SUPABASE_URL, getSupabaseServiceRoleKey());
}
