const CACHE_NAME = "tic-tac-toe-v4.2.8";

const SOUND_PATHS = [
  "/assets/sounds/click.mp3",
  "/assets/sounds/unselect.mp3",
  "/assets/sounds/freeze.mp3",
  "/assets/sounds/bomb.mp3",
  "/assets/sounds/swap.mp3",
  "/assets/sounds/victory-1.mp3",
  "/assets/sounds/victory-2.mp3",
  "/assets/sounds/draw.mp3",
];

const ASSETS = [
  "/",
  "/manifest.json",
  "/assets/images/PWA/icons/maskable-icon.webp",
  ...SOUND_PATHS,
];

function isCacheableRequest(request) {
  if (request.method !== "GET") return false;

  const url = new URL(request.url);
  return url.protocol === "http:" || url.protocol === "https:";
}

async function installServiceWorker() {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
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
  if (!isCacheableRequest(event.request)) return;
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
