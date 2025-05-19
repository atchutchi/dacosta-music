"use server"

import { generateCsrfToken, validateCsrfToken } from "@/lib/csrf"

/**
 * Generate a new CSRF token
 */
export async function getCsrfToken(): Promise<string> {
  try {
    return await generateCsrfToken()
  } catch (error) {
    console.error("Error in getCsrfToken:", error)
    throw new Error("Failed to generate security token")
  }
}

/**
 * Validate a CSRF token
 */
export async function verifyCsrfToken(token: string): Promise<boolean> {
  try {
    return await validateCsrfToken(token)
  } catch (error) {
    console.error("Error in verifyCsrfToken:", error)
    return false
  }
}
