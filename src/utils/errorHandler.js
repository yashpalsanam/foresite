import toast from 'react-hot-toast';

export const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || 'An error occurred';
    const statusCode = error.response.status;

    switch (statusCode) {
      case 400:
        toast.error(message);
        break;
      case 401:
        toast.error('Unauthorized. Please login again.');
        break;
      case 403:
        toast.error('Access forbidden');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }

    return {
      success: false,
      message,
      statusCode,
    };
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
    return {
      success: false,
      message: 'Network error',
    };
  } else {
    toast.error('An unexpected error occurred');
    return {
      success: false,
      message: error.message || 'Unexpected error',
    };
  }
};

export const logError = (error, context = '') => {
  console.error(`Error ${context}:`, error);
};
