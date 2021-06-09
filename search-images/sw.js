const staticCacheName = "static-cache-v3";
const dynamicCacheName = "dynamic-cache-v3";
const staticUrls = [
  "./",
  "./index.html",
  "./js/script.js",
  "./js/app.js",
  "./icons/icon-192x192.png",
  "./icons/icon-128x128.png",
  "./offline.html",
  "./style.css",
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticUrls);

  console.log("install success");
});

self.addEventListener("activate", async (event) => {
  const cacheKeys = await caches.keys();
  const checkKeys = cacheKeys.map(async (key) => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  });
  await PromiseAll(checkKeys);
});

self.addEventListener("fetch", (event) => {
  event.respondWith(checkCache(event.request));
});

async function checkCache(request) {
  const cacheResponse = await caches.match(request);
  return cacheResponse || checkNetwork(request);
}

async function checkNetwork(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cacheResponse = await cache.match(request);
    if (cacheResponse) {
      return cacheResponse;
    } else {
      return caches.match("./offline.html");
    }
  }
}
