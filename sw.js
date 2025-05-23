const STATIC_CACHE_NAME = 'candy-store-static-v1';
const IMAGE_CACHE_NAME = 'candy-images-v1';
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'app.js',
  'images/icon-192x192.png', // Assuming these are now part of the static assets
  'images/icon-512x512.png'  // Assuming these are now part of the static assets
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Opened static cache and caching core assets');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that are not the current static or image cache
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensure new SW takes control immediately
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Check if the request is for an image from pexels.com
  if (requestUrl.hostname === 'images.pexels.com') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return fetch(event.request).then(networkResponse => {
          console.log('Fetched from network and caching:', event.request.url);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Network request failed, try to get it from the cache
          console.log('Network failed, trying cache for:', event.request.url);
          return cache.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              console.log('Found in image cache:', event.request.url);
              return cachedResponse;
            }
            // Optional: return a placeholder image if not in cache
            console.log('Not found in image cache:', event.request.url);
            return new Response('Image not available offline', { status: 404, statusText: 'Not Found', headers: {'Content-Type': 'text/plain'} });
          });
        });
      })
    );
  } else {
    // For non-image requests (core assets), use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // console.log('Found in static cache:', event.request.url);
            return response; // Cache hit
          }
          // console.log('Not in static cache, fetching from network:', event.request.url);
          return fetch(event.request); // Fallback to network
        }
      )
    );
  }
});
