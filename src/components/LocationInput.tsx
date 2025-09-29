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
    // Chennai & Surroundings
    { description: 'Chennai Central Railway Station, Chennai', coordinates: { lat: 13.0836, lng: 80.2753 }, isPopular: true },
    { description: 'Chennai Airport (MAA), Chennai', coordinates: { lat: 12.9941, lng: 80.1709 }, isPopular: true },
    { description: 'T. Nagar, Chennai', coordinates: { lat: 13.0418, lng: 80.2341 }, isPopular: true },
    { description: 'Anna Nagar, Chennai', coordinates: { lat: 13.0850, lng: 80.2101 }, isPopular: true },
    { description: 'Velachery, Chennai', coordinates: { lat: 12.9750, lng: 80.2200 }, isPopular: true },
    { description: 'Tambaram, Chennai', coordinates: { lat: 12.9249, lng: 80.1000 }, isPopular: true },
    { description: 'Adyar, Chennai', coordinates: { lat: 13.0067, lng: 80.2206 }, isPopular: true },
    { description: 'Mylapore, Chennai', coordinates: { lat: 13.0339, lng: 80.2619 }, isPopular: true },
    { description: 'Guindy, Chennai', coordinates: { lat: 13.0067, lng: 80.2206 }, isPopular: true },
    { description: 'Porur, Chennai', coordinates: { lat: 13.0382, lng: 80.1564 }, isPopular: true },
    
    // Tamil Nadu Major Cities
    { description: 'Madurai, Tamil Nadu', coordinates: { lat: 9.9252, lng: 78.1198 }, isPopular: true },
    { description: 'Coimbatore, Tamil Nadu', coordinates: { lat: 11.0168, lng: 76.9558 }, isPopular: true },
    { description: 'Trichy (Tiruchirappalli), Tamil Nadu', coordinates: { lat: 10.7905, lng: 78.7047 }, isPopular: true },
    { description: 'Salem, Tamil Nadu', coordinates: { lat: 11.6643, lng: 78.1460 }, isPopular: true },
    { description: 'Tirunelveli, Tamil Nadu', coordinates: { lat: 8.7139, lng: 77.7567 }, isPopular: true },
    { description: 'Erode, Tamil Nadu', coordinates: { lat: 11.3410, lng: 77.7172 }, isPopular: true },
    { description: 'Vellore, Tamil Nadu', coordinates: { lat: 12.9165, lng: 79.1325 }, isPopular: true },
    { description: 'Thoothukudi (Tuticorin), Tamil Nadu', coordinates: { lat: 8.7642, lng: 78.1348 }, isPopular: true },
    { description: 'Dindigul, Tamil Nadu', coordinates: { lat: 10.3673, lng: 77.9803 }, isPopular: true },
    { description: 'Thanjavur, Tamil Nadu', coordinates: { lat: 10.7870, lng: 79.1378 }, isPopular: true },
    { description: 'Karur, Tamil Nadu', coordinates: { lat: 10.9601, lng: 78.0766 }, isPopular: true },
    { description: 'Sivakasi, Tamil Nadu', coordinates: { lat: 9.4530, lng: 77.7900 }, isPopular: true },
    { description: 'Kumbakonam, Tamil Nadu', coordinates: { lat: 10.9601, lng: 79.3788 }, isPopular: true },
    { description: 'Pollachi, Tamil Nadu', coordinates: { lat: 10.6581, lng: 77.0081 }, isPopular: true },
    { description: 'Hosur, Tamil Nadu', coordinates: { lat: 12.7409, lng: 77.8253 }, isPopular: true },
    
    // Hill Stations
    { description: 'Ooty (Udhagamandalam), Tamil Nadu', coordinates: { lat: 11.4064, lng: 76.6932 }, isPopular: true },
    { description: 'Kodaikanal, Tamil Nadu', coordinates: { lat: 10.2381, lng: 77.4892 }, isPopular: true },
    { description: 'Coonoor, Tamil Nadu', coordinates: { lat: 11.3667, lng: 76.8000 }, isPopular: true },
    { description: 'Kotagiri, Tamil Nadu', coordinates: { lat: 11.4200, lng: 76.8600 }, isPopular: true },
    { description: 'Yercaud, Tamil Nadu', coordinates: { lat: 11.7753, lng: 78.2186 }, isPopular: true },
    
    // Pilgrimage & Tourist Places
    { description: 'Rameswaram, Tamil Nadu', coordinates: { lat: 9.2876, lng: 79.3129 }, isPopular: true },
    { description: 'Kanyakumari, Tamil Nadu', coordinates: { lat: 8.0883, lng: 77.5385 }, isPopular: true },
    { description: 'Tirupati, Andhra Pradesh', coordinates: { lat: 13.6288, lng: 79.4192 }, isPopular: true },
    { description: 'Tiruttani, Tamil Nadu', coordinates: { lat: 13.1667, lng: 79.3167 }, isPopular: true },
    { description: 'Palani, Tamil Nadu', coordinates: { lat: 10.4500, lng: 77.5167 }, isPopular: true },
    { description: 'Chidambaram, Tamil Nadu', coordinates: { lat: 11.3994, lng: 79.6947 }, isPopular: true },
    { description: 'Kumbakonam, Tamil Nadu', coordinates: { lat: 10.9601, lng: 79.3788 }, isPopular: true },
    { description: 'Srirangam, Tamil Nadu', coordinates: { lat: 10.8597, lng: 78.6900 }, isPopular: true },
    { description: 'Tiruchendur, Tamil Nadu', coordinates: { lat: 8.4953, lng: 78.1206 }, isPopular: true },
    { description: 'Velankanni, Tamil Nadu', coordinates: { lat: 10.6833, lng: 79.8333 }, isPopular: true },
    
    // Puducherry
    { description: 'Pondicherry (Puducherry)', coordinates: { lat: 11.9416, lng: 79.8083 }, isPopular: true },
    { description: 'Auroville, Puducherry', coordinates: { lat: 12.0067, lng: 79.8100 }, isPopular: true },
    
    // Karnataka
    { description: 'Bangalore (Bengaluru), Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 }, isPopular: true },
    { description: 'Mysore (Mysuru), Karnataka', coordinates: { lat: 12.2958, lng: 76.6394 }, isPopular: true },
    { description: 'Bangalore Airport (KIA), Karnataka', coordinates: { lat: 13.1986, lng: 77.7066 }, isPopular: true },
    { description: 'Electronic City, Bangalore', coordinates: { lat: 12.8456, lng: 77.6603 }, isPopular: true },
    { description: 'Whitefield, Bangalore', coordinates: { lat: 12.9698, lng: 77.7500 }, isPopular: true },
    { description: 'Koramangala, Bangalore', coordinates: { lat: 12.9279, lng: 77.6271 }, isPopular: true },
    { description: 'Indiranagar, Bangalore', coordinates: { lat: 12.9719, lng: 77.6412 }, isPopular: true },
    { description: 'Jayanagar, Bangalore', coordinates: { lat: 12.9279, lng: 77.5937 }, isPopular: true },
    { description: 'BTM Layout, Bangalore', coordinates: { lat: 12.9165, lng: 77.6101 }, isPopular: true },
    { description: 'HSR Layout, Bangalore', coordinates: { lat: 12.9082, lng: 77.6476 }, isPopular: true },
    
    // Kerala
    { description: 'Kochi (Cochin), Kerala', coordinates: { lat: 9.9312, lng: 76.2673 }, isPopular: true },
    { description: 'Thiruvananthapuram (Trivandrum), Kerala', coordinates: { lat: 8.5241, lng: 76.9366 }, isPopular: true },
    { description: 'Munnar, Kerala', coordinates: { lat: 10.0889, lng: 77.0595 }, isPopular: true },
    { description: 'Alleppey (Alappuzha), Kerala', coordinates: { lat: 9.4981, lng: 76.3388 }, isPopular: true },
    { description: 'Thekkady, Kerala', coordinates: { lat: 9.5939, lng: 77.1583 }, isPopular: true },
    { description: 'Wayanad, Kerala', coordinates: { lat: 11.6854, lng: 76.1320 }, isPopular: true },
    { description: 'Kovalam, Kerala', coordinates: { lat: 8.4004, lng: 76.9784 }, isPopular: true },
    { description: 'Kumarakom, Kerala', coordinates: { lat: 9.6178, lng: 76.4298 }, isPopular: true },
    
    // Andhra Pradesh
    { description: 'Hyderabad, Telangana', coordinates: { lat: 17.3850, lng: 78.4867 }, isPopular: true },
    { description: 'Vijayawada, Andhra Pradesh', coordinates: { lat: 16.5062, lng: 80.6480 }, isPopular: true },
    { description: 'Visakhapatnam, Andhra Pradesh', coordinates: { lat: 17.6868, lng: 83.2185 }, isPopular: true },
    { description: 'Guntur, Andhra Pradesh', coordinates: { lat: 16.3067, lng: 80.4365 }, isPopular: true },
    { description: 'Nellore, Andhra Pradesh', coordinates: { lat: 14.4426, lng: 79.9865 }, isPopular: true },
    { description: 'Chittoor, Andhra Pradesh', coordinates: { lat: 13.2172, lng: 79.1003 }, isPopular: true },
    
    // Major Airports
    { description: 'Chennai Airport (MAA)', coordinates: { lat: 12.9941, lng: 80.1709 }, isPopular: true },
    { description: 'Bangalore Airport (KIA)', coordinates: { lat: 13.1986, lng: 77.7066 }, isPopular: true },
    { description: 'Coimbatore Airport (CJB)', coordinates: { lat: 11.0297, lng: 77.0434 }, isPopular: true },
    { description: 'Madurai Airport (IXM)', coordinates: { lat: 9.8349, lng: 78.0934 }, isPopular: true },
    { description: 'Trichy Airport (TRZ)', coordinates: { lat: 10.7654, lng: 78.7097 }, isPopular: true },
    { description: 'Kochi Airport (COK)', coordinates: { lat: 10.1520, lng: 76.4019 }, isPopular: true },
    { description: 'Hyderabad Airport (HYD)', coordinates: { lat: 17.2403, lng: 78.4294 }, isPopular: true },
    
    // Railway Stations
    { description: 'Chennai Central Railway Station', coordinates: { lat: 13.0836, lng: 80.2753 }, isPopular: true },
    { description: 'Chennai Egmore Railway Station', coordinates: { lat: 13.0732, lng: 80.2609 }, isPopular: true },
    { description: 'Bangalore City Railway Station', coordinates: { lat: 12.9767, lng: 77.5993 }, isPopular: true },
    { description: 'Coimbatore Junction', coordinates: { lat: 11.0015, lng: 76.9553 }, isPopular: true },
    { description: 'Madurai Junction', coordinates: { lat: 9.9197, lng: 78.1194 }, isPopular: true },
    
    // Bus Stands
    { description: 'CMBT (Chennai Mofussil Bus Terminus)', coordinates: { lat: 13.0732, lng: 80.2609 }, isPopular: true },
    { description: 'Koyambedu Bus Stand, Chennai', coordinates: { lat: 13.0732, lng: 80.1963 }, isPopular: true },
    { description: 'Majestic Bus Stand, Bangalore', coordinates: { lat: 12.9767, lng: 77.5733 }, isPopular: true },
    { description: 'Gandhipuram Bus Stand, Coimbatore', coordinates: { lat: 11.0168, lng: 76.9558 }, isPopular: true },
    
    // IT Parks & Corporate Areas
    { description: 'OMR (Old Mahabalipuram Road), Chennai', coordinates: { lat: 12.8956, lng: 80.2267 }, isPopular: true },
    { description: 'Siruseri IT Park, Chennai', coordinates: { lat: 12.8229, lng: 80.2267 }, isPopular: true },
    { description: 'Tidel Park, Chennai', coordinates: { lat: 13.0067, lng: 80.2206 }, isPopular: true },
    { description: 'DLF IT Park, Chennai', coordinates: { lat: 12.8956, lng: 80.2267 }, isPopular: true },
    { description: 'Electronic City, Bangalore', coordinates: { lat: 12.8456, lng: 77.6603 }, isPopular: true },
    { description: 'Whitefield IT Park, Bangalore', coordinates: { lat: 12.9698, lng: 77.7500 }, isPopular: true },
    { description: 'Manyata Tech Park, Bangalore', coordinates: { lat: 13.0389, lng: 77.6197 }, isPopular: true },
    { description: 'Bagmane Tech Park, Bangalore', coordinates: { lat: 12.9698, lng: 77.7500 }, isPopular: true },
    
    // Hospitals
    { description: 'Apollo Hospital, Chennai', coordinates: { lat: 13.0067, lng: 80.2206 }, isPopular: true },
    { description: 'Fortis Malar Hospital, Chennai', coordinates: { lat: 13.0067, lng: 80.2206 }, isPopular: true },
    { description: 'AIIMS, Delhi', coordinates: { lat: 28.5672, lng: 77.2100 }, isPopular: true },
    { description: 'Manipal Hospital, Bangalore', coordinates: { lat: 12.9716, lng: 77.5946 }, isPopular: true },
    
    // Educational Institutions
    { description: 'IIT Madras, Chennai', coordinates: { lat: 12.9915, lng: 80.2337 }, isPopular: true },
    { description: 'Anna University, Chennai', coordinates: { lat: 13.0067, lng: 80.2206 }, isPopular: true },
    { description: 'IISc Bangalore', coordinates: { lat: 13.0218, lng: 77.5671 }, isPopular: true },
    { description: 'VIT Vellore', coordinates: { lat: 12.9165, lng: 79.1325 }, isPopular: true },
    
    // Shopping Malls
    { description: 'Express Avenue Mall, Chennai', coordinates: { lat: 13.0732, lng: 80.2609 }, isPopular: true },
    { description: 'Phoenix MarketCity, Chennai', coordinates: { lat: 12.9750, lng: 80.2200 }, isPopular: true },
    { description: 'Forum Mall, Bangalore', coordinates: { lat: 12.9698, lng: 77.6412 }, isPopular: true },
    { description: 'UB City Mall, Bangalore', coordinates: { lat: 12.9716, lng: 77.5946 }, isPopular: true }
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