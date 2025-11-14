import React from 'react';
import clsx from 'clsx';

/**
 * PropertyFeatures Component
 * Display property amenities and features
 */

const PropertyFeatures = ({ amenities = [], features = [], className = '' }) => {
  const allFeatures = [...amenities, ...features];

  if (allFeatures.length === 0) {
    return null;
  }

  // Icon mapping for common features
  const featureIcons = {
    parking: '🅿️',
    pool: '🏊',
    gym: '💪',
    garden: '🌳',
    security: '🔒',
    elevator: '🛗',
    balcony: '🪟',
    ac: '❄️',
    heating: '🔥',
    furnished: '🛋️',
    pet_friendly: '🐕',
    wifi: '📶',
    fireplace: '🔥',
    garage: '🚗',
    laundry: '🧺',
    dishwasher: '🍽️',
    microwave: '🔆',
    hardwood: '🪵',
    carpet: '🟫',
    tile: '⬜',
  };

  const getFeatureIcon = (feature) => {
    const key = feature.toLowerCase().replace(/\s+/g, '_');
    return featureIcons[key] || '✓';
  };

  return (
    <div className={clsx('space-y-4', className)}>
      <h3 className="text-xl font-semibold text-neutral-900">
        Features & Amenities
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allFeatures.map((feature, index) => {
          const featureName = typeof feature === 'string' ? feature : feature.name || feature.label;
          const featureValue = typeof feature === 'object' ? feature.value : null;
          
          return (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <span className="text-2xl">{getFeatureIcon(featureName)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900 capitalize">
                  {featureName.replace(/_/g, ' ')}
                </p>
                {featureValue && (
                  <p className="text-xs text-neutral-600">{featureValue}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Property Specifications Component
 * Display detailed property specs
 */
export const PropertySpecs = ({ property, className = '' }) => {
  const specs = [
    { label: 'Property Type', value: property.type, icon: '🏠' },
    { label: 'Bedrooms', value: property.bedrooms, icon: '🛏️' },
    { label: 'Bathrooms', value: property.bathrooms, icon: '🚿' },
    { label: 'Area', value: `${property.area?.toLocaleString()} sq ft`, icon: '📐' },
    { label: 'Year Built', value: property.yearBuilt, icon: '📅' },
    { label: 'Lot Size', value: property.lotSize ? `${property.lotSize.toLocaleString()} sq ft` : null, icon: '🌍' },
    { label: 'Floors', value: property.floors, icon: '🏢' },
    { label: 'HOA Fee', value: property.hoaFee ? `$${property.hoaFee}/month` : null, icon: '💰' },
  ].filter(spec => spec.value);

  return (
    <div className={clsx('space-y-4', className)}>
      <h3 className="text-xl font-semibold text-neutral-900">
        Property Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{spec.icon}</span>
              <span className="text-sm text-neutral-600">{spec.label}</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFeatures;
