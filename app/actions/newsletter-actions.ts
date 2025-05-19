"use server"

import { validateCsrfToken } from "@/lib/csrf"

export async function subscribeToNewsletter(formData: FormData) {
  // Get the CSRF token from the form data
  const csrfToken = formData.get("csrf_token") as string

  // Validate the CSRF token
  const isValidToken = validateCsrfToken(csrfToken)
  if (!isValidToken) {
    return {
      success: false,
      error: "Invalid security token. Please refresh the page and try again.",
    }
  }

  // Get the email from the form data
  const email = formData.get("email") as string

  // Validate the email
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return {
      success: false,
      error: "Please provide a valid email address.",
    }
  }

  try {
    // In a real application, you would send the email to your newsletter service
    // For now, we'll just simulate a successful subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return {
      success: false,
      error: "An error occurred while subscribing. Please try again.",
    }
  }
}
