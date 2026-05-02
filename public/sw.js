// Kill-switch service worker.
// Désinscrit tout SW précédent, vide tous les caches, force un reload des clients.
// Sert à éliminer le SW PWA legacy qui figeait /offres sur une ancienne version.

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
        const clients = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
        await Promise.all(
          clients.map((client) => {
            try {
              const url = new URL(client.url);
              url.searchParams.set("sw-cleanup", Date.now().toString());
              return client.navigate(url.toString());
            } catch {
              return Promise.resolve();
            }
          })
        );
        await self.registration.unregister();
      } catch (err) {
        // best-effort cleanup
      }
    })()
  );
});

// Ne mets jamais rien en cache. Tout passe en réseau direct.
self.addEventListener("fetch", () => {});
