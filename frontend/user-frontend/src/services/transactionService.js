import api from '../utils/api';

export const transactionService = {
  // Process purchase
  processPurchase: async (purchaseData) => {
    const response = await api.post('/transactions/purchase', purchaseData);
    return response.data;
  },

  // Get user transactions
  getUserTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Get transaction by ID
  getTransactionByID: async (transactionUuid) => {
    const response = await api.get(`/transactions/${transactionUuid}`);
    return response.data;
  }
};