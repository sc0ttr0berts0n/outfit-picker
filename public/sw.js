const CACHE_NAME = 'outfit-picker-v1'

// App shell files to cache on install
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/img/clothing/dress.svg',
  '/img/clothing/logo.svg',
  '/img/clothing/shirt.svg',
  '/img/clothing/skirt.svg',
  '/img/clothing/sweater.svg',
  '/img/clothing/tank-top.svg',
  '/img/clothing/trousers.svg',
  '/img/clothing/tshirt.svg',
]

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: network-first for API calls, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Network-only for weather API (always want fresh data)
  if (url.hostname === 'api.open-meteo.com') {
    return
  }

  // Network-first for navigation (HTML), cache-first for assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Cache-first for everything else (JS, CSS, SVGs, fonts)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        // Cache successful same-origin responses
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
