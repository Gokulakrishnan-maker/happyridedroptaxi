import { useEffect, useState } from 'react';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
    _googleMapsApiLoadedPromise?: Promise<void>;
    _googleMapsApiLoading?: boolean;
  }
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState('Initializing...');

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if loading is already in progress
    if (window._googleMapsApiLoadedPromise) {
      setLoadingProgress('Loading in progress...');
      window._googleMapsApiLoadedPromise
        .then(() => setIsLoaded(true))
        .catch((err) => setError(`Google Maps failed to load: ${err.message}`));
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      return;
    }

    // Set loading flag
    window._googleMapsApiLoading = true;
    setLoadingProgress('Connecting to Google Maps...');

    // Create a global promise to manage loading
    window._googleMapsApiLoadedPromise = new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Google Maps API loading timeout'));
      }, 15000); // 15 second timeout

      // Global callback function
      window.initGoogleMaps = () => {
        clearTimeout(timeoutId);
        setLoadingProgress('Initializing Places API...');
        
        // Wait a bit for Places API to be fully ready
        setTimeout(() => {
          window._googleMapsApiLoading = false;
          setIsLoaded(true);
          resolve();
        }, 500);
      };

      setLoadingProgress('Loading Google Maps API...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&loading=async`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        clearTimeout(timeoutId);
        window._googleMapsApiLoading = false;
        reject(new Error('Failed to load Google Maps'));
      };

      script.onload = () => {
        setLoadingProgress('Google Maps script loaded...');
      };

      document.head.appendChild(script);
    });

    // Wait for the promise to resolve
    window._googleMapsApiLoadedPromise
      .then(() => setIsLoaded(true))
      .catch((err) => {
        setError(`Failed to load Google Maps: ${err.message}`);
        window._googleMapsApiLoading = false;
      });
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg max-w-md mx-auto">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <h3 className="text-red-800 font-semibold">Google Maps Error</h3>
        </div>
        <p className="text-red-700 mb-3">{error}</p>
        <div className="bg-red-100 p-3 rounded border-l-4 border-red-400">
          <p className="text-sm text-red-600">
            <strong>Troubleshooting:</strong>
          </p>
          <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
            <li>Check your internet connection</li>
            <li>Verify API key in .env file</li>
            <li>Ensure Places API is enabled</li>
            <li>Check API key restrictions</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200 border-t-yellow-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-yellow-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Google Maps</h3>
        <p className="text-gray-600 text-center mb-4">{loadingProgress}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-yellow-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-3 text-center">
          This may take a few moments on first load
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;