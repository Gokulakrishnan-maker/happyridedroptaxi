import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader, AlertCircle } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder: string;
  error?: string;
  icon?: React.ReactNode;
  id?: string; // Add unique identifier
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon = <MapPin className="inline w-4 h-4 mr-2" />,
  id = Math.random().toString(36).substr(2, 9) // Generate unique ID if not provided
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false); // Prevent recursive updates

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        setInitError('Google Maps Places API not available');
        return;
      }

      try {
        // Clear any existing autocomplete
        if (autocompleteRef.current) {
          window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        }

        // Create autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'IN' }, // Restrict to India
            fields: ['formatted_address', 'geometry', 'name', 'place_id'],
            // Optimize for faster results
            bounds: new window.google.maps.LatLngBounds(
              new window.google.maps.LatLng(8.0, 77.0), // Southwest India
              new window.google.maps.LatLng(37.0, 97.0)  // Northeast India
            ),
            strictBounds: false
          }
        );

        // Set session token for better performance
        const sessionToken = new window.google.maps.places.AutocompleteSessionToken();
        autocompleteRef.current.setOptions({ sessionToken });

        // Add place changed listener
        const placeChangedListener = () => {
          if (isUpdatingRef.current) return; // Prevent recursive calls
          
          const place = autocompleteRef.current?.getPlace();
          
          if (place && place.formatted_address) {
            isUpdatingRef.current = true;
            const coordinates = place.geometry?.location ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            } : undefined;

            onChange(place.formatted_address, coordinates);
            setIsLoading(false);
            
            // Reset the flag after a short delay
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 100);
          }
        };
        
        autocompleteRef.current.addListener('place_changed', placeChangedListener);

        setIsInitialized(true);
        setInitError(null);

      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
        setInitError('Failed to initialize location search');
        setIsInitialized(false);
      }
    };

    let retryCount = 0;
    const maxRetries = 10;
    
    const checkAndInitialize = () => {
      if (window.google?.maps?.places) {
        initializeAutocomplete();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkAndInitialize, 500); // Check every 500ms
      } else {
        setInitError('Google Maps failed to load after multiple attempts');
      }
    };

    checkAndInitialize();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      isUpdatingRef.current = false;
    };
  }, [onChange, id]); // Add id to dependencies

  // Sync external value changes with input
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value && !isUpdatingRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingRef.current) return; // Prevent interference
    
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the loading state
    if (newValue.length > 2 && isInitialized) {
      debounceTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, 300); // Show loading after 300ms of typing
    } else {
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    if (isUpdatingRef.current) return;
    
    setIsLoading(false);
    // Pre-warm the autocomplete service
    if (autocompleteRef.current && !value && window.google?.maps?.places) {
      // Trigger a small bounds search to warm up the service
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({
        input: '',
        componentRestrictions: { country: 'IN' },
        types: ['geocode']
      }, () => {
        // Just warming up the service, ignore results
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear loading on escape
    if (e.key === 'Escape') {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={`location-input-${id}`}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
            error || initError ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          autoComplete="off"
          disabled={!isInitialized && !initError}
        />
        {isLoading && isInitialized && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
          </div>
        )}
        {!isInitialized && !initError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
        {initError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>
      {(error || initError) && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {error || initError}
        </p>
      )}
      {!isInitialized && !initError && (
        <p className="text-gray-500 text-sm mt-1 flex items-center">
          <Loader className="w-4 h-4 mr-1 animate-spin" />
          Initializing location search...
        </p>
      )}
    </div>
  );
};

export default LocationInput;