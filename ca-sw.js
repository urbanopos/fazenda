/* ColetaAut Service Worker — GitHub Pages
   Serve os arquivos do app com cache offline e garante atualização automática */
var CACHE_NAME = 'coletaaut-v1';
var ASSETS = [
  'https://urbanopos.github.io/fazenda/ColetaAut-Admin.html',
  'https://urbanopos.github.io/fazenda/ColetaAut-Coletor.html',
  'https://urbanopos.github.io/fazenda/icon-admin-512.png',
  'https://urbanopos.github.io/fazenda/icon-admin-192.png',
  'https://urbanopos.github.io/fazenda/icon-coletor-512.png',
  'https://urbanopos.github.io/fazenda/icon-coletor-192.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys
        .filter(function(k) { return k !== CACHE_NAME; })
        .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request, {cache:'no-store'})
      .then(function(r) {
        // Atualiza cache com versão nova
        var clone = r.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
        return r;
      })
      .catch(function() {
        // Offline: serve do cache
        return caches.match(e.request);
      })
  );
});
