const CACHE_NAME = 'da-costa-music-v2'
const STATIC_CACHE = 'da-costa-static-v2'
const IMAGES_CACHE = 'da-costa-images-v2'
const API_CACHE = 'da-costa-api-v1'

// Critical resources to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/images/logo-branco-dacosta.webp',
  '/manifest.json',
  '/videos/Video-Hero-Section.mp4'
]

// Assets to cache on first request
const CACHE_ON_REQUEST = [
  '/images/',
  '/_next/static/',
  '/api/'
]

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(CRITICAL_ASSETS.filter(asset => 
          !asset.endsWith('.mp4') // Skip video files in initial cache
        ))
      })
      .then(() => {
        return self.skipWaiting()
      })
      .catch((error) => {
        console.warn('SW install failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, STATIC_CACHE, IMAGES_CACHE, API_CACHE]
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !currentCaches.includes(cacheName))
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests and GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return
  }

  // Skip service worker for admin routes
  if (url.pathname.startsWith('/admin/')) {
    return
  }

  // Strategy 1: Cache First for static assets
  if (url.pathname.includes('/_next/static/') || 
      url.pathname.includes('/images/') ||
      url.pathname.includes('/videos/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Strategy 2: Network First for API calls
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  // Strategy 3: Stale While Revalidate for pages
  event.respondWith(staleWhileRevalidate(request))
})

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const url = new URL(request.url)
  let cacheName = STATIC_CACHE
  
  if (url.pathname.includes('/images/')) {
    cacheName = IMAGES_CACHE
  }

  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.warn('Network request failed:', error)
    // Return offline fallback if available
    return new Response('Offline', { status: 503 })
  }
}

// Network First Strategy - for API calls
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale While Revalidate Strategy - for pages
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

// Background fetch for better UX
self.addEventListener('backgroundfetch', (event) => {
  if (event.tag === 'critical-assets') {
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_ASSETS)
      })
    )
  }
})

// Message event - handle cache updates and communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Clear all caches for fresh start
    const currentCaches = [CACHE_NAME, STATIC_CACHE, IMAGES_CACHE, API_CACHE]
    Promise.all(currentCaches.map(cache => caches.delete(cache)))
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ cacheSize: size })
    })
  }
})

// Utility function to get cache size
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        totalSize += blob.size
      }
    }
  }
  
  return totalSize
}

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      getCacheSize().then(size => {
        // If cache is larger than 50MB, clean old entries
        if (size > 50 * 1024 * 1024) {
          return cleanupOldCacheEntries()
        }
      })
    )
  }
})

// Cleanup old cache entries
async function cleanupOldCacheEntries() {
  const cache = await caches.open(CACHE_NAME)
  const requests = await cache.keys()
  
  // Remove entries older than 7 days
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  
  for (const request of requests) {
    const response = await cache.match(request)
    if (response) {
      const dateHeader = response.headers.get('date')
      if (dateHeader && new Date(dateHeader).getTime() < oneWeekAgo) {
        await cache.delete(request)
      }
    }
  }
} 