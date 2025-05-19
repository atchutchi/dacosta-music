"use server"

import { cookies } from "next/headers"

/**
 * Debug utility to check if CSRF environment variable is properly loaded
 * This should only be used during development
 */
export async function debugCsrfEnvironment() {
  // Check if CSRF_SECRET is defined
  const csrfSecret = process.env.CSRF_SECRET

  // Return status without revealing the actual secret
  return {
    csrfSecretDefined: !!csrfSecret,
    csrfSecretLength: csrfSecret?.length || 0,
    cookiesAvailable: !!cookies(),
  }
}
