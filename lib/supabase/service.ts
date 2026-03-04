import { createClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"

/**
 * Supabase client with service_role key — bypasses RLS.
 * Use ONLY in trusted server-side code (API routes, webhooks, server actions).
 * NEVER expose this client or its key to the browser.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env from Supabase Dashboard > Settings > API."
    )
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
