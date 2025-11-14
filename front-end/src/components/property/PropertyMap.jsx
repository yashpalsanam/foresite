import React, { useEffect, useRef } from 'react';
import { MAPS_CONFIG } from '@/utils/constants';
import clsx from 'clsx';

/**
 * PropertyMap Component
 * Display property location on Google Maps
 */

const PropertyMap = ({ location, className = '' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !location) return;

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!window.google || !window.google.maps) return;

      const coordinates = {
        lat: location.latitude || location.lat || MAPS_CONFIG.DEFAULT_CENTER.lat,
        lng: location.longitude || location.lng || MAPS_CONFIG.DEFAULT_CENTER.lng,
      };

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: location.latitude ? 15 : MAPS_CONFIG.DEFAULT_ZOOM,
        styles: MAPS_CONFIG.STYLES,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Add marker
      new window.google.maps.Marker({
        position: coordinates,
        map: map,
        title: location.address || 'Property Location',
        animation: window.google.maps.Animation.DROP,
      });

      mapInstanceRef.current = map;
    };

    loadGoogleMapsScript();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  if (!location) {
    return (
      <div className={clsx('bg-neutral-100 rounded-lg p-8 text-center', className)}>
        <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="mt-2 text-sm text-neutral-600">Location information not available</p>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-900">Location</h3>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            location.address || `${location.latitude},${location.longitude}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
        >
          <span>View on Google Maps</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Address */}
      {location.address && (
        <div className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-lg">
          <svg className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-neutral-900">{location.address}</p>
            <p className="text-sm text-neutral-600">
              {location.city && `${location.city}, `}
              {location.state && `${location.state} `}
              {location.zipCode}
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-96 rounded-lg overflow-hidden border border-neutral-200"
      />

      {/* Nearby Places (Optional) */}
      {location.nearbyPlaces && location.nearbyPlaces.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-neutral-900">Nearby</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {location.nearbyPlaces.map((place, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm text-neutral-600"
              >
                <span>{place.icon || '📍'}</span>
                <span>{place.name}</span>
                <span className="text-neutral-400">• {place.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Simple Static Map (Alternative without Google Maps API)
 */
export const StaticMap = ({ location, className = '' }) => {
  if (!location || !MAPS_CONFIG.API_KEY) {
    return null;
  }

  const { latitude, longitude } = location;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&markers=color:red%7C${latitude},${longitude}&key=${MAPS_CONFIG.API_KEY}`;

  return (
    <div className={clsx('rounded-lg overflow-hidden', className)}>
      <img
        src={mapUrl}
        alt="Property location map"
        className="w-full h-auto"
      />
    </div>
  );
};

export default PropertyMap;
