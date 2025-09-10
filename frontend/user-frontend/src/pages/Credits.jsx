import React, { useEffect, useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StarBackground from '../components/site/StarBackground';
import Navbar from '../components/site/Navbar';
import { SpotlightCard } from '../components/ui/SpotlightCard';
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
    } catch {
      alert('Failed to initiate top-up');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      <StarBackground />
      
      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
        <div
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')`
          }}
        >
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-5xl font-bold mb-4 text-white">
                Credits
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Manage your credit balance and transaction history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Header Actions */}
          <div className="flex justify-end mb-8">
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
            <div className="mb-8">
              <SpotlightCard
                hsl
                hslMin={280}
                hslMax={320}
                className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-6">Top Up Credits</h2>
                  <form onSubmit={handleTopUp} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (THB)
                      </label>
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="Enter amount (100-50,000)"
                        min="100"
                        max="50000"
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-2">
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
              </SpotlightCard>
            </div>
          )}

          {/* Credit Balance Card */}
          <div className="mb-8">
            <SpotlightCard
              hsl
              hslMin={120}
              hslMax={160}
              className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
            >
              <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
              <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Current Balance</h2>
                    <p className="text-gray-300">Available credits for purchases</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-400">
                      {balance?.balance || 0}
                    </div>
                    <div className="text-gray-300">Credits</div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Credit Summary */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SpotlightCard
                hsl
                hslMin={120}
                hslMax={160}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Earned</h3>
                  <p className="text-3xl font-bold text-green-400">
                    +{summary.total_earned || 0}
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard
                hsl
                hslMin={0}
                hslMax={40}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Spent</h3>
                  <p className="text-3xl font-bold text-red-400">
                    -{summary.total_spent || 0}
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard
                hsl
                hslMin={200}
                hslMax={240}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white mb-2">Net Balance</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {summary.net_balance || 0}
                  </p>
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* Transaction History */}
          <div className="mb-8">
            <SpotlightCard
              hsl
              hslMin={240}
              hslMax={280}
              className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
            >
              <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
              <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                  <SpotlightButton
                    onClick={() => getTransactions()}
                    variant="secondary"
                    size="sm"
                  >
                    Refresh
                  </SpotlightButton>
                </div>

                {loading ? (
                  <Loading message="Loading transactions..." />
                ) : transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="font-medium text-white">
                            {transaction.description || transaction.type}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </p>
                          <p className="text-sm text-gray-400">
                            Balance: {transaction.balance_after}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-400">No transactions yet</p>
                  </div>
                )}
              </div>
            </SpotlightCard>
          </div>

          {/* Credit Info */}
          <SpotlightCard
            hsl
            hslMin={60}
            hslMax={100}
            className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
          >
            <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-4">
                💰 Credit Information
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>Credits are used to purchase items in the shop</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>Earn credits through gameplay and promotions</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>Credits never expire</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>Secure payment processing via Stripe</li>
              </ul>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Credits;