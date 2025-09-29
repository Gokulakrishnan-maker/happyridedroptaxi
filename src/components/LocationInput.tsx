import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, Loader, X, Navigation } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder: string;
  error?: string;
  icon?: React.ReactNode;
}

interface Suggestion {
  description: string;
  place_id?: string;
  coordinates?: { lat: number; lng: number };
  isPopular?: boolean;
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
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);

  // Popular destinations for instant suggestions
  const popularLocations: Suggestion[] = [
    { description: 'Chennai Central Railway Station, Chennai', coordinates: { lat: 13.0836, lng: 80.2753 }, isPopular: true },
    { description: 'Chennai Airport, Chennai', coordinates: { lat: 12.9941, lng: 80.1709 }, isPopular: true },
    { description: 'Pondicherry, Puducherry', coordinates: { lat: 11.9416, lng: 79.8083 }, isPopular: true },
    { description: 'Bangalore, Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 }, isPopular: true },
    { description: 'Madurai, Tamil Nadu', coordinates: { lat: 9.9252, lng: 78.1198 }, isPopular: true },
    { description: 'Coimbatore, Tamil Nadu', coordinates: { lat: 11.0168, lng: 76.9558 }, isPopular: true },
    { description: 'Tirupati, Andhra Pradesh', coordinates: { lat: 13.6288, lng: 79.4192 }, isPopular: true },
    { description: 'Kanyakumari, Tamil Nadu', coordinates: { lat: 8.0883, lng: 77.5385 }, isPopular: true },
    { description: 'Ooty, Tamil Nadu', coordinates: { lat: 11.4064, lng: 76.6932 }, isPopular: true },
    { description: 'Kodaikanal, Tamil Nadu', coordinates: { lat: 10.2381, lng: 77.4892 }, isPopular: true }
  ];

  // Debounced search function
  const debounceTimeout = useRef<NodeJS.Timeout>();
  
  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const initializeGoogleMaps = () => {
      if (window.google?.maps?.places) {
        setIsGoogleMapsReady(true);
        
        // Create session token for better performance
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        
        // Initialize places service
        const mapDiv = document.createElement('div');
        const map = new window.google.maps.Map(mapDiv);
        placesServiceRef.current = new window.google.maps.places.PlacesService(map);
        
        return;
      }
      
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval);
          setIsGoogleMapsReady(true);
          
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
          const mapDiv = document.createElement('div');
          const map = new window.google.maps.Map(mapDiv);
          placesServiceRef.current = new window.google.maps.places.PlacesService(map);
        }
      }, 100);
      
      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    };

    initializeGoogleMaps();
    
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Perform search with both popular and Google Places
  const performSearch = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    const allSuggestions: Suggestion[] = [];

    try {
      // First, add matching popular locations
      const popularMatches = popularLocations.filter(location =>
        location.description.toLowerCase().includes(query.toLowerCase())
      );
      allSuggestions.push(...popularMatches.slice(0, 3));

      // Then, search Google Places if available
      if (isGoogleMapsReady && window.google?.maps?.places) {
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        
        const request = {
          input: query,
          componentRestrictions: { country: 'IN' },
          types: ['geocode'],
          sessionToken: sessionTokenRef.current,
        };

        autocompleteService.getPlacePredictions(request, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const googleSuggestions = predictions.slice(0, 5).map(prediction => ({
              description: prediction.description,
              place_id: prediction.place_id,
              isPopular: false
            }));
            
            // Combine and deduplicate
            const combined = [...allSuggestions, ...googleSuggestions];
            const unique = combined.filter((item, index, self) => 
              index === self.findIndex(t => t.description === item.description)
            );
            
            setSuggestions(unique.slice(0, 8));
            setShowSuggestions(true);
          } else {
            // Fallback to popular locations only
            setSuggestions(allSuggestions);
            setShowSuggestions(allSuggestions.length > 0);
          }
          setIsLoading(false);
        });
      } else {
        // Use only popular locations if Google Maps not ready
        setSuggestions(allSuggestions);
        setShowSuggestions(allSuggestions.length > 0);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length >= 2) {
      debouncedSearch(newValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setIsLoading(true);
    
    if (suggestion.coordinates) {
      // Use pre-defined coordinates
      onChange(suggestion.description, suggestion.coordinates);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    // Get coordinates from Google Places
    if (suggestion.place_id && placesServiceRef.current) {
      const request = {
        placeId: suggestion.place_id,
        fields: ['geometry', 'formatted_address'],
        sessionToken: sessionTokenRef.current,
      };

      placesServiceRef.current.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const coordinates = place.geometry?.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          } : undefined;

          onChange(place.formatted_address || suggestion.description, coordinates);
          
          // Create new session token for next search
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        } else {
          onChange(suggestion.description);
        }
        
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
      });
    } else {
      onChange(suggestion.description);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (value.length >= 2) {
      debouncedSearch(value);
    } else if (value.length === 0) {
      // Show popular locations when focused with empty input
      setSuggestions(popularLocations.slice(0, 5));
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow click
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
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
          onBlur={handleBlur}
          className={`w-full px-4 py-3 pr-20 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          autoComplete="off"
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
          </div>
        )}
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-yellow-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center"
            >
              <div className="flex items-center flex-1">
                {suggestion.isPopular ? (
                  <Navigation className="w-4 h-4 text-yellow-600 mr-3 flex-shrink-0" />
                ) : (
                  <MapPin className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.description}
                  </div>
                  {suggestion.isPopular && (
                    <div className="text-xs text-yellow-600 font-semibold">
                      Popular destination
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
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