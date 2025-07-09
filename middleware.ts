import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Enhanced Security Headers for Best Practices
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN') // Allow embedding from same origin
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  
  // HTTPS enforcement (for production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Content Security Policy (relaxed for YouTube and media compatibility)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://widget.bandsintown.com https://open.spotify.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http: https://i.ytimg.com https://yt3.ggpht.com",
    "font-src 'self' https://fonts.gstatic.com",
    "media-src 'self' blob: data: https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.bandsintown.com https://open.spotify.com",
    "connect-src 'self' https: wss: https://www.youtube.com",
    "worker-src 'self'",
    "manifest-src 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Cache optimization for static assets
  const url = request.nextUrl.pathname
  
  if (url.includes('/_next/static/') || url.includes('/images/') || url.includes('/videos/')) {
    // Long cache for static assets
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (url.includes('/api/')) {
    // Short cache for API
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  } else {
    // Medium cache for pages
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  }
  
  // Early hints for critical resources
  if (url === '/') {
    response.headers.set('Link', [
      '</images/logo-branco-dacosta.webp>; rel=preload; as=image',
      '<https://fonts.googleapis.com>; rel=preconnect',
      '<https://www.youtube.com>; rel=dns-prefetch',
      '<https://widget.bandsintown.com>; rel=dns-prefetch',
      '<https://open.spotify.com>; rel=dns-prefetch',
    ].join(', '))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
