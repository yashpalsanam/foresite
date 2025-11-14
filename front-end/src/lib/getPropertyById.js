import { API_CONFIG } from '@/utils/constants';

/**
 * Fetch single property by ID (Server-Side)
 * Used in getServerSideProps or getStaticProps
 * 
 * @param {string} id - Property ID
 * @returns {Promise<object>} Property data
 */
export const getPropertyById = async (id) => {
  if (!id) {
    return {
      property: null,
      success: false,
      error: 'Property ID is required',
    };
  }

  const url = `${API_CONFIG.BASE_URL}/properties/${id}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60, // Revalidate every 60 seconds (ISR)
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          property: null,
          success: false,
          error: 'Property not found',
          notFound: true,
        };
      }
      
      throw new Error(`Failed to fetch property: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      property: data.data || data.property || null,
      success: true,
    };
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    
    return {
      property: null,
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get similar properties based on a property
 * @param {string} propertyId - Property ID to find similar properties for
 * @param {number} limit - Number of similar properties to fetch
 * @returns {Promise<Array>} Similar properties
 */
export const getSimilarProperties = async (propertyId, limit = 4) => {
  if (!propertyId) {
    return [];
  }

  const url = `${API_CONFIG.BASE_URL}/properties/${propertyId}/similar?limit=${limit}`;

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
      throw new Error(`Failed to fetch similar properties: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data.properties || [];
  } catch (error) {
    console.error('Error fetching similar properties:', error);
    return [];
  }
};

/**
 * Get all property IDs for static path generation
 * Used in getStaticPaths
 * @returns {Promise<Array>} Array of property IDs
 */
export const getAllPropertyIds = async () => {
  const url = `${API_CONFIG.BASE_URL}/properties?fields=id&limit=1000`;

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
      throw new Error(`Failed to fetch property IDs: ${response.status}`);
    }

    const data = await response.json();
    const properties = data.data || data.properties || [];
    
    return properties.map(property => property.id || property._id);
  } catch (error) {
    console.error('Error fetching property IDs:', error);
    return [];
  }
};

/**
 * Validate property data for SEO and display
 * @param {object} property - Property object
 * @returns {object} Validated property with defaults
 */
export const validatePropertyData = (property) => {
  if (!property) {
    return null;
  }

  return {
    id: property.id || property._id,
    title: property.title || 'Untitled Property',
    description: property.description || '',
    price: property.price || 0,
    type: property.type || 'residential',
    status: property.status || 'for-sale',
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area || 0,
    location: property.location || {},
    address: property.address || 'Location not specified',
    images: property.images || [],
    amenities: property.amenities || [],
    features: property.features || [],
    agent: property.agent || null,
    createdAt: property.createdAt || new Date().toISOString(),
    updatedAt: property.updatedAt || new Date().toISOString(),
    ...property, // Include any additional fields
  };
};

/**
 * Check if property exists (lightweight check)
 * @param {string} id - Property ID
 * @returns {Promise<boolean>} True if property exists
 */
export const propertyExists = async (id) => {
  if (!id) {
    return false;
  }

  const url = `${API_CONFIG.BASE_URL}/properties/${id}?fields=id`;

  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD request for lightweight check
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error(`Error checking if property ${id} exists:`, error);
    return false;
  }
};

/**
 * Prefetch property data for client-side navigation
 * @param {string} id - Property ID
 * @returns {Promise<object>} Property data
 */
export const prefetchProperty = async (id) => {
  try {
    const result = await getPropertyById(id);
    
    if (result.success && result.property) {
      // Store in cache if available
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await caches.open('properties-cache');
        const response = new Response(JSON.stringify(result.property));
        await cache.put(`/property/${id}`, response);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error prefetching property:', error);
    return null;
  }
};

export default getPropertyById;
