import { randomBytes, createHash } from "crypto"
import { cookies } from "next/headers"

// Get the CSRF secret from environment variables
const CSRF_SECRET = process.env.CSRF_SECRET

// Token expiration time (1 hour)
const TOKEN_EXPIRATION = 60 * 60 * 1000

/**
 * Generate a CSRF token and store it in a cookie
 */
export function generateCsrfToken(): string {
  if (!CSRF_SECRET) {
    console.error("CSRF_SECRET environment variable is not defined")
    throw new Error("CSRF configuration error")
  }

  try {
    // Generate a random token
    const random = randomBytes(32).toString("hex")
    const timestamp = Date.now().toString()

    // Create the token with timestamp to allow expiration
    const payload = `${random}|${timestamp}`

    // Hash the token with the secret
    const hash = createHash("sha256").update(`${payload}${CSRF_SECRET}`).digest("hex")

    // Final token is payload + hash
    const csrfToken = `${payload}|${hash}`

    // Store in a cookie (HTTP only for security)
    cookies().set("csrf_token", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: TOKEN_EXPIRATION / 1000, // Convert to seconds
    })

    return csrfToken
  } catch (error) {
    console.error("Error generating CSRF token:", error)
    throw new Error("Failed to generate security token")
  }
}

/**
 * Validate a CSRF token against the one stored in cookies
 */
export function validateCsrfToken(token: string): boolean {
  if (!CSRF_SECRET) {
    console.error("CSRF_SECRET environment variable is not defined")
    return false
  }

  try {
    // Get the stored token from cookies
    const storedToken = cookies().get("csrf_token")?.value

    if (!storedToken || !token) {
      console.error("CSRF token missing from cookie or request")
      return false
    }

    // Token should be in format: random|timestamp|hash
    const parts = token.split("|")
    if (parts.length !== 3) {
      console.error("Invalid CSRF token format")
      return false
    }

    const [random, timestampStr, providedHash] = parts
    const payload = `${random}|${timestampStr}`

    // Check if token has expired
    const timestamp = Number.parseInt(timestampStr, 10)
    if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_EXPIRATION) {
      console.error("CSRF token has expired")
      return false
    }

    // Verify the hash
    const expectedHash = createHash("sha256").update(`${payload}${CSRF_SECRET}`).digest("hex")

    // Compare the provided hash with the expected hash
    const isValid = providedHash === expectedHash && token === storedToken
    if (!isValid) {
      console.error("CSRF token validation failed")
    }
    return isValid
  } catch (error) {
    console.error("Error validating CSRF token:", error)
    return false
  }
}
