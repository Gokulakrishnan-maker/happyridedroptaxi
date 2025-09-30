import { useState, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DistanceResult {
  distance: number; // in kilometers
  duration: string; // formatted duration
  error?: string;
}

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDistance = useCallback(async (
    origin: Coordinates,
    destination: Coordinates
  ): Promise<DistanceResult> => {
    setIsCalculating(true);

    try {
      if (!window.google?.maps) {
        setIsCalculating(false);
        throw new Error('Google Maps API not available');
      }

      const service = new window.google.maps.DistanceMatrixService();
      
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          setIsCalculating(false);
          reject(new Error('Distance calculation timeout'));
        }, 10000);

        service.getDistanceMatrix({
          origins: [new window.google.maps.LatLng(origin.lat, origin.lng)],
          destinations: [new window.google.maps.LatLng(destination.lat, destination.lng)],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          clearTimeout(timeoutId);
          setIsCalculating(false);

          if (status === window.google.maps.DistanceMatrixStatus.OK && response) {
            const element = response.rows[0]?.elements[0];
            
            if (element?.status === 'OK') {
              const distanceInMeters = element.distance?.value || 0;
              const distanceInKm = Math.round(distanceInMeters / 1000);
              const duration = element.duration?.text || 'Unknown';

              resolve({
                distance: distanceInKm,
                duration: duration
              });
            } else {
              reject(new Error('Could not calculate distance between locations'));
            }
          } else {
            reject(new Error('Distance calculation service unavailable'));
          }
        });
      });
    } catch (error) {
      setIsCalculating(false);
      throw error;
    }
  }, []);

  // Fallback distance calculation using Haversine formula
  const calculateHaversineDistance = useCallback((
    origin: Coordinates,
    destination: Coordinates
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance);
  }, []);

  return {
    calculateDistance,
    calculateHaversineDistance,
    isCalculating
  };
};