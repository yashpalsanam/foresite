import { ERROR_MESSAGES } from './constants';

/**
 * Error Handler Utility
 * Centralized error handling and user-friendly error messages
 */

/**
 * Parse API error response
 * @param {object} error - Error object from API
 * @returns {object} Parsed error with message and details
 */
export const parseApiError = (error) => {
  // Default error structure
  const parsedError = {
    message: ERROR_MESSAGES.GENERIC_ERROR,
    status: 0,
    errors: null,
    timestamp: new Date().toISOString(),
  };

  // Handle different error types
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    parsedError.status = status;
    parsedError.message = data?.message || getErrorMessageByStatus(status);
    parsedError.errors = data?.errors || null;
  } else if (error.request) {
    // Request was made but no response
    parsedError.message = ERROR_MESSAGES.NETWORK_ERROR;
  } else if (error.message) {
    // Something else happened
    parsedError.message = error.message;
  }

  return parsedError;
};

/**
 * Get user-friendly error message based on status code
 * @param {number} status - HTTP status code
 * @returns {string} User-friendly error message
 */
export const getErrorMessageByStatus = (status) => {
  const errorMap = {
    400: 'Invalid request. Please check your input.',
    401: ERROR_MESSAGES.UNAUTHORIZED,
    403: ERROR_MESSAGES.FORBIDDEN,
    404: ERROR_MESSAGES.NOT_FOUND,
    422: ERROR_MESSAGES.VALIDATION_ERROR,
    429: ERROR_MESSAGES.RATE_LIMIT,
    500: ERROR_MESSAGES.SERVER_ERROR,
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
    504: 'Request timeout. Please try again.',
  };

  return errorMap[status] || ERROR_MESSAGES.GENERIC_ERROR;
};

/**
 * Format validation errors for form display
 * @param {object|array} errors - Validation errors from API
 * @returns {object} Formatted errors by field name
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return {};

  // If errors is an array of error objects
  if (Array.isArray(errors)) {
    return errors.reduce((acc, error) => {
      const field = error.field || error.path || 'general';
      acc[field] = error.message || error.msg || 'Invalid value';
      return acc;
    }, {});
  }

  // If errors is an object with field names as keys
  if (typeof errors === 'object') {
    return Object.keys(errors).reduce((acc, field) => {
      const error = errors[field];
      acc[field] = Array.isArray(error) ? error[0] : error;
      return acc;
    }, {});
  }

  return { general: errors.toString() };
};

/**
 * Log error to console (and optionally to error tracking service)
 * @param {Error} error - Error object
 * @param {object} context - Additional context for debugging
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message || 'Unknown error',
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', errorInfo);
  }

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: errorInfo });
    // For now, just log to console
    console.error('Error occurred:', errorInfo);
  }
};

/**
 * Create a custom error object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {object} data - Additional error data
 * @returns {Error} Custom error object
 */
export const createError = (message, status = 500, data = {}) => {
  const error = new Error(message);
  error.status = status;
  error.data = data;
  error.timestamp = new Date().toISOString();
  return error;
};

/**
 * Handle async errors with try-catch wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
export const asyncErrorHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, { function: fn.name, args });
      throw parseApiError(error);
    }
  };
};

/**
 * Check if error is a network error
 * @param {Error} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return (
    !error.response &&
    (error.message === 'Network Error' ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT')
  );
};

/**
 * Check if error is an authentication error
 * @param {Error} error - Error object
 * @returns {boolean} True if auth error
 */
export const isAuthError = (error) => {
  const status = error.status || error.response?.status;
  return status === 401 || status === 403;
};

/**
 * Check if error is a validation error
 * @param {Error} error - Error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  const status = error.status || error.response?.status;
  return status === 400 || status === 422;
};

/**
 * Retry failed request with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Result of the function
 */
export const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry for client errors (4xx)
      const status = error.status || error.response?.status;
      if (status >= 400 && status < 500) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

/**
 * Display error notification to user
 * @param {Error|string} error - Error object or message
 * @param {Function} toastFn - Toast notification function
 */
export const showErrorNotification = (error, toastFn) => {
  const message = typeof error === 'string' ? error : error.message || ERROR_MESSAGES.GENERIC_ERROR;
  
  if (toastFn && typeof toastFn === 'function') {
    toastFn.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else {
    // Fallback to console if toast is not available
    console.error(message);
  }
};

/**
 * Get error message from various error formats
 * @param {Error|string|object} error - Error in any format
 * @returns {string} Extracted error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.error) {
    return error.error;
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
};

/**
 * Handle form submission errors
 * @param {Error} error - Error from form submission
 * @param {Function} setError - React Hook Form setError function
 */
export const handleFormError = (error, setError) => {
  const parsedError = parseApiError(error);
  
  if (parsedError.errors) {
    const formattedErrors = formatValidationErrors(parsedError.errors);
    
    Object.keys(formattedErrors).forEach((field) => {
      setError(field, {
        type: 'manual',
        message: formattedErrors[field],
      });
    });
  } else {
    // Set general form error
    setError('root', {
      type: 'manual',
      message: parsedError.message,
    });
  }
};

export default {
  parseApiError,
  getErrorMessageByStatus,
  formatValidationErrors,
  logError,
  createError,
  asyncErrorHandler,
  isNetworkError,
  isAuthError,
  isValidationError,
  retryRequest,
  showErrorNotification,
  getErrorMessage,
  handleFormError,
};
