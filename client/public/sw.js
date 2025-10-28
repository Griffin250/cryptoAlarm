// Service Worker for CryptoAlarm PWA
// Version: 2.0.0
// Features: Caching, Offline Support, Background Sync, Push Notifications

const CACHE_NAME = 'cryptoalarm-v2.0.0';
const DYNAMIC_CACHE = 'cryptoalarm-dynamic-v2.0.0';
const API_CACHE = 'cryptoalarm-api-v2.0.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/cryptoAlarmLogo.png',
  '/cryptoAlarmIcon.png',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/humans.txt',
  '/404.html',
  // Crypto icons
  '/cryptoIcons/BTC.png',
  '/cryptoIcons/ETH.png',
  '/cryptoIcons/BNB.png',
  '/cryptoIcons/SOL.png',
  '/cryptoIcons/XRP.png',
  '/cryptoIcons/ADA.png',
  '/cryptoIcons/DOGE.png',
  '/cryptoIcons/SHIB.png',
  '/cryptoIcons/USDC.png'
];

// API endpoints to cache with different strategies
const API_ENDPOINTS = [
  'https://cryptoalarm.onrender.com/api/cryptocurrencies',
  'https://api.binance.com/api/v3/ticker/24hr'
];

// Network-first cache strategy for dynamic content
const NETWORK_FIRST = [
  '/dashboard',
  '/portfolio',
  '/alerts',
  '/api/'
];

// Cache-first strategy for static assets
const CACHE_FIRST = [
  '/assets/',
  '/cryptoIcons/',
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.ico',
  '.woff',
  '.woff2'
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.0.0');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2.0.0');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // API requests - Network first with API cache
  if (url.pathname.startsWith('/api/') || API_ENDPOINTS.some(endpoint => request.url.includes(endpoint))) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Static assets - Cache first
  if (CACHE_FIRST.some(pattern => request.url.includes(pattern))) {
    event.respondWith(handleCacheFirst(request));
    return;
  }
  
  // Dynamic content - Network first
  if (NETWORK_FIRST.some(pattern => request.url.includes(pattern))) {
    event.respondWith(handleNetworkFirst(request));
    return;
  }
  
  // Default strategy - Stale while revalidate
  event.respondWith(handleStaleWhileRevalidate(request));
});

// Cache-first strategy for static assets
async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Cached new asset:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first failed:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Network-first strategy for dynamic content
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Updated dynamic cache:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/404.html');
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// API request handling with special caching
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      // Only cache API responses for short time (5 minutes)
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
      
      // Clean old API cache entries after 5 minutes
      setTimeout(() => {
        cache.delete(request);
      }, 5 * 60 * 1000);
      
      console.log('[SW] API response cached temporarily:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] API network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Add a header to indicate this is cached data
      const headers = new Headers(cachedResponse.headers);
      headers.append('X-Served-From', 'cache');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: headers
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'API not available offline',
      cached: false 
    }), { 
      status: 503, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale-while-revalidate for general content
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    console.log('[SW] Network failed for:', request.url);
  });
  
  return cachedResponse || fetchPromise || caches.match('/404.html');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'background-sync-alerts') {
    event.waitUntil(syncAlerts());
  }
  
  if (event.tag === 'background-sync-portfolio') {
    event.waitUntil(syncPortfolio());
  }
});

// Sync alerts when back online
async function syncAlerts() {
  try {
    console.log('[SW] Syncing alerts in background');
    // This would sync any pending alert changes
    // Implementation depends on your specific offline storage strategy
  } catch (error) {
    console.error('[SW] Failed to sync alerts:', error);
  }
}

// Sync portfolio when back online
async function syncPortfolio() {
  try {
    console.log('[SW] Syncing portfolio in background');
    // This would sync any pending portfolio changes
  } catch (error) {
    console.error('[SW] Failed to sync portfolio:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Your crypto alert has been triggered!',
    icon: '/cryptoAlarmLogo.png',
    badge: '/cryptoAlarmIcon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/cryptoAlarmLogo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/cryptoAlarmLogo.png'
      }
    ],
    tag: 'crypto-alert',
    requireInteraction: true
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification('CryptoAlarm Alert!', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker v2.0.0 loaded successfully');