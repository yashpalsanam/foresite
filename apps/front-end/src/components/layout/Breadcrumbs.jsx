import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

/**
 * Breadcrumbs Component
 * Dynamic breadcrumb navigation based on route
 */

const Breadcrumbs = ({ items, className = '' }) => {
  const router = useRouter();

  // Generate breadcrumbs from router if items not provided
  const breadcrumbs = items || generateBreadcrumbs(router.pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('py-4', className)}
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <svg
                  className="h-4 w-4 text-neutral-400 mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              
              {isLast ? (
                <span className="text-neutral-900 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * Generate breadcrumbs from pathname
 */
const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', path: '/' }];

  let currentPath = '';
  
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    
    // Format label (capitalize and replace hyphens)
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      path: currentPath,
    });
  });

  return breadcrumbs;
};

/**
 * Property Breadcrumbs
 * Specialized breadcrumbs for property pages
 */
export const PropertyBreadcrumbs = ({ property }) => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
  ];

  if (property) {
    breadcrumbs.push({
      label: property.title || 'Property Details',
      path: `/property/${property.id}`,
    });
  }

  return <Breadcrumbs items={breadcrumbs} />;
};

export default Breadcrumbs;
