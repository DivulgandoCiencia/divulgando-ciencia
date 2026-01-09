// === CONFIGURACIÓN ===
const PREFIX = 'divulgandociencia-cache';
const CURRENT_VERSION = '1.00.0001';
const CURRENT_CACHE = `${PREFIX}-v${CURRENT_VERSION}`;
const urlsToCache = ["/", "/page/es/article", "/page/en/article", "/manifest.webmanifest", "/favicon.ico"];

// === HELPERS ===
function parseVersion(name) {
    const m = name.match(/v(\d+)\.(\d+)\.(\d+)/);
    return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : null;
}

function isNewer(a, b) {
    for (let i = 0; i < 3; i++) {
        if (a[i] > b[i]) return true;
        if (a[i] < b[i]) return false;
    }
    return false;
}

async function migrateFromPreviousCache() {
    const keys = await caches.keys();
    const ownCaches = keys
    .filter(k => k.startsWith(PREFIX) && k !== CURRENT_CACHE)
    .map(k => ({ name: k, version: parseVersion(k) }))
    .filter(v => v.version);
    const currentVer = parseVersion(CURRENT_CACHE);
    if (!currentVer) return;
    let prev = null;
    for (const c of ownCaches) {
        if (isNewer(currentVer, c.version)) {
            if (!prev || isNewer(c.version, prev.version)) prev = c;
        }
    }
    if (!prev) return;
    console.log('[SW] Migrando desde', prev.name);
    const oldCache = await caches.open(prev.name);
    const newCache = await caches.open(CURRENT_CACHE);
    const requests = await oldCache.keys();
    for (const req of requests) {
        if (req.url.includes('/api/content/article/')) {
            const resp = await oldCache.match(req);
            if (resp) await newCache.put(req, resp.clone());
        }
    }
    const del = keys
    .filter(k => k.startsWith(PREFIX) && k !== CURRENT_CACHE)
    .map(k => caches.delete(k));
    await Promise.all(del);
}

function getRealPath(request) {
    try {
        const url = new URL(request);
        if (url.origin !== self.location.origin) return request;
        const excluded = [
            '/api', '/page', '/docs', '/fonts', '/images', '/json',
            '/ads.txt', '/sitemap.xml', '/robots.txt', '/sw.js',
            '/manifest.json', '/favicon.svg', '/src', '/node_modules', '/@', '/.well-known'
        ];
        const endpaths = ['.webp', '.png', '.pdf', '.js', '.pdf', '.json', '.ts', '.xml', '.jst']
        const isExcluded = excluded.some(path => url.pathname.startsWith(path)) || endpaths.some(path => url.pathname.endsWith(path));
        if (!isExcluded) {url.pathname = '/'; return url}
        return request;
    } catch (e) {console.log(e, request); return request;}
}

async function getSavedArticles() {
    const cacheNames = await caches.keys();
    const targetCacheName = cacheNames.find((n) => n.startsWith("divulgandociencia-cache"));
    if (!targetCacheName) return [];

    const cache = await caches.open(targetCacheName);
    const requests = await cache.keys();
    const savedArticles = [];

    for (const req of requests) {
        if (req.url.includes("/api/content/es/article/") || req.url.includes("/api/content/en/article/")) {
            try {
                const resp = await cache.match(req);
                if (!resp) continue;
                const json = await resp.clone().json();
                const article = {
                    slug: json.slug,
                    articleTitle: json.articleTitle,
                    articleDescription: json.articleDescription,
                    portrait: json.portrait,
                    authorData: json.authorData,
                    scienceDataId: json.scienceDataId,
                    scienceDataName: json.scienceDataName,
                    scienceDataColor: json.scienceDataColor,
                    readTimeNum: json.readTimeNum,
                    date: json.date,
                };
                savedArticles.push(article);
            } catch (e) {
                console.warn("[SW] Error procesando artículo guardado:", e);
            }
        }
    }
    return savedArticles;
}

async function offlinePageHandler() {
    const articles = await getSavedArticles()
    const text = `
<div class="p-4 flex flex-col">
    <h1 class="text-3xl font-bold">Sin Conexión - Offline</h1>
    <h2 class="text-2xl font-bold">Artículos guardados - Saved Articles</h2>
    ${articles.length > 0 ? articles.map((art) => `
<div class="${"rounded-lg text-card-foreground shadow-md dark:shadow-lg gradient-"+art.scienceDataColor}">
    <div class="p-6">
        <div class="mb-2">
            <h3 class="text-xl font-semibold"><a href=${`/article/${art.slug.split('/')[2]}`} class="hover:text-primary">${art.articleTitle}</a></h3>
            <div class="flex items-center gap-2 text-sm mt-1">
                <span class="${"bg-principal-black bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full color-"+art.scienceDataColor}">${t[art.slug.split('/')[0]][art.scienceDataId]}</span>
                <span>${art.date}</span>
                <span>•</span>
                <span>${art.readTimeNum} ${t[art.slug.split('/')[0]]['readTime']}</span>
            </div>
        </div>
        <p class="text-muted-foreground mb-4 line-clamp-3">${art.articleDescription}</p>
        <div class="flex justify-between items-center">
            <div class="text-sm text-muted-foreground">${t[art.slug.split('/')[0]]['by']} ${art.authorData[0]}</div>
            <a href=${`/article/${art.slug.split('/')[2]}`}>
                <button type="button" class='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3'>
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                    </svg>
                    ${t[art.slug.split('/')[0]]['readArticle']}
                </button>
            </a>
        </div>
    </div>
</div>
`).join('')
: '<p class="font-light">Ningún artículo guardado - None articles saved</p>'}
</div>
`
    return text
}

