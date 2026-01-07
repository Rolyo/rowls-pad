const CACHE_NAME = "sampler-pad-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",

  // sounds
  "./sounds/drum1.mp3",
  "./sounds/drum2.mp3",

  // icons
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  
  // service-worker.js
  "./sounds/wedding1.mp3",
  "./sounds/wedding2.mp3",
  "./sounds/wedding3.mp3",
  "./sounds/wedding4.mp3",
  "./sounds/wedding5.mp3",
  "./sounds/wedding6.mp3",
  "./sounds/wedding7.mp3",
  "./sounds/wedding8.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
