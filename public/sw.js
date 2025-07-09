const CACHE_NAME = 'da-costa-music-v1'
const STATIC_CACHE = 'da-costa-static-v1'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/images/logo-branco-dacosta.webp',
  '/images/logo-white.png',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip service worker for admin routes
  if (url.pathname.startsWith('/admin/')) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Determine cache strategy based on URL
            let cacheName = CACHE_NAME
            if (url.pathname.includes('/_next/static/') || 
                url.pathname.includes('/images/') ||
                url.pathname.includes('/videos/')) {
              cacheName = STATIC_CACHE
            }

            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache)
              })

            return response
          })
      })
  )
})

// Message event - handle cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Force cache update
    caches.delete(CACHE_NAME)
    caches.delete(STATIC_CACHE)
  }
})

// Handle page visibility changes for better back/forward cache
self.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from bfcache
    // Perform any necessary updates
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'PAGE_RESTORED' })
      })
    })
  }
})

// Background sync for offline capabilities
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background sync operations
      Promise.resolve()
    )
  }
}) 