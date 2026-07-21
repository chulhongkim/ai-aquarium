const CACHE_NAME = "ai-aquarium-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=10",
  "./main.js?v=10",
  "./manifest.webmanifest?v=10",
  "./icon.svg",
  "./icon-180.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isFreshAsset = url.pathname.endsWith("/") || url.pathname.endsWith(".html") || url.pathname.endsWith(".css") || url.pathname.endsWith(".js");
  if (isFreshAsset) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});



