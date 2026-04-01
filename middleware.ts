import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkApiRateLimit } from "@/lib/rate-limit"
import {
  shouldSkipApiCsrf,
  verifyApiDoubleSubmitCsrf,
} from "@/lib/csrf-edge-verify"

const SUPABASE_HOST = "https://oxplahazlmpcpkelpolv.supabase.co"
const SUPABASE_WSS = "wss://oxplahazlmpcpkelpolv.supabase.co"

function randomNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
}

function applySecurityHeadersBase(response: NextResponse) {
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), autoplay=(self)"
  )
}

function isPublicApiGet(request: NextRequest): boolean {
  if (request.method.toUpperCase() !== "GET") return false
  const path = request.nextUrl.pathname
  if (path === "/api/products") return true
  if (path.startsWith("/api/products/")) return true
  if (path === "/api/events") return true
  if (path.startsWith("/api/events/")) return true
  if (path === "/api/artists") return true
  if (path.startsWith("/api/artists/")) return true
  return false
}

function applyApiSecurityHeaders(response: NextResponse, request: NextRequest) {
  applySecurityHeadersBase(response)
  response.headers.set("X-Frame-Options", "DENY")
  if (isPublicApiGet(request)) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    )
  } else {
    response.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate"
    )
  }
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }
}

export async function middleware(request: NextRequest) {
  const { protocol, host, pathname, search } = request.nextUrl

  if (pathname.startsWith("/api/")) {
    const { success } = await checkApiRateLimit(request)
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    }
    if (!shouldSkipApiCsrf(pathname) && !verifyApiDoubleSubmitCsrf(request)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      )
    }
    const res = NextResponse.next()
    applyApiSecurityHeaders(res, request)
    return res
  }

  if (protocol === "http:" && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    const httpsUrl = `https://${host}${pathname}${search}`
    return NextResponse.redirect(httpsUrl, 301)
  }

  const nonce = randomNonce()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  applySecurityHeadersBase(response)

  if (protocol === "https:" || process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }

  const scriptSrc = [
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://widget.bandsintown.com",
    "https://open.spotify.com",
    "https://www.google.com",
    "https://www.gstatic.com",
  ].join(" ")

  const connectSrc = [
    "'self'",
    SUPABASE_HOST,
    SUPABASE_WSS,
    "https://*.stripe.com",
    "https://www.youtube.com",
    "https://www.google.com",
    "https://open.spotify.com",
    "https://*.spotify.com",
  ].join(" ")

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: https://i.ytimg.com https://yt3.ggpht.com",
    "font-src 'self' https://fonts.gstatic.com",
    "media-src 'self' blob: data: https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com https://*.spotify.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.bandsintown.com https://open.spotify.com https://*.spotify.com https://spotify.com",
    `connect-src ${connectSrc}`,
    "worker-src 'self'",
    "manifest-src 'self'",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  const url = request.nextUrl.pathname

  if (url.includes("/_next/static/") || url.endsWith(".js") || url.endsWith(".css")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  } else if (url.includes("/images/") || url.includes("/videos/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  } else if (url.includes("/_next/image/")) {
    response.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800")
  } else {
    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
  }

  if (url === "/") {
    const resourceHints = [
      "</images/whiteICON.png>; rel=preload; as=image; type=image/png",
      "</images/club-view.webp>; rel=preload; as=image; type=image/webp",
      "<https://fonts.googleapis.com>; rel=preconnect",
      "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
      "<https://www.youtube.com>; rel=dns-prefetch",
      "<https://widget.bandsintown.com>; rel=dns-prefetch",
      "<https://open.spotify.com>; rel=dns-prefetch",
    ]
    response.headers.set("Link", resourceHints.join(", "))
  }

  response.headers.set("Vary", "Accept-Encoding")

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)",
  ],
}
