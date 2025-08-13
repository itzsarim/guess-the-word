// PWA Service Worker Registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Add cache busting and proper MIME type handling
      const swUrl = `/sw.js?v=${Date.now()}`;
      
      // Check if service worker file exists and has correct MIME type
      try {
        const response = await fetch(swUrl, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('text/html')) {
          console.warn('Service worker has incorrect MIME type, skipping registration');
          return null;
        }
      } catch (fetchError) {
        console.warn('Could not check service worker MIME type:', fetchError);
      }
      
      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('SW registered: ', registration);
      
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
    } catch (error) {
      console.log('SW registration failed: ', error);
      
      // Fallback: try to register with different approach
      if (error.name === 'SecurityError' || error.message.includes('MIME type')) {
        console.log('Attempting fallback service worker registration...');
        try {
          const fallbackRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none'
          });
          console.log('Fallback SW registered: ', fallbackRegistration);
          return fallbackRegistration;
        } catch (fallbackError) {
          console.log('Fallback SW registration also failed: ', fallbackError);
        }
      }
    }
  }
  return null;
};

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
