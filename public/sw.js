const CACHE_NAME = "tic-tac-toe-v2.4.0";

const soundFiles = [
  "/sounds/click.mp3",
  "/sounds/unselect.mp3",
  "/sounds/freeze.mp3",
  "/sounds/bomb.mp3",
  "/sounds/swap.mp3",
  "/sounds/victory-1.mp3",
  "/sounds/victory-2.mp3",
  "/sounds/draw.mp3",
];

const assets = [
  "/",
  "/manifest.json",
  "/PWA/icons/maskable-icon.webp",
  ...soundFiles,
];

async function installServiceWorker() {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(assets);
  } catch (error) {
    console.error("Failed to install service worker:", error);
  }
}

// Cache-first strategy
async function handleFetchRequest(event) {
  try {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    const response = await fetch(event.request);
    const isValidResponse =
      response && response.status === 200 && response.type === "basic";

    if (!isValidResponse) return response;

    await storeResponseInCache(event.request, response.clone());
    return response;
  } catch (error) {
    const isNavigationRequest = event.request.mode === "navigate";
    if (isNavigationRequest) return caches.match("/offline");
    return null;
  }
}

async function storeResponseInCache(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
  } catch (error) {
    console.error("Failed to cache response for request:", request.url, error);
  }
}

async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const cachesToDelete = cacheNames
      .filter((cacheName) => cacheName !== CACHE_NAME)
      .map((name) => caches.delete(name));

    await Promise.all(cachesToDelete.filter(Boolean));
  } catch (error) {
    console.error("Failed to cleanup old caches:", error);
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(installServiceWorker());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetchRequest(event));
});

self.addEventListener("activate", (event) => {
  clients.claim();
  event.waitUntil(cleanupOldCaches());
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
