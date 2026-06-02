const CACHE_NAME = 'ev-tracker-v2';
const ASSETS = [
  '/ev-tracker/',
  '/ev-tracker/index.html',
  '/ev-tracker/manifest.json'
];

// התקנה ושמירת הקבצים הבסיסיים בזיכרון
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// מענה לבקשות רשת - חובה בשביל לאפשר התקנה
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match('/ev-tracker/') || caches.match('/ev-tracker/index.html');
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});
