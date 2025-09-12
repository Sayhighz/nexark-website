import api from '../utils/api';
import i18n from '../i18n';

export const shopService = {
  // Get shop categories
  getCategories: async () => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.get('/shop/categories', { params: { lang } });
    return response.data;
  },

  // Get shop items
  getItems: async (params = {}) => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const allParams = { ...params, lang };
    const response = await api.get('/shop/items', { params: allParams });
    return response.data;
  },

  // Get item by ID
  getItemByID: async (itemId) => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.get(`/shop/items/${itemId}`, { params: { lang } });
    return response.data;
  },

  // Buy item (send RCON command)
  buyItem: async (itemId, serverId = null) => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.post(
      '/shop/buy',
      {
        item_id: itemId,
        server_id: serverId
      },
      { params: { lang } }
    );
    return response.data;
  },

  // Gift item to another player
  giftItem: async (itemId, recipientSteamId, serverId = null) => {
    const lang = (i18n?.language || 'en').split('-')[0];
    const response = await api.post(
      '/shop/gift',
      {
        item_id: itemId,
        recipient_steam_id: recipientSteamId,
        server_id: serverId
      },
      { params: { lang } }
    );
    return response.data;
  }
};