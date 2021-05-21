const staticCacheTitle = "static-cache-2";
const dynamicCacheTitle = "dynamic-cache-2";
const assetsUrls = [
  "index.html",
  "js/app.js",
  "css/styles.css",
  "offline.html",
];

self.addEventListener("install", async () => {
  const cache = await caches.open(staticCacheTitle);
  await cache.addAll(assetsUrls);
});

self.addEventListener("activate", async () => {
  const cacheTitle = await caches.keys();
  await Promise.all(
    cacheTitle
      .filter((title) => title !== staticCacheTitle)
      .filter((title) => title !== dynamicCacheTitle)
      .map((title) => caches.delete(title))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheTitle);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached ?? (await caches.match("/offline.html"));
  }
}
