// LegendaPro Service Worker — network-first para o app, cache-first para fontes

const CACHE_NAME = 'legendapro-v3';
const FONT_CACHE = 'legendapro-fonts-v1';

const APP_FILES = ['/', '/index.html', '/app.html', '/login.html', '/assinar.html', '/lp-config.js', '/sound-library.js'];
const FONT_ORIGINS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(APP_FILES).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME && k !== FONT_CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Fontes e CDN: cache-first (raramente mudam)
  if (FONT_ORIGINS.some(o => url.hostname.includes(o))) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(FONT_CACHE).then(c => c.put(e.request, clone).catch(() => {}));
          return res;
        });
      })
    );
    return;
  }

  // App (HTML, JS, etc): network-first — sempre busca versão mais recente
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone).catch(() => {}));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/app.html')))
  );
});
