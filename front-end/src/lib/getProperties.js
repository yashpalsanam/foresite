import { API_CONFIG } from '@/utils/constants';

/**
 * Safely extract properties array from various API response structures
 */
const extractPropertiesArray = (data) => {
  if (!data) {
    console.warn('extractPropertiesArray: data is null/undefined');
    return [];
  }

  // Direct array
  if (Array.isArray(data)) {
    return data;
  }

  // Common response patterns
  const possibleKeys = ['data', 'properties', 'results', 'items'];
  
  for (const key of possibleKeys) {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
      // Handle nested structure like { data: { properties: [...] } }
      if (typeof data[key] === 'object') {
        const nested = extractPropertiesArray(data[key]);
        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }

  console.warn('extractPropertiesArray: Could not find properties array in:', data);
  return [];
};

/**
 * Fetch properties from API (Server-Side)
 * Used in getServerSideProps or getStaticProps
 * 
 * @param {object} params - Query parameters
 * @returns {Promise<object>} Properties data
 */
export const getProperties = async (params = {}) => {
  const {
    page = 1,
    limit = 12,
    type,
    status,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    location,
    amenities,
    sort = 'newest',
  } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  
  if (type) queryParams.append('type', type);
  if (status) queryParams.append('status', status);
  if (minPrice) queryParams.append('minPrice', minPrice);
  if (maxPrice) queryParams.append('maxPrice', maxPrice);
  if (bedrooms) queryParams.append('bedrooms', bedrooms);
  if (bathrooms) queryParams.append('bathrooms', bathrooms);
  if (location) queryParams.append('location', location);
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
    amenitiesArray.forEach(amenity => queryParams.append('amenities', amenity));
  }
  if (sort) queryParams.append('sort', sort);

  const url = `${API_CONFIG.BASE_URL}/properties?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js will cache this at build time for SSG
      next: {
        revalidate: 60, // Revalidate every 60 seconds (ISR)
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }

    const data = await response.json();
    
    // DEBUG: Log the response structure (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('getProperties API response structure:', {
        hasData: !!data.data,
        hasProperties: !!data.properties,
        dataType: typeof data,
        isArray: Array.isArray(data),
      });
    }
    
    // Use enhanced extraction
    const propertiesArray = extractPropertiesArray(data);
    
    // Validate that we got an array
    if (!Array.isArray(propertiesArray)) {
      console.error('getProperties: Extracted value is not an array:', propertiesArray);
      throw new Error('Invalid properties data structure');
    }
    
    // Extract pagination info with multiple fallback strategies
    let paginationInfo = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: 0,
      totalPages: 0,
    };

    if (data.pagination) {
      paginationInfo = {
        page: parseInt(data.pagination.page || data.pagination.currentPage || page),
        limit: parseInt(data.pagination.limit || data.pagination.perPage || limit),
        total: parseInt(data.pagination.total || data.pagination.totalItems || 0),
        totalPages: parseInt(data.pagination.totalPages || 0),
      };
    } else if (data.meta) {
      // Some APIs use 'meta' instead of 'pagination'
      paginationInfo = {
        page: parseInt(data.meta.page || data.meta.currentPage || page),
        limit: parseInt(data.meta.limit || data.meta.perPage || limit),
        total: parseInt(data.meta.total || data.meta.totalItems || 0),
        totalPages: parseInt(data.meta.totalPages || 0),
      };
    } else if (typeof data.total !== 'undefined') {
      // Pagination at root level
      paginationInfo = {
        page: parseInt(data.page || page),
        limit: parseInt(data.limit || limit),
        total: parseInt(data.total || 0),
        totalPages: parseInt(data.totalPages || Math.ceil((data.total || 0) / limit)),
      };
    } else {
      // No pagination info, calculate from array
      paginationInfo.total = propertiesArray.length;
      paginationInfo.totalPages = Math.ceil(propertiesArray.length / limit);
    }

    // Ensure totalPages is calculated if not provided
    if (!paginationInfo.totalPages && paginationInfo.total) {
      paginationInfo.totalPages = Math.ceil(paginationInfo.total / paginationInfo.limit);
    }
    
    return {
      properties: propertiesArray,
      pagination: paginationInfo,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    return {
      properties: [], // CRITICAL: Always return empty array
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0,
      },
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetch featured properties
 * @param {number} limit - Number of properties to fetch
 * @returns {Promise<Array>} Featured properties
 */
export const getFeaturedProperties = async (limit = 6) => {
  const url = `${API_CONFIG.BASE_URL}/properties/featured?limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured properties: ${response.status}`);
    }

    const data = await response.json();
    
    // Use enhanced extraction
    const properties = extractPropertiesArray(data);
    
    return Array.isArray(properties) ? properties : [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return []; // Always return array
  }
};

/**
 * Search properties
 * @param {string} query - Search query
 * @param {object} filters - Additional filters
 * @returns {Promise<object>} Search results
 */
export const searchProperties = async (query, filters = {}) => {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      queryParams.append(key, filters[key]);
    }
  });

  const url = `${API_CONFIG.BASE_URL}/properties/search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache search results
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to search properties: ${response.status}`);
    }

    const data = await response.json();
    
    // Use enhanced extraction
    const results = extractPropertiesArray(data);
    
    return {
      results: Array.isArray(results) ? results : [],
      total: data.total || results.length || 0,
      success: true,
    };
  } catch (error) {
    console.error('Error searching properties:', error);
    
    return {
      results: [], // Always return array
      total: 0,
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get property types with counts
 * @returns {Promise<Array>} Property types with counts
 */
export const getPropertyTypes = async () => {
  const url = `${API_CONFIG.BASE_URL}/properties/types`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch property types: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract types array
    const types = data.data || data.types || [];
    
    return Array.isArray(types) ? types : [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    return []; // Always return array
  }
};

/**
 * Get properties by location
 * @param {string} location - Location to filter by
 * @param {number} limit - Number of properties
 * @returns {Promise<Array>} Properties in location
 */
export const getPropertiesByLocation = async (location, limit = 12) => {
  const url = `${API_CONFIG.BASE_URL}/properties?location=${encodeURIComponent(location)}&limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 120, // Revalidate every 2 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch properties by location: ${response.status}`);
    }

    const data = await response.json();
    
    // Use enhanced extraction
    const properties = extractPropertiesArray(data);
    
    return Array.isArray(properties) ? properties : [];
  } catch (error) {
    console.error('Error fetching properties by location:', error);
    return []; // Always return array
  }
};

/**
 * Get property statistics (for homepage)
 * @returns {Promise<object>} Property statistics
 */
export const getPropertyStats = async () => {
  const url = `${API_CONFIG.BASE_URL}/properties/stats`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 600, // Revalidate every 10 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch property stats: ${response.status}`);
    }

    const data = await response.json();
    
    // Safely extract stats
    const stats = data.data || data.stats || {};
    
    return {
      total: parseInt(stats.total) || 0,
      forSale: parseInt(stats.forSale) || 0,
      forRent: parseInt(stats.forRent) || 0,
      sold: parseInt(stats.sold) || 0,
    };
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return {
      total: 0,
      forSale: 0,
      forRent: 0,
      sold: 0,
    };
  }
};

export default getProperties;