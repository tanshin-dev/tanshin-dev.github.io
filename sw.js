// 定义缓存名称及列表
var cacheName = 'pdxh-github-io-v1.01.00';
var appShellFiles = [
    '/',
    '/index.html',
    '/font-weight.html',
    '/mortgage.html',
    '/app.js',
    '/style.css',
    '/favicon.ico',
    '/favicon/android-chrome-192x192.png',
    '/favicon/android-chrome-512x512.png',
    '/favicon/apple-touch-icon.png',
    '/favicon/favicon-16x16.png',
    '/favicon/favicon-32x32.png',
];
//配置 Service Worker
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(appShellFiles);
        })
    );
});
//如果条件允许，Service Worker 将从缓存中请求内容所需的数据，从而提供离线应用功能
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
//可以用来清理那些我们不再需要的缓存
self.addEventListener('activate', function (e) {
    let cacheWhiteList = [cacheName];
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhiteList.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
//监听消息
self.addEventListener("message", event => {
    if( event.data === 'skipWaiting') {
        self.skipWaiting();
    }
})