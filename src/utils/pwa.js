// PWA Service Worker Registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      console.log('Attempting to register service worker...');
      
      // Try multiple approaches to register the service worker
      const registration = await tryServiceWorkerRegistration();
      
      if (registration) {
        console.log('SW registered successfully: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        });
        
        return registration;
      } else {
        console.log('No service worker registration strategy succeeded');
      }
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  } else {
    console.log('Service worker not supported in this browser');
  }
  return null;
};

// Try multiple registration strategies
async function tryServiceWorkerRegistration() {
  const strategies = [
    // Strategy 1: Try inline service worker (embedded in HTML)
    async () => {
      return await registerInlineServiceWorker();
    },
    
    // Strategy 2: Direct registration with cache busting
    async () => {
      const swUrl = `/sw.js?v=${Date.now()}`;
      return await navigator.serviceWorker.register(swUrl, {
        scope: '/',
        updateViaCache: 'none'
      });
    },
    
    // Strategy 3: Try without cache busting
    async () => {
      return await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
    },
    
    // Strategy 4: Try with minimal options
    async () => {
      return await navigator.serviceWorker.register('/sw.js');
    }
  ];

  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Trying service worker registration strategy ${i + 1}...`);
      const registration = await strategies[i]();
      console.log(`Strategy ${i + 1} succeeded!`);
      return registration;
    } catch (error) {
      console.log(`Strategy ${i + 1} failed:`, error.message);
      
      // If it's a MIME type error, try the next strategy
      if (error.name === 'SecurityError' || error.message.includes('MIME type')) {
        continue;
      }
      
      // For other errors, try the next strategy
      continue;
    }
  }
  
  console.log('All service worker registration strategies failed');
  return null;
}

// Register inline service worker to avoid MIME type issues
async function registerInlineServiceWorker() {
  try {
    // Create a blob URL with the service worker code
    const swCode = `
      const CACHE_NAME = 'dumb-charades-v3';
      const urlsToCache = ['/', '/index.html', '/manifest.json'];
      
      self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then((cache) => {
              console.log('Opened cache');
              return cache.addAll(urlsToCache);
            })
        );
      });
      
      self.addEventListener('fetch', (event) => {
        const { request } = event;
        const url = new URL(request.url);
        
        // Skip caching for problematic paths
        if (url.pathname.startsWith('/sw.js') || url.pathname.startsWith('/src/') || url.pathname.startsWith('/public/')) {
          event.respondWith(fetch(request));
          return;
        }
        
        // Only cache GET requests
        if (request.method !== 'GET') {
          event.respondWith(fetch(request));
          return;
        }
        
        event.respondWith(
          caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              
              return fetch(request).then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
                
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseToCache);
                  });
                
                return response;
              });
            })
            .catch(() => {
              if (request.destination === 'document') {
                return caches.match('/index.html');
              }
              return new Response('Network error', { status: 503 });
            })
        );
      });
      
      self.addEventListener('activate', (event) => {
        event.waitUntil(
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                  console.log('Deleting old cache:', cacheName);
                  return caches.delete(cacheName);
                }
              })
            );
          })
        );
      });
    `;
    
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/'
    });
    
    // Clean up the blob URL
    URL.revokeObjectURL(swUrl);
    
    return registration;
  } catch (error) {
    console.log('Inline service worker registration failed:', error);
    throw error;
  }
}

// Show update notification
const showUpdateNotification = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // You can implement a custom update notification here
    console.log('New version available!');
    
    // Optionally reload the page to get the new version
    // window.location.reload();
  }
};

// Check if app is installed
export const isAppInstalled = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

// Check if app can be installed
export const canInstallApp = () => {
  return 'BeforeInstallPromptEvent' in window;
};

// Get PWA installation prompt
export const getInstallPrompt = () => {
  return new Promise((resolve) => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      resolve(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt, { once: true });
    
    // Cleanup after 5 seconds if no prompt
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      resolve(null);
    }, 5000);
  });
};

// Install PWA
export const installPWA = async () => {
  const prompt = await getInstallPrompt();
  if (prompt) {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    return outcome === 'accepted';
  }
  return false;
};

// Add to home screen instructions for iOS
export const showIOSInstallInstructions = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone;
  
  if (isIOS && !isStandalone) {
    return {
      show: true,
      instructions: [
        'Tap the Share button',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install'
      ]
    };
  }
  
  return { show: false };
};
