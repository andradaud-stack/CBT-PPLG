const CACHE_NAME = "cbt-pplg-cache-v1";

const PRECACHE_URLS = [
  "/",
  "/practice",
  "/simulation",
  "/remedial",
  "/history",
  "/profile",
  "/login",
  "/manifest.json",
  "/icon.svg",
];

// Install Event: pre-cache essential routes and assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activate Event: clean up legacy caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch Event: intelligent cache-first and network-first strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 1. Live Server APIs (AI Chat, Admin, Leaderboard server sync): Network-first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            error: "Koneksi offline. Fitur ini memerlukan koneksi internet.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // 2. Static Next.js Bundles, Fonts, and Images: Stale-While-Revalidate / Cache-First
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Navigation Requests (HTML Pages): Network-First with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // Fallback to home page or root cached page
          const rootCached = await caches.match("/");
          if (rootCached) return rootCached;

          return new Response(
            `<!DOCTYPE html>
            <html lang="id">
            <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <title>CBT-PPLG Offline</title>
              <style>
                body { font-family: system-ui, sans-serif; text-align: center; padding: 40px 20px; background: #0f172a; color: #f8fafc; }
                h1 { color: #818cf8; margin-bottom: 8px; }
                p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
                .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; }
              </style>
            </head>
            <body>
              <h1>Mode Offline CBT-PPLG</h1>
              <p>Anda sedang berada di luar jangkauan internet.<br/>Buka kembali halaman latihan atau simulasi yang pernah Anda akses untuk melanjutkan belajar offline.</p>
              <a href="/" class="btn">Kembali ke Beranda</a>
            </body>
            </html>`,
            {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        })
    );
    return;
  }

  // 4. Default strategy: Cache with Network Fallback
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});
