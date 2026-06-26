const CACHE_NAME = "parteas-pos-v3"; // Naik versi ke v3 agar browser tahu ada update!

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js",
  "https://i.imgur.com/7HOc5OJ.png"
];

// install - Menyimpan file ke cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Memaksa service worker baru langsung aktif
  );
});

// activate - Menghapus cache versi lama (v2 kebawah) secara otomatis
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Menghapus cache usang:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// fetch - Mengambil file dari cache agar aplikasi bisa jalan offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
