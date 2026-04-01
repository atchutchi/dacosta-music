/** Edge-compatible timing-safe string compare (no Node crypto). */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export function shouldSkipApiCsrf(pathname: string): boolean {
  return (
    pathname.startsWith("/api/webhooks/") ||
    pathname.startsWith("/api/emails/") ||
    pathname === "/api/csrf"
  )
}

export function verifyApiDoubleSubmitCsrf(request: Request): boolean {
  const method = request.method.toUpperCase()
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true
  const cookie = request.headers.get("cookie")
  let tokenFromCookie: string | undefined
  if (cookie) {
    for (const part of cookie.split(";")) {
      const [k, ...rest] = part.trim().split("=")
      if (k === "csrf_token") {
        tokenFromCookie = decodeURIComponent(rest.join("="))
        break
      }
    }
  }
  const header = request.headers.get("x-csrf-token")
  if (!tokenFromCookie || !header) return false
  return timingSafeEqualString(tokenFromCookie, header)
}
