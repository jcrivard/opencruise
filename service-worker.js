/*service-worker.js - enables offline worker
OpenCruise - Copyright (C) 2016 James C. Rivard
Licensed under the GNU Public License Version 3:
http://www.gnu.org/copyleft/gpl.html
credit to https://ole.michelsen.dk/blog/making-an-offline-webapp-with-service-workers.html
*/
var CACHE_VERSION = 'v6';

this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return cache.addAll([
                'css/ocruise.css',
                'css/theme/opencruise.css',
                'css/theme/jquery.mobile.icons.min.css',
                'css/theme/images/ajax-loader.gif',
                'js/libs/jquery.mobile-1.4.5/jquery.mobile.structure-1.4.5.min.css',
                'js/libs/jquery.mobile-1.4.5/jquery.mobile-1.4.5.min.js?bust=V1.3.1c',
                'js/libs/require/require.js',
                'js/libs/knockout/knockout-3.4.0.js?bust=V1.3.1c',
                'js/libs/jquery/jquery-1.9.1.min.js?bust=V1.3.1c',
                'images/biltmore.png',
                'js/mobileinit.js?bust=V1.3.1c',
                'js/mainmin.js?bust=V1.3.1c',
                'js/ocruise-min.js?bust=V1.3.1c',
            //  'js/main.js?bust=V1.3.1c',
            //    'js/database.js?bust=V1.3.1c',
            //    'js/ocruise.js?bust=V1.3.1c',
            //    'js/cruise.js?bust=V1.3.1c',
            //    'js/plot.js?bust=V1.3.1c',
            //    'js/tree.js?bust=V1.3.1c',
            //    'js/cruiselist.js?bust=V1.3.1c',
            //    'js/config.js?bust=V1.3.1c',
                'index.html',
                'ocruise.html',
                'manifest.json',
                'icon.png'
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