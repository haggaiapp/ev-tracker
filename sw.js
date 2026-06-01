// EV Tracker Service Worker v1.0
const CACHE_NAME = 'ev-tracker-v1';
const ASSETS = [
  '/ev-tracker/',
  '/ev-tracker/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // רק GET requests, ורק מהאתר עצמו
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // בקשות לגוגל Drive / API — תמיד מהרשת
  if (url.hostname !== location.hostname) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && resp.type !== 'opaque') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      });
      return cached || networkFetch;
    })
  );
});
