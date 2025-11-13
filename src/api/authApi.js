// src/api/authApi.js
import axiosInstance from './axiosInstance';

export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await axiosInstance.patch('/users/profile', data);
    return response;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await axiosInstance.post('/auth/change-password', passwords);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await axiosInstance.post('/auth/verify-email', { token });
    return response;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response;
  }
};