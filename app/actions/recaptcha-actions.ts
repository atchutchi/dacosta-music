"use server"

// Get reCAPTCHA site key (server-side only)
export async function getReCaptchaSiteKey() {
  // Return only the public key which is meant to be used on the client
  // This is safe because the NEXT_PUBLIC_ prefix indicates it's designed for client usage
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
}

// Verify reCAPTCHA token
export async function verifyReCaptchaToken(token: string) {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY || "",
        response: token,
      }),
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return false
  }
}
