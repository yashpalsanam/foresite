import { geocodeAddress as geocode, reverseGeocode } from '../config/googleMaps.js';
import { logger } from '../config/logger.js';

export const geocodeAddress = async (address) => {
  try {
    return await geocode(address);
  } catch (error) {
    logger.error('Geocoding failed:', error.message);
    throw error;
  }
};

export const reverseGeocodeCoordinates = async (lat, lng) => {
  try {
    return await reverseGeocode(lat, lng);
  } catch (error) {
    logger.error('Reverse geocoding failed:', error.message);
    throw error;
  }
};

export const formatAddress = (addressComponents) => {
  const address = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  };

  addressComponents.forEach(component => {
    if (component.types.includes('street_number')) {
      address.street = component.long_name + ' ';
    }
    if (component.types.includes('route')) {
      address.street += component.long_name;
    }
    if (component.types.includes('locality')) {
      address.city = component.long_name;
    }
    if (component.types.includes('administrative_area_level_1')) {
      address.state = component.short_name;
    }
    if (component.types.includes('postal_code')) {
      address.zipCode = component.long_name;
    }
    if (component.types.includes('country')) {
      address.country = component.long_name;
    }
  });

  return address;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
