"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  try {
    const supabase = createServerClient()

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating password:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
