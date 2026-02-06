// Service Worker - Chrome extension xatoligini hal qilish uchun
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Chrome extension URL larini ignore qilish
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Faqat HTTP/HTTPS so'rovlarni handle qilish
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Agar response valid bo'lsa, qaytarish
          if (response && response.ok) {
            return response;
          }
          // Aks holda, cache dan qaytarish
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || response;
          });
        })
        .catch(() => {
          // Network xatoligi bo'lsa, cache dan qaytarish
          return caches.match(event.request).then(cachedResponse => {
            // Agar cache da ham yo'q bo'lsa, empty response qaytarish
            return cachedResponse || new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        })
    );
  }
});