import { useEffect, useState } from 'react';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
    _googleMapsApiLoadedPromise?: Promise<void>;
  }
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if loading is already in progress
    if (window._googleMapsApiLoadedPromise) {
      window._googleMapsApiLoadedPromise
        .then(() => setIsLoaded(true))
        .catch(() => setError('Google Maps failed to load'));
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDliN_7olCSHuyWpsu05NhRQ5BI98aIngM';
    
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Create a global promise to manage loading
    window._googleMapsApiLoadedPromise = new Promise<void>((resolve, reject) => {
      // Global callback function
      window.initGoogleMaps = () => {
        resolve();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps'));
      };

      document.head.appendChild(script);
    });

    // Wait for the promise to resolve
    window._googleMapsApiLoadedPromise
      .then(() => setIsLoaded(true))
      .catch(() => setError('Failed to load Google Maps'));
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">
          <strong>Google Maps Error:</strong> {error}
        </p>
        <p className="text-sm text-red-600 mt-1">
          Please check your API key configuration in the .env file
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        <span className="ml-2 text-gray-600">Loading Google Maps...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;