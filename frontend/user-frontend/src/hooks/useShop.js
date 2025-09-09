import { useState, useCallback } from 'react';
import { shopService } from '../services/shopService';

export const useShop = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get shop categories
  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getCategories();
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get shop items
  const getItems = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getItems(params);
      setItems(response.data.items);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get items');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get item by ID
  const getItemByID = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getItemByID(itemId);
      return response.data.item;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (cartData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.addToCart(cartData);
      // Refresh cart after adding
      await getCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user cart
  const getCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getCart();
      setCart(response.data.cart_items);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update cart item
  const updateCartItem = useCallback(async (cartId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.updateCartItem(cartId, updateData);
      // Refresh cart after updating
      await getCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (cartId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.removeFromCart(cartId);
      // Refresh cart after removing
      await getCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCart]);

  return {
    categories,
    items,
    cart,
    loading,
    error,
    getCategories,
    getItems,
    getItemByID,
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
  };
};