const t = {"es":  {
        "all": "Todas las Ciencias",
        "sciences": "Ciencias",
        "math": "Matemáticas",
        "physics": "Física",
        "chemistry": "Química",
        "biology": "Biología",
        "geology": "Geología",
        "technology": "Tecnología",
        "coding": "Programación",
        "scientists": "Científicos",
        "timeStamp": "es-ES",
        "readTime": "min de lectura",
        "by": "Por",
        "readArticle": "Leer Artículo"
    }, "en": {
        "all": "All Sciences",
        "sciences": "Sciences",
        "math": "Mathematics",
        "physics": "Physics",
        "chemistry": "Chemistry",
        "biology": "Biology",
        "geology": "Geology",
        "technology": "Technology",
        "coding": "Coding",
        "scientists": "Scientists",
        "timeStamp": "en-EN",
        "readTime": "min. of reading",
        "by": "By",
        "readArticle": "Read Article"
    },}

async function handleHomeReq(request) {
    try {
        let res = await (await fetch(request)).clone().json()
        const articles = await getSavedArticles()
        const text = articles.map((art) => `
<div class="${"rounded-lg text-card-foreground shadow-md dark:shadow-lg gradient-"+art.scienceDataColor}">
    <div class="p-6">
        <div class="mb-2">
            <h3 class="text-xl font-semibold"><a href=${`/article/${art.slug.split('/')[2]}`} class="hover:text-primary">${art.articleTitle}</a></h3>
            <div class="flex items-center gap-2 text-sm mt-1">
                <span class="${"bg-principal-black bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full color-"+art.scienceDataColor}">${t[art.slug.split('/')[0]][art.scienceDataId]}</span>
                <span>${art.date}</span>
                <span>•</span>
                <span>${art.readTimeNum} ${t[art.slug.split('/')[0]]['readTime']}</span>
            </div>
        </div>
        <p class="text-muted-foreground mb-4 line-clamp-3">${art.articleDescription}</p>
        <div class="flex justify-between items-center">
            <div class="text-sm text-muted-foreground">${t[art.slug.split('/')[0]]['by']} ${art.authorData[0]}</div>
            <a href=${`/article/${art.slug.split('/')[2]}`}>
                <button type="button" class='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3'>
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                    </svg>
                    ${t[art.slug.split('/')[0]]['readArticle']}
                </button>
            </a>
        </div>
    </div>
</div>
`).join('')
        const modified = {
            ...res,
            savedArticles: text
        }
        return new Response(JSON.stringify(modified), {headers: { "Content-Type": "application/json" },})
    } catch (e) {
        try{
            return await fetch(request)
        } catch (e) {
            return new Response("Network error happened", {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            });
        }
    }
}

async function cacheFirst(request) {
    const url = new URL(request.url)
    const rp = getRealPath(url);
    let req
    if (urlsToCache.includes(url.pathname) || url.pathname.startsWith('/api/content/en/article') || url.pathname.startsWith('/api/content/es/article')) req = rp == url ? request : new Request(rp, {method: request.method, headers: request.headers, credentials: request.credentials, redirect: request.redirect, referrer: request.referrer, referrerPolicy: request.referrerPolicy,});
    else req = request;

    //Offline Home Articles Hander
    if(url.pathname.startsWith('/api/content/en/home') || url.pathname.startsWith('/api/content/es/home')) return await handleHomeReq(req);
    
    const cachedResponse = await caches.match(req);
    try {
        const networkResponse = await fetch(req);
        if (networkResponse.ok && cachedResponse) caches.open(CURRENT_CACHE).then(cache => cache.put(req, networkResponse.clone()));
        return networkResponse;
    } catch (error) {
        if (cachedResponse) {
            return cachedResponse;
        }
        //Offline Handler
        if(new URL(req.url).pathname == '/') {
            return new Response("Network error happened", {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            });
        }
        return new Response(await offlinePageHandler(), {
            status: 200,
            headers: {"Content-Type": "text/html"}
        })
    }
}

// === EVENTS ===
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CURRENT_CACHE).then(cache => cache.delete('/manifest.webmanifest')),
        caches.open(CURRENT_CACHE).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", event => {
    console.log(CURRENT_VERSION)
    event.respondWith(cacheFirst(event.request));
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        await migrateFromPreviousCache();
        if (self.clients && self.clients.claim) {
            await self.clients.claim();
        }
    })());
});

self.addEventListener("message", async (event) => {
    if (event.data?.type === "CACHE_ARTICLE") {
        const cache = await caches.open(CURRENT_CACHE);
        const url = event.data.url;
        const response = await fetch(url);
        await cache.put(url, response);
    }
});
