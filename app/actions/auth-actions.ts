"use server"

import { createServerClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

/**
 * Updates the user's password
 * This is a server action and should only be called from server components or form actions
 */
export async function updateUserPassword(newPassword: string) {
  const supabase = await createServerClient()

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    logger.error("Error updating password:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
