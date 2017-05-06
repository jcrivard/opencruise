/*service-worker.js - enables offline worker
OpenCruise - Copyright (C) 2017 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
credit to https://ole.michelsen.dk/blog/making-an-offline-webapp-with-service-workers.html
*/
var CACHE_VERSION = 'v2.0.2';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return cache.addAll([
                'manifest.json',
                'static/css/material-surface.css',
                'static/css/app.bde677c474fe65a61c3ae4a3ef8372e0.css',
                'static/fonts/materialicons-regular.570eb83.woff2',
                'static/images/biltmore.png',
                'static/images/icon-144.png',
                'static/images/icon.png',
                'static/js/app.e62eea0a60058517e69f.js',
                'static/js/vendor.a0d197278e968aaa56ac.js',
                'static/js/manifest.9ad858d28f20e245f283.js',
                'index.html']);
        }).then(function() {
            console.log('[ServiceWorker] Install for version', CACHE_VERSION, 'Time:', Date());
            return self.skipWaiting();
        }).catch(function (error) {
            console.log('Error in service worker install:', error);
        })
    );
});
self.addEventListener('activate', function (event) {
    event.waitUntil(
    caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_VERSION) {
                        console.log('[ServiceWorker] Deleteing old cache', cacheName, 'Time:', Date());
                        return caches.delete(cacheName);
                    }
                })
        );
        }).then(function() {
            console.log('[ServiceWorker] Claiming clients for version', CACHE_VERSION, 'Time:', Date());
            return self.clients.claim();
        }).then(function() {
            return self.clients.matchAll();
        }).then(function(all) {
            all.forEach(client => {
                client.postMessage('New Version Loaded: ' + CACHE_VERSION);
            });
            console.log('[ServiceWorker] Activated for version', CACHE_VERSION);
        })
    );
});
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request);
            }
        })
    );
});
