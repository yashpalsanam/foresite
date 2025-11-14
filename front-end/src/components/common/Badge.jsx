import React from 'react';
import clsx from 'clsx';

/**
 * Badge Component
 * Display status, labels, or categories
 */

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  rounded = false,
}) => {
  const baseClasses = 'inline-flex items-center font-medium';

  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    'for-sale': 'bg-green-100 text-green-800',
    'for-rent': 'bg-blue-100 text-blue-800',
    sold: 'bg-neutral-400 text-white',
    featured: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    rounded ? 'rounded-full' : 'rounded',
    className
  );

  return (
    <span className={classes}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

/**
 * Property Status Badge
 */
export const PropertyStatusBadge = ({ status }) => {
  const statusConfig = {
    'for-sale': { label: 'For Sale', variant: 'for-sale' },
    'for-rent': { label: 'For Rent', variant: 'for-rent' },
    'sold': { label: 'Sold', variant: 'sold' },
    'rented': { label: 'Rented', variant: 'sold' },
    'pending': { label: 'Pending', variant: 'warning' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={config.variant} rounded>
      {config.label}
    </Badge>
  );
};

/**
 * Featured Badge
 */
export const FeaturedBadge = () => {
  return (
    <Badge variant="featured" rounded icon="⭐">
      Featured
    </Badge>
  );
};

/**
 * New Badge
 */
export const NewBadge = () => {
  return (
    <Badge variant="success" rounded>
      New
    </Badge>
  );
};

export default Badge;
