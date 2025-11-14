import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PropertyStatusBadge, FeaturedBadge } from '@/components/common/Badge';
import { formatPrice, formatArea } from '@/utils/formatPrice';
import { useFavorites } from '@/context/FavoritesContext';
import { getCardImageUrl } from '@/utils/cloudinary';
import clsx from 'clsx';

/**
 * PropertyCard Component
 * Display property in card format for listings
 */

const PropertyCard = ({ property, className = '', priority = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isPropertyFavorite = isFavorite(property.id);

  const {
    id,
    title,
    price,
    images,
    bedrooms,
    bathrooms,
    area,
    location,
    type,
    status,
    featured,
  } = property;

  const primaryImage = images && images.length > 0 
    ? (images[0].url || images[0])
    : '/images/property-placeholder.jpg';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx('group', className)}
    >
      <Link href={`/property/${id}`}>
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-56 overflow-hidden bg-neutral-100">
            <Image
              src={primaryImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <PropertyStatusBadge status={status} />
              {featured && <FeaturedBadge />}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={clsx(
                'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all',
                isPropertyFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-neutral-700 hover:bg-white'
              )}
              aria-label={isPropertyFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                className="h-5 w-5"
                fill={isPropertyFavorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Image Count */}
            {images && images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{images.length}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Price */}
            <div className="mb-2">
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(price)}
              </p>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>

            {/* Location */}
            <p className="text-sm text-neutral-600 mb-3 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">
                {location?.city}, {location?.state}
              </span>
            </p>

            {/* Property Details */}
            <div className="flex items-center justify-between text-sm text-neutral-600 pt-3 border-t border-neutral-200 mt-auto">
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{bedrooms} bed</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>{bathrooms} bath</span>
              </div>
              
              {area && (
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{formatArea(area)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
