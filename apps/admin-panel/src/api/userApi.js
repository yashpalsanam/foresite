import axiosInstance from './axiosInstance';

export const userApi = {
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await axiosInstance.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  },
};

export default userApi;
