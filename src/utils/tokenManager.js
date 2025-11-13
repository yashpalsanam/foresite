// src/utils/tokenManager.js
const TOKEN_KEY = 'foresite_admin_token';
const REFRESH_TOKEN_KEY = 'foresite_admin_refresh_token';

export const tokenManager = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Set refresh token
  setRefreshToken: (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Clear all tokens
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};