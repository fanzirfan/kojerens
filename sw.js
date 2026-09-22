/**
 * KOJERENS Service Worker - Offline Caching Engine
 * Author: Fanz Irfan | URL: manji.eu.org
 */

var CACHE_NAME = 'kojerens-v1.2';
var STATIC_ASSETS = [
  './',
  './index.html',
  './landing.css',
  './manifest.json',
  './assets/kojerens-logo.svg',
  './assets/pipeline.js',
  './blob-tracker/index.html',
  './blob-tracker/style.css',
  './blob-tracker/app.js',
  './blob-tracker/gradients.js',
  './ascii-gen/index.html',
  './ascii-gen/styles.css',
  './ascii-gen/script.js',
  './dither-gen/index.html',
  './dither-gen/styles.css',
  './dither-gen/script.js',
  './crt-gen/index.html',
  './crt-gen/styles.css',
  './crt-gen/script.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // Do not cache external cross-origin CDN fonts/scripts unconditionally
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        return cached || fetch(event.request).then(function (res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return res;
        }).catch(function () {
          return cached;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for local files
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      var fetchPromise = fetch(event.request).then(function (networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var resToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, resToCache);
          });
        }
        return networkResponse;
      }).catch(function () {
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
