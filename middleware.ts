import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { protocol, host, pathname, search } = request.nextUrl
  
  // Force HTTPS redirect (except for localhost in development)
  if (protocol === 'http:' && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    const httpsUrl = `https://${host}${pathname}${search}`
    return NextResponse.redirect(httpsUrl, 301)
  }

  // Create response
  const response = NextResponse.next()

  // Enhanced Security Headers for Best Practices
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), autoplay=(self)')
  
  // HTTPS enforcement and HSTS
  if (protocol === 'https:' || process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Content Security Policy (optimized for performance and security)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://widget.bandsintown.com https://open.spotify.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: https://i.ytimg.com https://yt3.ggpht.com",
    "font-src 'self' https://fonts.gstatic.com",
    "media-src 'self' blob: data: https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.bandsintown.com https://open.spotify.com https://*.spotify.com https://spotify.com",
    "connect-src 'self' https: wss: https://www.youtube.com https://open.spotify.com https://*.spotify.com",
    "worker-src 'self'",
    "manifest-src 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Enhanced cache optimization for different resource types
  const url = request.nextUrl.pathname
  
  if (url.includes('/_next/static/') || url.endsWith('.js') || url.endsWith('.css')) {
    // Long cache for static JS/CSS bundles
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (url.includes('/images/') || url.includes('/videos/')) {
    // Long cache for media assets
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (url.includes('/api/')) {
    // Short cache for API with stale-while-revalidate
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  } else if (url.includes('/_next/image/')) {
    // Optimized cache for Next.js image optimization
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  } else {
    // Medium cache for pages with ISR support
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  }
  
  // Critical resource hints for homepage
  if (url === '/') {
    const resourceHints = [
      '</images/whiteICON.png>; rel=preload; as=image; type=image/png',
      '</videos/Video-Hero-Section.mp4>; rel=preload; as=video; type=video/mp4',
      '<https://fonts.googleapis.com>; rel=preconnect',
      '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
      '<https://www.youtube.com>; rel=dns-prefetch',
      '<https://widget.bandsintown.com>; rel=dns-prefetch',
      '<https://open.spotify.com>; rel=dns-prefetch'
    ]
    response.headers.set('Link', resourceHints.join(', '))
  }

  // Compression hints
  response.headers.set('Vary', 'Accept-Encoding')

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
     * - sw.js (service worker)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)',
  ],
}
