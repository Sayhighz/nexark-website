import { useState, useCallback } from 'react';
import { shopService } from '../services/shopService';

export const useShop = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get shop categories
  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopService.getCategories();
      const data = response?.data || {};
      setCategories(data.categories || []);
      return data.categories || [];
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
      const data = response?.data || {};
      setItems(data.items || []);
      return data;
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
      return response?.data?.item;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  
  return {
    categories,
    items,
    loading,
    error,
    getCategories,
    getItems,
    getItemByID,
  };
};