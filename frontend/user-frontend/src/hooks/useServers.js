import { useState, useCallback } from 'react';
import { serverService } from '../services/serverService';

export const useServers = () => {
  const [servers, setServers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all servers
  const getServers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serverService.getServers();
      setServers(response.data.servers);
      return response.data.servers;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get servers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get server by ID
  const getServerByID = useCallback(async (serverId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serverService.getServerByID(serverId);
      return response.data.server;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get server');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get server display info
  const getServerDisplayInfo = useCallback(async (serverId, category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serverService.getServerDisplayInfo(serverId, category);
      return response.data.display_info;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get display info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get display categories
  const getDisplayCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serverService.getDisplayCategories();
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    servers,
    categories,
    loading,
    error,
    getServers,
    getServerByID,
    getServerDisplayInfo,
    getDisplayCategories
  };
};