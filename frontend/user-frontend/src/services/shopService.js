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

  // Add item to cart
  addToCart: async (cartData) => {
    const response = await api.post('/cart/add', cartData);
    return response.data;
  },

  // Get user cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Update cart item
  updateCartItem: async (cartId, updateData) => {
    const response = await api.put(`/cart/${cartId}`, updateData);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (cartId) => {
    const response = await api.delete(`/cart/${cartId}`);
    return response.data;
  }
};