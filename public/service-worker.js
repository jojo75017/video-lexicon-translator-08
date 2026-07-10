// Kill-switch service worker.
// Désinscrit tout SW précédent et vide les caches sans forcer de navigation.

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.clients.claim();
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
        await self.registration.unregister();
      } catch (err) {
        // best-effort cleanup
      }
    })()
  );
});

// Ne mets jamais rien en cache. Tout passe en réseau direct.
self.addEventListener("fetch", () => {});
