import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import { getToken, setToken, removeToken } from '../utils/tokenManager';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await authApi.getMe();
        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          removeToken();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success) {
        setToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authApi.updateProfile(profileData);
      if (response.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully');
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
