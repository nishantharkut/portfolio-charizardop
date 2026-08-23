const LEGACY_CACHE_PREFIX = 'portfolio-';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(LEGACY_CACHE_PREFIX))
          .map((cacheName) => caches.delete(cacheName)),
      );

      await self.clients.claim();
      const windows = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
      });

      await self.registration.unregister();
      await Promise.all(
        windows.map((client) => client.navigate(client.url).catch(() => undefined)),
      );
    })(),
  );
});
