export function readBrowserCsrfToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function withCsrfHeaders(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers)
  const token = readBrowserCsrfToken()
  if (token) headers.set("x-csrf-token", token)
  return {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  }
}
