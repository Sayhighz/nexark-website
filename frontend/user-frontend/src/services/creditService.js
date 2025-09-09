import api from '../utils/api';

export const creditService = {
  // Get credit balance
  getBalance: async () => {
    const response = await api.get('/credits/balance');
    return response.data;
  },

  // Get credit summary
  getSummary: async () => {
    const response = await api.get('/credits/summary');
    return response.data;
  },

  // Top up credits
  topUp: async (topUpData) => {
    const response = await api.post('/credits/topup', topUpData);
    return response.data;
  },

  // Get credit transactions
  getTransactions: async (params = {}) => {
    const response = await api.get('/credits/transactions', { params });
    return response.data;
  },

  // Transfer credits
  transferCredits: async (transferData) => {
    const response = await api.post('/credits/transfer', transferData);
    return response.data;
  }
};