import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  getAnalytics: async (params = {}) => {
    const response = await axiosInstance.get('/admin/analytics', { params });
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await axiosInstance.get('/admin/system-health');
    return response.data;
  },

  cleanupOldData: async () => {
    const response = await axiosInstance.post('/admin/cleanup');
    return response.data;
  },

  bulkDeleteUsers: async (userIds) => {
    const response = await axiosInstance.post('/admin/bulk-delete-users', { userIds });
    return response.data;
  },

  bulkDeleteProperties: async (propertyIds) => {
    const response = await axiosInstance.post('/admin/bulk-delete-properties', { propertyIds });
    return response.data;
  },
};

export default dashboardApi;
