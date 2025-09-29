// Simple Google Maps loader without external dependencies
let isLoaded = false;
let loadPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = (): Promise<typeof google> => {
  if (isLoaded && window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps) {
      isLoaded = true;
      resolve(window.google);
      return;
    }

    // Create callback function
    const callbackName = 'initGoogleMaps';
    (window as any)[callbackName] = () => {
      isLoaded = true;
      loadPromise = null;
      resolve(window.google);
      // Clean up callback
      delete (window as any)[callbackName];
    };

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists but callback might not have fired yet
      const checkLoaded = () => {
        if (window.google?.maps) {
          isLoaded = true;
          resolve(window.google);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaJzuU17R8&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      loadPromise = null;
      delete (window as any)[callbackName];
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && !!window.google?.maps?.places;
};