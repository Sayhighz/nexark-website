import { useState, useCallback } from 'react';
import { creditService } from '../services/creditService';

export const useCredits = () => {
  const [balance, setBalance] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get credit balance
  const getBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditService.getBalance();
      setBalance(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get balance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get credit summary
  const getSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditService.getSummary();
      setSummary(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Top up credits
  const topUp = useCallback(async (topUpData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditService.topUp(topUpData);
      // Refresh balance after topup
      await getBalance();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Topup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getBalance]);

  // Get credit transactions
  const getTransactions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditService.getTransactions(params);
      setTransactions(response.data.transactions);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to get transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Transfer credits
  const transferCredits = useCallback(async (transferData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditService.transferCredits(transferData);
      // Refresh balance after transfer
      await getBalance();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Transfer failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getBalance]);

  return {
    balance,
    summary,
    transactions,
    loading,
    error,
    getBalance,
    getSummary,
    topUp,
    getTransactions,
    transferCredits
  };
};