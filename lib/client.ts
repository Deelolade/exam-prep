import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/utils/env'

type BrowserClientOptions = Parameters<typeof createBrowserClient>[2]

export function createClient(options?: BrowserClientOptions) {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, options)
}
