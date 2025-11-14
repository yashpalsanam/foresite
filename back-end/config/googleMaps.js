import axios from 'axios';
import { logger } from './logger.js';
import { cacheGet, cacheSet } from './redis.js';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export const geocodeAddress = async (address) => {
  try {
    const cacheKey = `geocode:${address}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      logger.info('Geocode cache hit:', address);
      return cached;
    }

    const response = await axios.get(GEOCODE_BASE_URL, {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }

    const result = response.data.results[0];
    const location = {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
    };

    await cacheSet(cacheKey, location, 86400);
    
    logger.info('Geocoded address:', address);
    return location;
  } catch (error) {
    logger.error('Geocoding error:', error.message);
    throw error;
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const cacheKey = `reverse:${lat},${lng}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      logger.info('Reverse geocode cache hit:', cacheKey);
      return cached;
    }

    const response = await axios.get(GEOCODE_BASE_URL, {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Reverse geocoding failed: ${response.data.status}`);
    }

    const result = response.data.results[0];
    const address = {
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
      components: result.address_components,
    };

    await cacheSet(cacheKey, address, 86400);
    
    logger.info('Reverse geocoded coordinates:', lat, lng);
    return address;
  } catch (error) {
    logger.error('Reverse geocoding error:', error.message);
    throw error;
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Place details failed: ${response.data.status}`);
    }

    return response.data.result;
  } catch (error) {
    logger.error('Place details error:', error.message);
    throw error;
  }
};
