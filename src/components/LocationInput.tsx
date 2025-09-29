import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder: string;
  error?: string;
  icon?: React.ReactNode;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon = <MapPin className="inline w-4 h-4 mr-2" />
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        return;
      }

      try {
        // Create autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'IN' }, // Restrict to India
            fields: ['formatted_address', 'geometry', 'name', 'place_id']
          }
        );

        // Add place changed listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();

          if (place && place.formatted_address) {
            const coordinates = place.geometry?.location
              ? {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }
              : undefined;

            onChange(place.formatted_address, coordinates);
          } else {
            console.warn('Google Autocomplete: no place data returned');
          }

          // ✅ Always stop spinner
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
        setIsLoading(false);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      initializeAutocomplete();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkGoogleMaps);
          initializeAutocomplete();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogleMaps), 10000);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [onChange]);

  // 🔹 Input handler with fallback timeout
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length > 2) {
      setIsLoading(true);

      // ✅ Auto-hide spinner if nothing comes back
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    setIsLoading(false);
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
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationInput;
