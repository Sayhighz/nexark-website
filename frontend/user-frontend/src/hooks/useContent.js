import { useState, useCallback } from 'react';
import { contentService } from '../services/contentService';

export const useContent = () => {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get news
  const getNews = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getNews(params);
      setNews(response.data.news);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get news');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get featured news
  const getFeaturedNews = useCallback(async (limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getFeaturedNews(limit);
      return response.data.news;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get featured news');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get latest news
  const getLatestNews = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getLatestNews(limit);
      return response.data.news;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get latest news');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get news by ID
  const getNewsByID = useCallback(async (newsId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getNewsByID(newsId);
      return response.data.news;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get news');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get announcements
  const getAnnouncements = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getAnnouncements(params);
      setAnnouncements(response.data.announcements);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get announcements');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get active announcements
  const getActiveAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getActiveAnnouncements();
      return response.data.announcements;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get active announcements');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search content
  const searchContent = useCallback(async (query, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.searchContent(query, params);
      setSearchResults(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get content summary
  const getContentSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getContentSummary();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    news,
    announcements,
    searchResults,
    loading,
    error,
    getNews,
    getFeaturedNews,
    getLatestNews,
    getNewsByID,
    getAnnouncements,
    getActiveAnnouncements,
    searchContent,
    getContentSummary
  };
};