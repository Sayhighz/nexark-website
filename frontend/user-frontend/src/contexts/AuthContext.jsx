import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile.data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        authService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async () => {
    try {
      setError(null);
      const loginData = await authService.getLoginURL();
      window.location.href = loginData.data.login_url;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
      throw err;
    }
  };

  // Handle Steam callback
  const handleCallback = async (callbackData) => {
    try {
      setError(null);
      const authData = await authService.steamCallback(callbackData);
      const { token, user: userData } = authData.data;

      authService.setToken(token);
      setUser(userData);
      return authData;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Authentication failed');
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authService.removeToken();
      setUser(null);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshData = await authService.refreshToken();
      const { token } = refreshData.data;
      authService.setToken(token);
      return refreshData;
    } catch (err) {
      logout(); // If refresh fails, logout
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile.data.user);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    handleCallback,
    logout,
    refreshToken,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};