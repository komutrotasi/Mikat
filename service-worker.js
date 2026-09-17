// Mikat v50: Maskot optimizasyonu, 10 dk hatirlatma, mobil gizleme ve DOM duzeltmeleri
const CACHE_NAME = 'mikat-v53';
const STATIC_ASSETS = [
  './',
  './index.html',
  './mikat-logo.png',
  './manifest.json',
  './styles.css',
  './app.js',
  './css/admin.css',
  './js/admin.js',
  './admin.html',
  './data/ayetler.json',
  './data/hadisler.json',
  './data/dualar.json',
  './data/esmalar.json',
  './data/namaz_ayetleri.json',
  './data/zikirler.json',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Eski cache sürümlerini temizle
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Google Fonts & Static CDN Font Önbellekleme
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        }).catch(() => new Response('', { status: 404, statusText: 'Blocked or offline' }));
      })
    );
    return;
  }

  // API çağrıları (namaz vakitleri): Network-first, fallback cache
  if (url.hostname === 'api.aladhan.com') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request).then(c => c || new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })))
    );
    return;
  }

  // Statik dosyalar: Cache-first, fallback network
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
