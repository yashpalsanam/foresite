import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, PAGINATION } from '@/utils/constants';

/**
 * Property Context
 * Manages property filters, favorites, and selected property state
 */

const PropertyContext = createContext(undefined);

export const PropertyProvider = ({ children }) => {
  // Favorites (stored in localStorage)
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);

  // Recent searches (stored in localStorage)
  const [recentSearches, setRecentSearches] = useLocalStorage(
    STORAGE_KEYS.RECENT_SEARCHES,
    []
  );

  // Selected property (current viewing)
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Property filters
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    status: '',
    priceMin: null,
    priceMax: null,
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    location: '',
    sortBy: 'newest',
  });

  // Pagination
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [limit] = useState(PAGINATION.DEFAULT_LIMIT);

  /**
   * Add property to favorites
   */
  const addToFavorites = useCallback(
    (propertyId) => {
      if (!favorites.includes(propertyId)) {
        setFavorites([...favorites, propertyId]);
      }
    },
    [favorites, setFavorites]
  );

  /**
   * Remove property from favorites
   */
  const removeFromFavorites = useCallback(
    (propertyId) => {
      setFavorites(favorites.filter((id) => id !== propertyId));
    },
    [favorites, setFavorites]
  );

  /**
   * Toggle property in favorites
   */
  const toggleFavorite = useCallback(
    (propertyId) => {
      if (favorites.includes(propertyId)) {
        removeFromFavorites(propertyId);
      } else {
        addToFavorites(propertyId);
      }
    },
    [favorites, addToFavorites, removeFromFavorites]
  );

  /**
   * Check if property is in favorites
   */
  const isFavorite = useCallback(
    (propertyId) => {
      return favorites.includes(propertyId);
    },
    [favorites]
  );

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  /**
   * Update single filter
   */
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  }, []);

  /**
   * Reset filters to default
   */
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      propertyType: '',
      status: '',
      priceMin: null,
      priceMax: null,
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      location: '',
      sortBy: 'newest',
    });
    setPage(1);
  }, []);

  /**
   * Add search to recent searches
   */
  const addRecentSearch = useCallback(
    (searchTerm) => {
      if (!searchTerm || searchTerm.trim() === '') return;

      const trimmedSearch = searchTerm.trim();

      // Remove if already exists
      const filtered = recentSearches.filter((s) => s !== trimmedSearch);

      // Add to beginning and limit to 10
      const updated = [trimmedSearch, ...filtered].slice(0, 10);

      setRecentSearches(updated);
    },
    [recentSearches, setRecentSearches]
  );

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  /**
   * Remove specific recent search
   */
  const removeRecentSearch = useCallback(
    (searchTerm) => {
      setRecentSearches(recentSearches.filter((s) => s !== searchTerm));
    },
    [recentSearches, setRecentSearches]
  );

  /**
   * Check if filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.propertyType !== '' ||
      filters.status !== '' ||
      filters.priceMin !== null ||
      filters.priceMax !== null ||
      filters.bedrooms !== '' ||
      filters.bathrooms !== '' ||
      filters.amenities.length > 0 ||
      filters.location !== ''
    );
  }, [filters]);

  /**
   * Get active filter count
   */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.propertyType) count++;
    if (filters.status) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.location) count++;
    return count;
  }, [filters]);

  /**
   * Build query string from filters
   */
  const getQueryString = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.propertyType) params.append('type', filters.propertyType);
    if (filters.status) params.append('status', filters.status);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
    if (filters.location) params.append('location', filters.location);
    if (filters.sortBy) params.append('sort', filters.sortBy);
    if (filters.amenities.length > 0) {
      params.append('amenities', filters.amenities.join(','));
    }

    params.append('page', page);
    params.append('limit', limit);

    return params.toString();
  }, [filters, page, limit]);

  const value = {
    // Favorites
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,

    // Recent searches
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,

    // Selected property
    selectedProperty,
    setSelectedProperty,

    // Filters
    filters,
    updateFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    getQueryString,

    // Pagination
    page,
    setPage,
    limit,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

/**
 * Hook to use property context
 * @returns {object} Property context value
 */
export const useProperty = () => {
  const context = useContext(PropertyContext);

  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }

  return context;
};

export default PropertyContext;
