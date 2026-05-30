// === CONFIGURACIÓN ===
const CACHE_NAME = 'dC-cache-v5.0.3'; 
const ASSETS_TO_CACHE = [
    '/images/logo.webp',
    '/images/landing-page/banner.webp',
    '/images/landing-page/portada-320w.webp',
    '/images/landing-page/portada-480w.webp',
    '/images/landing-page/portada-800w.webp',
    '/images/landing-page/portada.webp',
    '/favicon.svg',
    '/manifest.json',
    '/404'
];

const debugMode = false;
const debugLog = (message, ...args) => {if (debugMode) {console.log(`[SW] ${message}`, ...args);}}

// === INSTALACIÓN ===
self.addEventListener('install', (event) => {
    debugLog('Instalando y cacheando activos iniciales');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(async (cache) => {
            const assetsToCacheSafe = ASSETS_TO_CACHE.filter(path => path !== '/404');
            
            try {
                await cache.addAll(assetsToCacheSafe);
                debugLog('Assets estándar cacheados con éxito');
            } catch (err) {
                debugLog('Error en addAll, reintentando uno a uno');
                for (const asset of assetsToCacheSafe) {
                    try { await cache.add(asset); } catch (e) { debugLog('Fallo:', asset); }
                }
            }

            try {
                const response404 = await fetch('/404');
                await cache.put('/404', response404);
                debugLog('Página 404 cacheada manualmente');
            } catch (err) {
                debugLog('Error crítico al cachear 404:', err);
            }
        })
        .then(() => self.skipWaiting())
    );
});

// === ACTIVACIÓN ===
self.addEventListener('activate', (event) => {
    debugLog('Iniciando activación...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        debugLog('Borrando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            debugLog('Activación completada. Reclamando control...');
            return self.clients.claim();
        }).catch(() => {debugLog('Activación completada sin reclamar control')})
    );
});

// === FETCH ===
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(async () => {
                debugLog('Navegación fallida, sirviendo fallback offline');
                const cache = await caches.open(CACHE_NAME);
                const offlineResponse = await cache.match('/404');
                if (offlineResponse) return offlineResponse;
                return Response.error();
            })
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
