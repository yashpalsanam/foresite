import React from 'react';
import PropertyCard from './PropertyCard';
import { Skeleton } from '@/components/common/Loader';
import { useFetch } from '@/hooks/useFetch';
import clsx from 'clsx';

/**
 * SimilarProperties Component
 * Display similar properties based on current property
 */

const SimilarProperties = ({ propertyId, className = '' }) => {
  const { data, loading, error } = useFetch(
    propertyId ? `/properties/${propertyId}/similar?limit=4` : null,
    {
      autoFetch: !!propertyId,
    }
  );

  const properties = data?.data || data || [];

  if (error || (!loading && properties.length === 0)) {
    return null;
  }

  return (
    <div className={clsx('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">
          Similar Properties
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SimilarPropertySkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Similar Property Skeleton
 */
const SimilarPropertySkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between pt-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  );
};

/**
 * Featured Properties Component
 * Display featured properties (alternative to similar)
 */
export const FeaturedProperties = ({ limit = 4, className = '' }) => {
  const { data, loading } = useFetch(`/properties/featured?limit=${limit}`);

  const properties = data?.data || data || [];

  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <div className={clsx('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">
          Featured Properties
        </h2>
        <a
          href="/properties?featured=true"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <SimilarPropertySkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} priority />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarProperties;
