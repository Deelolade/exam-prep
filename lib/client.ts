import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/utils/env'

type BrowserClientOptions = Parameters<typeof createBrowserClient>[2]

export function createClient(options?: SupabaseClientOptions<never>) {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, options as BrowserClientOptions)
}
