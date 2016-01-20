/*service-worker.js - enables offline worker
OpenCruise - Copyright (C) 2016 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
credit to https://ole.michelsen.dk/blog/making-an-offline-webapp-with-service-workers.html
*/
var CACHE_VERSION = 'v9';

this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return cache.addAll([
                'css/ocruise.css',
                'css/theme/opencruise.css',
                'css/theme/jquery.mobile.icons.min.css',
                'css/theme/images/ajax-loader.gif',
                'js/libs/jquery.mobile-1.4.5/jquery.mobile.structure-1.4.5.min.css',
                'js/libs/jquery.mobile-1.4.5/jquery.mobile-1.4.5.min.js?bust=V1.3.1',
                'js/libs/require/require.js',
                'js/libs/knockout/knockout-3.4.0.js?bust=V1.3.1',
                'js/libs/jquery/jquery-1.9.1.min.js?bust=V1.3.1',
                'images/biltmore.png',
                'js/mobileinit.js?bust=V1.3.1',
                'js/database.js?bust=V1.3.1',
                'js/main.js?bust=V1.3.1',
                'js/ocruise.js?bust=V1.3.1',
                'js/cruise.js?bust=V1.3.1',
                'js/plot.js?bust=V1.3.1',
                'js/tree.js?bust=V1.3.1',
                'js/cruiselist.js?bust=V1.3.1',
                'js/config.js?bust=V1.3.1',
                'index.html',
                'ocruise.html',
                'apple-touch-icon.png'
            ]).catch(function (error) {
                console.error('Error in service worker install:', error);
            });
        })
    );
});
this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});