const CACHE_NAME = 'vardaan-notes-v1';
const ASSETS = [
  '.',
  './index.html',
  './manifest.json'
  // add more files (css/js/icons) if you want them cached by default
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // try cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // optional: cache the fetched response for future
        return caches.open(CACHE_NAME).then(cache => {
          // ignore non-GET or data requests
          if (event.request.method === 'GET' && response && response.type === 'basic') {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      }).catch(() => {
        // fallback response if offline and not in cache
        return caches.match('./index.html');
      });
    })
  );
});