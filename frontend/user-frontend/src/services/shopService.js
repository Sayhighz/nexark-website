import api from '../utils/api';

export const shopService = {
  // Get shop categories
  getCategories: async () => {
    const response = await api.get('/shop/categories');
    return response.data;
  },

  // Get shop items
  getItems: async (params = {}) => {
    const response = await api.get('/shop/items', { params });
    return response.data;
  },

  // Get item by ID
  getItemByID: async (itemId) => {
    const response = await api.get(`/shop/items/${itemId}`);
    return response.data;
  },

  // Buy item (send RCON command)
  buyItem: async (itemId, serverId = null) => {
    const response = await api.post('/shop/buy', {
      item_id: itemId,
      server_id: serverId
    });
    return response.data;
  },

  // Gift item to another player
  giftItem: async (itemId, recipientSteamId, serverId = null) => {
    const response = await api.post('/shop/gift', {
      item_id: itemId,
      recipient_steam_id: recipientSteamId,
      server_id: serverId
    });
    return response.data;
  }
};