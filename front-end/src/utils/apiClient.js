import axios from 'axios';

/**
 * API Client Configuration
 * Centralized Axios instance with request/response interceptors
 */

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies for auth
});

/**
 * Request Interceptor
 * Add authentication token and other headers before sending request
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if using JWT authentication)
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle responses and errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    // Return the data directly
    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error('❌ API Error Response:', {
        status,
        message: data?.message || error.message,
        url: error.config?.url,
      });

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Optionally redirect to login
            // window.location.href = '/login';
          }
          break;
        
        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden');
          break;
        
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        
        case 429:
          // Too many requests
          console.error('Rate limit exceeded');
          break;
        
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server error occurred');
          break;
        
        default:
          console.error('An error occurred');
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors || null,
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: null,
      });
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: null,
      });
    }
  }
);

/**
 * API Helper Methods
 * Convenience methods for common operations
 */

export const api = {
  // GET request
  get: (url, config = {}) => apiClient.get(url, config),
  
  // POST request
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  
  // PUT request
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  
  // PATCH request
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Upload file (with multipart/form-data)
  upload: (url, formData, onUploadProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  // Download file
  download: (url, filename) => {
    return apiClient.get(url, {
      responseType: 'blob',
    }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  },
};

/**
 * API Endpoints
 * Centralized endpoint definitions
 */
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    refreshToken: '/auth/refresh-token',
  },
  
  // Properties
  properties: {
    getAll: '/properties',
    getById: (id) => `/properties/${id}`,
    search: '/properties/search',
    featured: '/properties/featured',
    similar: (id) => `/properties/${id}/similar`,
  },
  
  // Inquiries
  inquiries: {
    create: '/inquiries',
    getById: (id) => `/inquiries/${id}`,
  },
  
  // Contact
  contact: {
    submit: '/contact',
  },
  
  // Newsletter
  newsletter: {
    subscribe: '/newsletter/subscribe',
    unsubscribe: '/newsletter/unsubscribe',
  },
  
  // User (if authentication is implemented)
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    favorites: '/user/favorites',
    addFavorite: (id) => `/user/favorites/${id}`,
    removeFavorite: (id) => `/user/favorites/${id}`,
  },
};

export default apiClient;
