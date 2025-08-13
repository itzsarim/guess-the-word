import React, { useState, useEffect } from 'react';

const PWADebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        serviceWorker: 'serviceWorker' in navigator,
        standalone: window.navigator.standalone,
        displayMode: window.matchMedia('(display-mode: standalone)').matches,
        beforeInstallPrompt: 'BeforeInstallPromptEvent' in window,
        manifest: !!document.querySelector('link[rel="manifest"]'),
        icons: !!document.querySelector('link[rel="apple-touch-icon"]'),
      };

      // Check service worker registration
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          info.swRegistered = !!registration;
          info.swActive = !!(registration && registration.active);
          info.swState = registration?.active?.state || 'none';
        } catch (error) {
          info.swError = error.message;
        }
      }

      // Check manifest
      try {
        const manifestResponse = await fetch('/manifest.json');
        info.manifestAccessible = manifestResponse.ok;
        info.manifestContentType = manifestResponse.headers.get('content-type');
      } catch (error) {
        info.manifestError = error.message;
      }

      // Check service worker file
      try {
        const swResponse = await fetch('/sw.js');
        info.swAccessible = swResponse.ok;
        info.swContentType = swResponse.headers.get('content-type');
      } catch (error) {
        info.swError = error.message;
      }

      setDebugInfo(info);
    };

    gatherDebugInfo();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs opacity-50 hover:opacity-100 transition-opacity"
      >
        PWA Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">PWA Debug Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="border-b border-gray-700 pb-1">
            <span className="text-gray-400">{key}:</span>
            <span className={`ml-2 ${
              typeof value === 'boolean' 
                ? value ? 'text-green-400' : 'text-red-400'
                : 'text-white'
            }`}>
              {String(value)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Reload
        </button>
        <button
          onClick={() => navigator.serviceWorker?.getRegistrations().then(regs => regs.forEach(r => r.unregister()))}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs ml-2"
        >
          Clear SW
        </button>
      </div>
    </div>
  );
};

export default PWADebug;
