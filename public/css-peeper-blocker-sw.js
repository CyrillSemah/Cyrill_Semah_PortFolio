// Service Worker pour bloquer CSS Peeper
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

// Intercepter toutes les requêtes
self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  
  // Liste des patterns à bloquer
  const blockedPatterns = [
    'inspector.b9415ea5.js',
    'css-peeper',
    'csspeeper',
    'b9415'
  ];
  
  // Vérifier si l'URL contient un pattern bloqué
  const shouldBlock = blockedPatterns.some(pattern => url.includes(pattern));
  
  if (shouldBlock) {
    // Bloquer la requête en retournant une réponse vide
    event.respondWith(new Response('', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    }));
  }
});
