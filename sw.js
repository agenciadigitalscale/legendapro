// LegendaPro Service Worker
// Permite usar offline (com funcionalidades limitadas)

const CACHE_NAME = 'legendapro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.html',
  '/login.html',
  '/dashboard.html',
  '/lp-config.js',
  '/sound-effects.js',
  '/cloud-features.js',
  'https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,700;1,700;1,800&family=Caveat:wght@700&family=Montserrat:ital,wght@0,400;0,700;0,800;1,400&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Ignora erros de cache (alguns assets podem não estar disponíveis)
        return true;
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache).catch(() => {});
        });
        return response;
      }).catch(() => {
        // Offline fallback
        return caches.match('/app.html');
      });
    })
  );
});
