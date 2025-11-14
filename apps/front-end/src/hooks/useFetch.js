import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/utils/apiClient';
import { parseApiError } from '@/utils/handleError';

/**
 * Custom hook for data fetching
 * Handles loading, error states, and data caching
 * 
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {object} { data, loading, error, refetch, cancel }
 */
export const useFetch = (url, options = {}) => {
  const {
    method = 'get',
    body = null,
    autoFetch = true,
    dependencies = [],
    onSuccess,
    onError,
    transformData,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  /**
   * Fetch data from API
   */
  const fetchData = useCallback(async (customUrl = url, customBody = body) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      let response;
      const config = { signal: abortControllerRef.current.signal };

      switch (method.toLowerCase()) {
        case 'post':
          response = await api.post(customUrl, customBody, config);
          break;
        case 'put':
          response = await api.put(customUrl, customBody, config);
          break;
        case 'patch':
          response = await api.patch(customUrl, customBody, config);
          break;
        case 'delete':
          response = await api.delete(customUrl, config);
          break;
        default:
          response = await api.get(customUrl, config);
      }

      if (isMountedRef.current) {
        // Transform data if transformer provided
        const transformedData = transformData ? transformData(response) : response;
        setData(transformedData);
        setLoading(false);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(transformedData);
        }
      }

      return transformedData;
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }

      if (isMountedRef.current) {
        const parsedError = parseApiError(err);
        setError(parsedError);
        setLoading(false);

        // Call error callback if provided
        if (onError) {
          onError(parsedError);
        }
      }

      throw err;
    }
  }, [url, method, body, transformData, onSuccess, onError]);

  /**
   * Refetch data manually
   */
  const refetch = useCallback((customUrl, customBody) => {
    return fetchData(customUrl, customBody);
  }, [fetchData]);

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Auto-fetch on mount and dependency changes
   */
  useEffect(() => {
    if (autoFetch && url) {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
      cancel();
    };
  }, [url, autoFetch, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    cancel,
  };
};

/**
 * Hook for paginated data fetching
 * @param {string} url - API endpoint URL
 * @param {object} options - Pagination options
 * @returns {object} Pagination state and controls
 */
export const usePaginatedFetch = (url, options = {}) => {
  const {
    initialPage = 1,
    limit = 12,
    dependencies = [],
  } = options;

  const [page, setPage] = useState(initialPage);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const paginatedUrl = `${url}?page=${page}&limit=${limit}`;

  const { data, loading, error, refetch } = useFetch(paginatedUrl, {
    dependencies: [page, ...dependencies],
    onSuccess: (response) => {
      const newData = response?.data || response || [];
      
      if (page === 1) {
        setAllData(newData);
      } else {
        setAllData(prev => [...prev, ...newData]);
      }

      // Check if there's more data
      const total = response?.total || response?.pagination?.total;
      if (total) {
        setHasMore(allData.length + newData.length < total);
      } else {
        setHasMore(newData.length === limit);
      }
    },
  });

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setAllData([]);
    setHasMore(true);
  }, [initialPage]);

  return {
    data: allData,
    loading,
    error,
    page,
    hasMore,
    loadMore,
    reset,
    refetch,
  };
};

/**
 * Hook for infinite scroll data fetching
 * @param {string} url - API endpoint URL
 * @param {object} options - Options
 * @returns {object} Infinite scroll state
 */
export const useInfiniteScroll = (url, options = {}) => {
  const {
    initialPage = 1,
    limit = 12,
    threshold = 0.8,
  } = options;

  const pagination = usePaginatedFetch(url, { initialPage, limit });
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (pagination.loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasMore) {
          pagination.loadMore();
        }
      }, {
        threshold,
      });

      if (node) observerRef.current.observe(node);
    },
    [pagination.loading, pagination.hasMore, pagination.loadMore, threshold]
  );

  return {
    ...pagination,
    lastElementRef,
  };
};

/**
 * Hook for search with debounce
 * @param {string} url - API endpoint URL
 * @param {object} options - Search options
 * @returns {object} Search state and controls
 */
export const useSearch = (url, options = {}) => {
  const {
    debounceMs = 500,
    minLength = 2,
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutRef = useRef(null);

  // Debounce query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs]);

  // Fetch results
  const searchUrl = debouncedQuery.length >= minLength
    ? `${url}?q=${encodeURIComponent(debouncedQuery)}`
    : null;

  const { data, loading, error, refetch } = useFetch(searchUrl, {
    autoFetch: !!searchUrl,
    dependencies: [debouncedQuery],
  });

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    results: data,
    loading: query !== debouncedQuery || loading,
    error,
    clearSearch,
    refetch,
  };
};

/**
 * Hook for lazy loading data
 * @param {Function} fetcher - Function that returns a promise
 * @returns {object} Lazy load state and trigger
 */
export const useLazyFetch = (fetcher) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setCalled(true);

    try {
      const result = await fetcher(...args);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      setLoading(false);
      throw parsedError;
    }
  }, [fetcher]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setCalled(false);
  }, []);

  return {
    data,
    loading,
    error,
    called,
    execute,
    reset,
  };
};

export default useFetch;
