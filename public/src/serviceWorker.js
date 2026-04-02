/**
 * 🔄 serviceWorker.js
 * Офлайн режим и кэширование
 */

const CACHE_NAME = 'eco-tracker-v4'; // увеличила версию для обновления кэша

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
  '/src/main.js',
  '/src/styles/reset.css',
  '/src/styles/variables.css',
  '/src/styles/main.css',
  '/src/core/router.js',
  '/src/core/uiContainer.js',
  '/src/core/dataService.js',
  '/src/core/storageService.js',
  '/src/core/authService.js'
];

// Установка — кэширую статику
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Активация — удаляю старые кэши
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('🗑️ Removing old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Не кэширую запросы к API
  if (event.request.url.includes('/api')) {
    return;
  }
  
  // Не кэширую аналитику
  if (event.request.url.includes('/analytics')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          return cached;
        }
        
        return fetch(event.request)
          .then(response => {
            // Кэширую только успешные ответы
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Если нет сети и это запрос страницы — показываю offline.html
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Для запросов модулей — возвращаю ошибку
            return new Response('Network error', { status: 408 });
          });
      })
  );
});