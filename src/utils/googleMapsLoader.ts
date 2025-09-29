import { Loader } from '@googlemaps/js-api-loader';

// Single instance of Google Maps loader for the entire application
const loader = new Loader({
  apiKey: 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaJzuU17R8', // Replace with your actual API key
  version: 'weekly',
  libraries: ['places']
});

let isLoaded = false;
let loadPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = (): Promise<typeof google> => {
  if (isLoaded && window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = loader.load().then((google) => {
    isLoaded = true;
    return google;
  }).catch((error) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
};

export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && !!window.google?.maps?.places;
};