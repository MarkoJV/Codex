const staticCacheName = 'static-cache-v98';
const dynamicCacheName = 'dynamic-cache-v89';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/scroll.png',
    '/img/helm.png',
    '/img/win.png',
    '/img/trade.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html',
];

// Cache size limit function

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
};

// Installation

self.addEventListener('install', evt => {
    //console.log('Service worker installed succesfully');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Caching assets');
            cache.addAll(assets);
        })
    );

});

// Activation

self.addEventListener('activate', evt => {
    //console.log('Service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

// Fetch
self.addEventListener('fetch', evt => {
    //console.log('Fetch event', evt);
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
                // Placeholder image here
                /*if(evt.request.url.indexOf('.png') > -1){
                    return caches.match('/img/placeholder.png');
                }*/
            })
        );
    }
});