import React from 'react';
import clsx from 'clsx';

/**
 * Loader Component
 * Loading spinner with different sizes and variants
 */

const Loader = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const variants = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-neutral-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const spinnerClasses = clsx(
    'animate-spin rounded-full',
    sizes[size],
    variants[variant]
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <div className={spinnerClasses} />
          {text && (
            <p className="mt-4 text-neutral-700 font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="text-center">
        <div className={spinnerClasses} />
        {text && (
          <p className="mt-2 text-sm text-neutral-600">{text}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for content placeholders
 */
export const Skeleton = ({ className = '', variant = 'rectangle' }) => {
  const baseClasses = 'animate-pulse bg-neutral-200 rounded';
  
  const variants = {
    rectangle: 'w-full h-4',
    circle: 'rounded-full',
    text: 'w-3/4 h-4',
  };

  return (
    <div className={clsx(baseClasses, variants[variant], className)} />
  );
};

/**
 * Dots Loader
 */
export const DotsLoader = ({ size = 'md', className = '' }) => {
  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  return (
    <div className={clsx('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full bg-primary-600 animate-bounce',
            dotSizes[size]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Loader;
