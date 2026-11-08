// Service Worker para Math Universe (PWA)
// Diseñado con política anti-caché obsoleta: NETWORK-FIRST para que la web siempre esté al día.

const SW_VERSION = 'v1.0.0';
const CACHE_NAME = `math-universe-${SW_VERSION}`;

// 1. Instalación: forzar activación inmediata (no esperar a que se cierren pestañas antiguas)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Activación: reclamar control de clientes inmediatamente y purgar cualquier caché vieja
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. Estrategia de Fetch:
// Navegación / Páginas HTML -> NETWORK-FIRST ABSOLUTO
// Siempre consulta a la red primero. Si hay internet, el usuario SIEMPRE recibe el código más reciente.
// La caché se utiliza ÚNICAMENTE como red de seguridad si el dispositivo está sin conexión (offline).
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar peticiones no-GET o esquemas ajenos (chrome-extension, etc.)
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const isNavigation =
    request.mode === 'navigate' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Si falla la red (offline), servir desde caché
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Recursos estáticos (assets, fuentes, scripts, imágenes):
  // Network-first con refresco de caché para evitar bloquear actualizaciones de CSS/JS
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});

// Permitir mensaje directo para forzar skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
