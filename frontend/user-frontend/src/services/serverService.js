import api from '../utils/api';

export const serverService = {
  // Get all servers
  getServers: async () => {
    const response = await api.get('/servers');
    return response.data;
  },

  // Get server by ID
  getServerByID: async (serverId) => {
    const response = await api.get(`/servers/${serverId}`);
    return response.data;
  },

  // Get server display info
  getServerDisplayInfo: async (serverId, category) => {
    const response = await api.get(`/servers/${serverId}/info`, {
      params: { category }
    });
    return response.data;
  },

  // Get display categories
  getDisplayCategories: async () => {
    const response = await api.get('/servers/categories');
    return response.data;
  }
};