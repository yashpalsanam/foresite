import axiosInstance from './axiosInstance';

export const adminApi = {
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
};

export default adminApi;
