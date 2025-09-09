import api from '../utils/api';

export const contentService = {
  // Get news
  getNews: async (params = {}) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  // Get featured news
  getFeaturedNews: async (limit = 5) => {
    const response = await api.get('/news/featured', { params: { limit } });
    return response.data;
  },

  // Get latest news
  getLatestNews: async (limit = 10) => {
    const response = await api.get('/news/latest', { params: { limit } });
    return response.data;
  },

  // Get news by ID
  getNewsByID: async (newsId) => {
    const response = await api.get(`/news/${newsId}`);
    return response.data;
  },

  // Get announcements
  getAnnouncements: async (params = {}) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  // Get active announcements
  getActiveAnnouncements: async () => {
    const response = await api.get('/announcements/active');
    return response.data;
  },

  // Search content
  searchContent: async (query, params = {}) => {
    const response = await api.get('/content/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Get content summary
  getContentSummary: async () => {
    const response = await api.get('/content/summary');
    return response.data;
  }
};