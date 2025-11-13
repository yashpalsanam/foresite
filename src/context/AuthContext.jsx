// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { tokenManager } from '../utils/tokenManager';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = tokenManager.getToken();
      if (token) {
        try {
          // Attempt to fetch profile to validate token
          const res = await authApi.getProfile();
          const data = res.data?.data || res.data;
          if (data?.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            tokenManager.clearAll();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          tokenManager.clearAll();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const responseData = response.data?.data || response.data;
    const { token, refreshToken, user: loggedUser } = responseData;

    if (!token) {
      throw new Error('No token returned from login');
    }

    tokenManager.setToken(token);
    if (refreshToken) tokenManager.setRefreshToken?.(refreshToken);
    if (loggedUser) tokenManager.setUser?.(loggedUser);

    setUser(loggedUser || null);
    setIsAuthenticated(true);

    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore network errors on logout
      console.error('Logout error', err);
    } finally {
      tokenManager.clearAll?.();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    return response;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) tokenManager.setUser?.(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};