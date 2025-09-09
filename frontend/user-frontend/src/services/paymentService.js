import api from '../utils/api';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    const response = await api.post('/payments/create-intent', paymentData);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentUuid) => {
    const response = await api.get(`/payments/${paymentUuid}/status`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (params = {}) => {
    const response = await api.get('/payments/history', { params });
    return response.data;
  }
};