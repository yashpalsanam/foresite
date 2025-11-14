import React, { useMemo } from 'react';
import PropertyCard from './PropertyCard';
import { Skeleton } from '@/components/common/Loader';
import clsx from 'clsx';

/**
 * PropertyGrid Component
 * Grid layout for displaying property cards
 * Enhanced with robust data validation
 */

const PropertyGrid = ({ 
  properties = [], 
  loading = false, 
  columns = 3,
  className = '' 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  // Enhanced validation to handle various data structures
  const validatedProperties = useMemo(() => {
    // Handle null/undefined
    if (!properties) {
      console.warn('PropertyGrid: properties is null/undefined');
      return [];
    }

    // Already an array - perfect!
    if (Array.isArray(properties)) {
      return properties;
    }

    // Handle common API response patterns
    // Pattern 1: { properties: [...] }
    if (properties.properties && Array.isArray(properties.properties)) {
      console.log('PropertyGrid: extracted from properties.properties');
      return properties.properties;
    }

    // Pattern 2: { data: [...] }
    if (properties.data && Array.isArray(properties.data)) {
      console.log('PropertyGrid: extracted from properties.data');
      return properties.data;
    }

    // Pattern 3: { data: { properties: [...] } }
    if (properties.data?.properties && Array.isArray(properties.data.properties)) {
      console.log('PropertyGrid: extracted from properties.data.properties');
      return properties.data.properties;
    }

    // If we get here, we have an unexpected structure
    console.error('PropertyGrid: Unexpected properties structure:', properties);
    return [];
  }, [properties]);

  if (loading) {
    return (
      <div className={clsx('grid gap-6', gridCols[columns], className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!validatedProperties || validatedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-neutral-900">No properties found</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('grid gap-6', gridCols[columns], className)}>
      {validatedProperties.map((property, index) => (
        <PropertyCard 
          key={property.id || property._id || index} 
          property={property}
          priority={index < 3} // Prioritize first 3 images
        />
      ))}
    </div>
  );
};

/**
 * Property Card Skeleton Loader
 */
const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between pt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default PropertyGrid;