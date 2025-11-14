import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Footer, SEOHead, Breadcrumbs } from '@/components/layout';
import { FilterPanel, MobileFilterPanel } from '@/components/forms';
import { PropertyGrid } from '@/components/property';
import { Pagination, PaginationInfo } from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import { getProperties } from '@/lib/getProperties';
import { useFetch } from '@/hooks/useFetch';
import { useToggle } from '@/hooks/useToggle';
import { SORT_OPTIONS } from '@/utils/constants';

/**
 * Properties Listing Page
 * Browse all properties with filters and pagination
 */

export default function PropertiesPage({ initialProperties, initialPagination }) {
  const router = useRouter();
  const [mobileFiltersOpen, , , toggleMobileFilters] = useToggle(false);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Build query URL from filters
  const buildQueryUrl = (page = 1) => {
    const params = new URLSearchParams();
    params.append('page', page);
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    return `/properties?${params.toString()}`;
  };

  // Fetch properties with filters
  const { data, loading, refetch } = useFetch(
    buildQueryUrl(currentPage),
    {
      autoFetch: false,
    }
  );

  const properties = data?.properties || initialProperties || [];
  const pagination = data?.pagination || initialPagination || {};

  // Apply filters
  useEffect(() => {
    if (Object.keys(filters).length > 0 || currentPage > 1) {
      refetch(buildQueryUrl(currentPage));
    }
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHead
        title="Browse Properties"
        description="Explore our extensive collection of properties. Find apartments, houses, and commercial spaces that match your needs."
      />

      <Navbar />

      <main>
        {/* Page Header */}
        <section className="bg-neutral-100 border-b border-neutral-200">
          <div className="container py-8">
            <Breadcrumbs />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  Browse Properties
                </h1>
                <p className="text-neutral-600">
                  {pagination.total ? `${pagination.total.toLocaleString()} properties available` : 'Loading...'}
                </p>
              </div>

              {/* Sort & Filter Toggle */}
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                {/* Sort Dropdown */}
                <select
                  value={filters.sort || 'newest'}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={toggleMobileFilters}
                  className="md:hidden"
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  }
                >
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filters Sidebar */}
              <aside className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <FilterPanel
                    initialFilters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </aside>

              {/* Properties Grid */}
              <div className="flex-1">
                {loading ? (
                  <PropertyGrid loading={true} columns={3} />
                ) : (
                  <>
                    <PropertyGrid properties={properties} columns={3} />

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-12">
                        <PaginationInfo
                          currentPage={pagination.page}
                          totalPages={pagination.totalPages}
                          totalItems={pagination.total}
                          itemsPerPage={pagination.limit}
                        />
                        <Pagination
                          currentPage={pagination.page}
                          totalPages={pagination.totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Filters Modal */}
      <MobileFilterPanel
        isOpen={mobileFiltersOpen}
        onClose={toggleMobileFilters}
        initialFilters={filters}
        onFilterChange={handleFilterChange}
      />
    </>
  );
}

/**
 * Server-side data fetching
 */
export async function getServerSideProps(context) {
  const { query } = context;

  try {
    const result = await getProperties({
      page: query.page || 1,
      limit: query.limit || 12,
      type: query.type,
      status: query.status,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      bedrooms: query.bedrooms,
      bathrooms: query.bathrooms,
      location: query.location,
      sort: query.sort || 'newest',
    });

    return {
      props: {
        initialProperties: result.properties,
        initialPagination: result.pagination,
      },
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      props: {
        initialProperties: [],
        initialPagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
}
