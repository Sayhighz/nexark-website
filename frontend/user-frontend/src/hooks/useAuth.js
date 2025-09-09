import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
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

  // Login with Steam
  const login = useCallback(async () => {
    try {
      setError(null);
      const loginData = await authService.getLoginURL();
      // Redirect to Steam login URL
      window.location.href = loginData.data.login_url;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    }
  }, []);

  // Handle Steam callback
  const handleCallback = useCallback(async (callbackData) => {
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
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authService.removeToken();
      setUser(null);
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const refreshData = await authService.refreshToken();
      const { token } = refreshData.data;
      authService.setToken(token);
      return refreshData;
    } catch (err) {
      logout(); // If refresh fails, logout
      throw err;
    }
  }, [logout]);

  // Update user profile
  const updateProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile.data.user);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  }, []);

  return {
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
};