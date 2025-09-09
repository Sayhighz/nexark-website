import api from '../utils/api';

export const authService = {
  // Get Steam login URL
  getLoginURL: async () => {
    const response = await api.get('/auth/steam/login');
    return response.data;
  },

  // Handle Steam callback (usually handled by redirect)
  steamCallback: async (callbackData) => {
    const response = await api.get('/auth/steam/callback', {
      params: callbackData
    });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh authentication token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};