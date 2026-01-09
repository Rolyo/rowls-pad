const CACHE_NAME = "rowls-pad-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",

  // icons (MATCH MANIFEST)
  "./icons/icon1.png",
  "./icons/icon-512.png",

  // splash / images
  "./images/aa.jpg"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (CACHE FIRST + AUTO CACHE)
self.addEventListener("fetch", event => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req)
        .then(networkRes => {
          // Cache audio, images, and app files
          if (
            req.url.includes("/sounds/") ||
            req.url.includes("/images/") ||
            req.url.endsWith(".js") ||
            req.url.endsWith(".css")
          ) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(req, networkRes.clone());
              return networkRes;
            });
          }
          return networkRes;
        })
        .catch(() => cached);
    })
  );
});
