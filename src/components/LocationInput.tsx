import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader, AlertCircle } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder: string;
  error?: string;
  icon?: React.ReactNode;
  id: string; // Make ID required
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon = <MapPin className="inline w-4 h-4 mr-2" />,
  id
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const preventUpdateRef = useRef(false);
  const lastValueRef = useRef<string>('');

  // Initialize autocomplete
  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        setInitError('Google Maps Places API not available');
        return;
      }

      try {
        // Clear any existing autocomplete for this specific input
        if (autocompleteRef.current) {
          window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        }

        // Create new autocomplete instance with unique session token
        const sessionToken = new window.google.maps.places.AutocompleteSessionToken();
        
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'IN' },
            fields: ['formatted_address', 'geometry', 'name', 'place_id'],
            sessionToken: sessionToken,
            bounds: new window.google.maps.LatLngBounds(
              new window.google.maps.LatLng(8.0, 77.0),
              new window.google.maps.LatLng(37.0, 97.0)
            ),
            strictBounds: false
          }
        );

        // Add place changed listener with proper isolation
        const placeChangedListener = () => {
          if (preventUpdateRef.current) return;
          
          const place = autocompleteRef.current?.getPlace();
          
          if (place && place.formatted_address) {
            preventUpdateRef.current = true;
            
            const coordinates = place.geometry?.location ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            } : undefined;

            // Update the last value reference
            lastValueRef.current = place.formatted_address;
            
            // Call onChange with new value
            onChange(place.formatted_address, coordinates);
            setIsLoading(false);
            
            // Reset prevention flag after a delay
            setTimeout(() => {
              preventUpdateRef.current = false;
            }, 100);
          }
        };
        
        autocompleteRef.current.addListener('place_changed', placeChangedListener);

        setIsInitialized(true);
        setInitError(null);

      } catch (error) {
        console.error(`Error initializing autocomplete for ${id}:`, error);
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
        setTimeout(checkAndInitialize, 500);
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
      preventUpdateRef.current = false;
    };
  }, [id]); // Only depend on id

  // Sync external value changes with input (but prevent interference)
  useEffect(() => {
    if (inputRef.current && !preventUpdateRef.current && value !== lastValueRef.current) {
      inputRef.current.value = value;
      lastValueRef.current = value;
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (preventUpdateRef.current) return;
    
    const newValue = e.target.value;
    lastValueRef.current = newValue;
    onChange(newValue);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Show loading state for longer inputs
    if (newValue.length > 2 && isInitialized) {
      debounceTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, 300);
    } else {
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    if (preventUpdateRef.current) return;
    
    setIsLoading(false);
    
    // Pre-warm the autocomplete service
    if (autocompleteRef.current && !value && window.google?.maps?.places) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({
        input: '',
        componentRestrictions: { country: 'IN' },
        types: ['geocode']
      }, () => {
        // Just warming up the service
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsLoading(false);
    }
  };

  const handleBlur = () => {
    // Small delay to allow autocomplete selection to complete
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
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
          defaultValue={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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