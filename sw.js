const CACHE_NAME='meiri-xiaoji-v33-quote-layout-fixed';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './woodland-scene.svg', './meadow-watercolor.webp', './bunny-corner.png', './mushroom-corner.png', './save-bunny.png', './save-mushrooms.png', './health-woodland-scene.png', './health-banner-stream.png', './quote-bunny-carrot.png', './health-exercise-rabbit.png', './week-running-rabbit.png', './calendar-rabbit.png', './save-meadow-scene.png', './water-garden-art.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppHtml = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html');
  if (isAppHtml) {
    event.respondWith(fetch(event.request).then(response => {
      if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); }
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); return response; }).catch(() => caches.match('./index.html'))));
});
