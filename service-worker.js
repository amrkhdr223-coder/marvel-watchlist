const CACHE_NAME = 'marvel-watchlist-v21'; // Backend API proxy added — bumped so installed copies pick it up
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for the app shell, so the app opens instantly with no
// network required. Falls back to network for anything else (e.g.
// Google Fonts, TMDB posters on first load), and to cache if offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  const isTMDBImage = event.request.url.startsWith('https://image.tmdb.org/');
  const isTMDBApi = event.request.url.startsWith('https://api.themoviedb.org/') || event.request.url.startsWith('https://www.omdbapi.com/');
  const isOwnApi = reqUrl.origin === self.location.origin && reqUrl.pathname.startsWith('/api/');
  if (isTMDBApi || isOwnApi) return; // never cache API lookups (including our own backend proxy) — always want a fresh result

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const cacheable = response && (response.type === 'basic' || (isTMDBImage && response.type === 'opaque'));
          if (cacheable) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
