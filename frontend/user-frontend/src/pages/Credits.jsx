import React, { useEffect, useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import SpotlightButton from '../components/ui/SpotlightButton';

const Credits = () => {
  const {
    balance,
    summary,
    transactions,
    getBalance,
    getSummary,
    topUp,
    getTransactions,
    loading,
    error
  } = useCredits();

  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpForm, setShowTopUpForm] = useState(false);

  useEffect(() => {
    loadCreditData();
  }, []);

  const loadCreditData = async () => {
    try {
      await Promise.all([
        getBalance(),
        getSummary(),
        getTransactions()
      ]);
    } catch (error) {
      console.error('Failed to load credit data:', error);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    try {
      const amount = parseFloat(topUpAmount);
      if (amount < 100 || amount > 50000) {
        alert('Amount must be between 100 and 50,000 THB');
        return;
      }

      await topUp({
        amount: amount,
        currency: 'thb',
        payment_method: 'promptpay' // Default payment method
      });

      setTopUpAmount('');
      setShowTopUpForm(false);
      alert('Top-up initiated! Please complete the payment.');
    } catch (err) {
      alert('Failed to initiate top-up');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your credit balance and transaction history
          </p>
        </div>
        <SpotlightButton
          onClick={() => setShowTopUpForm(!showTopUpForm)}
          variant="accent"
          size="md"
        >
          {showTopUpForm ? 'Cancel' : 'Top Up Credits'}
        </SpotlightButton>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} onRetry={loadCreditData} />
      )}

      {/* Top Up Form */}
      {showTopUpForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Top Up Credits</h2>
          <form onSubmit={handleTopUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (THB)
              </label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount (100-50,000)"
                min="100"
                max="50000"
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 100 THB, Maximum: 50,000 THB
              </p>
            </div>

            <div className="flex gap-3">
              <SpotlightButton type="submit" variant="accent" size="md">
                Proceed to Payment
              </SpotlightButton>
              <SpotlightButton
                type="button"
                onClick={() => setShowTopUpForm(false)}
                variant="secondary"
                size="md"
              >
                Cancel
              </SpotlightButton>
            </div>
          </form>
        </div>
      )}

      {/* Credit Balance Card */}
      <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Current Balance</h2>
            <p className="text-green-100">Available credits for purchases</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {balance?.balance || 0}
            </div>
            <div className="text-green-100">Credits</div>
          </div>
        </div>
      </div>

      {/* Credit Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earned</h3>
            <p className="text-2xl font-bold text-green-600">
              +{summary.total_earned || 0}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
            <p className="text-2xl font-bold text-red-600">
              -{summary.total_spent || 0}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Balance</h3>
            <p className="text-2xl font-bold text-blue-600">
              {summary.net_balance || 0}
            </p>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <SpotlightButton
            onClick={() => getTransactions()}
            variant="secondary"
            size="sm"
            className="text-blue-600 hover:text-blue-800 bg-transparent border-transparent hover:bg-blue-50"
          >
            Refresh
          </SpotlightButton>
        </div>

        {loading ? (
          <Loading message="Loading transactions..." />
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description || transaction.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Balance: {transaction.balance_after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Credit Info */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💰 Credit Information
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Credits are used to purchase items in the shop</li>
          <li>• Earn credits through gameplay and promotions</li>
          <li>• Credits never expire</li>
          <li>• Secure payment processing via Stripe</li>
        </ul>
      </div>
    </div>
  );
};

export default Credits;