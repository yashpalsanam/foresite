import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useSearch } from '@/hooks/useFetch';
import clsx from 'clsx';
import { DotsLoader } from '@/components/common/Loader';

/**
 * SearchBar Component
 * Property search with autocomplete suggestions
 */

const SearchBar = ({
  placeholder = 'Search properties by location, type, or keyword...',
  className = '',
  showFilters = false,
  onSearch,
}) => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useOnClickOutside(() => setIsFocused(false));

  const {
    query,
    setQuery,
    results,
    loading,
    clearSearch,
  } = useSearch('/properties/search', {
    debounceMs: 300,
    minLength: 2,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/properties?q=${encodeURIComponent(query)}`);
      }
      setIsFocused(false);
    }
  };

  const handleResultClick = (property) => {
    router.push(`/property/${property.id}`);
    clearSearch();
    setIsFocused(false);
  };

  const handleClear = () => {
    clearSearch();
    setIsFocused(false);
  };

  return (
    <div ref={searchRef} className={clsx('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={clsx(
            'w-full pl-12 pr-12 py-3 md:py-4 text-base border border-neutral-300 rounded-lg',
            'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            isFocused && 'shadow-lg'
          )}
        />

        {/* Clear/Loading */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <DotsLoader size="sm" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Search Button (Mobile) */}
        <button
          type="submit"
          className="md:hidden absolute right-12 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700"
          aria-label="Search"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>

      {/* Autocomplete Results */}
      {isFocused && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <DotsLoader />
            </div>
          ) : results && results.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">
                Search Results ({results.length})
              </p>
              {results.map((property) => (
                <button
                  key={property.id}
                  onClick={() => handleResultClick(property)}
                  className="w-full px-4 py-3 hover:bg-neutral-50 transition-colors text-left flex items-center space-x-3"
                >
                  {/* Property Image */}
                  {property.images && property.images[0] && (
                    <div className="flex-shrink-0">
                      <img
                        src={property.images[0].url || property.images[0]}
                        alt={property.title}
                        className="h-12 w-16 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {property.title}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {property.location?.city}, {property.location?.state}
                    </p>
                  </div>
                  
                  {/* Property Price */}
                  <div className="flex-shrink-0">
                    <p className="text-sm font-semibold text-primary-600">
                      ${property.price?.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
              
              {/* View All Results */}
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors border-t border-neutral-200"
              >
                View all results for "{query}"
              </button>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-neutral-500">
                No properties found for "{query}"
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Quick Filters (Optional) */}
      {showFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {['For Sale', 'For Rent', 'Apartments', 'Houses', 'Commercial'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setQuery(filter);
                handleSubmit({ preventDefault: () => {} });
              }}
              className="px-3 py-1 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
