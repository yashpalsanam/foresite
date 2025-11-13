// src/api/axiosInstance.js
import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
            { refreshToken }
          );

          const { token } = response.data.data || response.data;
          tokenManager.setToken(token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        tokenManager.clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If still 401 or refresh failed, redirect to login
    if (error.response?.status === 401) {
      tokenManager.clearAll();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;