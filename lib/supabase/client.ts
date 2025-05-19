import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../database.types"

// For use in client components
export function createClientClient() {
  return createClientComponentClient<Database>()
}

// For backward compatibility
export function createClient() {
  return createClientComponentClient<Database>()
}
