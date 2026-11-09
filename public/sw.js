/* global self, caches */
// The old montymi.com installed a caching service worker at /sw.js, which kept serving the old
// site after a deploy. Browsers check this address for updates, so this replacement takes over,
// deletes every cache it left, unregisters itself, and reloads open tabs onto the live site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: 'window' });
      for (const tab of tabs) tab.navigate(tab.url);
    })(),
  );
});
