import axiosInstance from './axiosInstance';

export const analyticsApi = {
  getAnalytics: async (params = {}) => {
    const response = await axiosInstance.get('/admin/analytics', { params });
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  },

  getInquiryStats: async () => {
    const response = await axiosInstance.get('/inquiries/stats');
    return response.data;
  },

  getPropertyStats: async () => {
    const response = await axiosInstance.get('/properties/stats');
    return response.data;
  },

  getAnalyticsSummary: async (params = {}) => {
    const response = await axiosInstance.get('/analytics/summary', { params });
    return response.data;
  },
};

export default analyticsApi;
