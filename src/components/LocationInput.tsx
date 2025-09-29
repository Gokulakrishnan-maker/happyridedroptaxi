import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader, AlertCircle } from 'lucide-react';
import { loadGoogleMaps, isGoogleMapsLoaded } from '../utils/googleMapsLoader';

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
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        
        // Check if already loaded
        if (isGoogleMapsLoaded()) {
          setIsMapsLoaded(true);
          initializeAutocomplete();
          setIsLoading(false);
          return;
        }

        // Load Google Maps API
        await loadGoogleMaps();
        setIsMapsLoaded(true);
        initializeAutocomplete();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setLoadError('Failed to load location services');
        setIsMapsLoaded(false);
        setIsLoading(false);
      }
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        return;
      }

      try {
        // Clean up existing autocomplete
        if (autocompleteRef.current) {
          window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        }

        // Create new autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'IN' },
            fields: ['formatted_address', 'geometry', 'name', 'place_id']
          }
        );

        // Add place changed listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          
          if (place && place.formatted_address) {
            const coordinates = place.geometry?.location ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            } : undefined;

            onChange(place.formatted_address, coordinates);
          }
        });

      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
        setLoadError('Location autocomplete unavailable');
      }
    };

    initializeGoogleMaps();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
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
          className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}
        {loadError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-orange-500" title={loadError} />
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {loadError && (
        <p className="text-orange-600 text-xs mt-1">{loadError}</p>
      )}
      {!isMapsLoaded && !loadError && (
        <p className="text-gray-500 text-xs mt-1">Loading location suggestions...</p>
      )}
    </div>
  );
};

export default LocationInput;