import api from '../utils/api';
import i18n from '../i18n';

export const serverService = {
  // Get all servers
  getServers: async () => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.get('/servers', { params: { lang } });
    return response.data;
  },

  // Get server by ID
  getServerByID: async (serverId) => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.get(`/servers/${serverId}`, { params: { lang } });
    return response.data;
  },

  // Get server display info
  getServerDisplayInfo: async (serverId, category) => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.get(`/servers/${serverId}/info`, {
      params: { category, lang }
    });
    return response.data;
  },

  // Get display categories
  getDisplayCategories: async () => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.get('/servers/categories', { params: { lang } });
    return response.data;
  }
};