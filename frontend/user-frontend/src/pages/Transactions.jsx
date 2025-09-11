import React, { useEffect, useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import SpotlightButton from '../components/ui/SpotlightButton';

const Transactions = () => {
  const {
    transactions,
    getTransactions,
    loading,
    error
  } = useCredits();

  const [filter, setFilter] = useState('all'); // all, topup, spend
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      await getTransactions();
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'topup') return transaction.amount > 0;
    if (filter === 'spend') return transaction.amount < 0;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.amount > 0) {
      return (
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
      );
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.amount > 0) {
      return 'เติมเครดิต';
    } else {
      return 'ซื้อสินค้า';
    }
  };

  return (
    <div className="space-y-6">
      
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
                ประวัติการทำรายการ
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                ตรวจสอบประวัติการเติมเงินและการใช้จ่ายเครดิตของคุณ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          
          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} onRetry={loadTransactions} />
          )}

          {/* Filters and Controls */}
          <div className="mb-8">
            <SpotlightCard
              hsl
              hslMin={240}
              hslMax={280}
              className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
            >
              <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  
                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'all'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      onClick={() => setFilter('topup')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'topup'
                          ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                      }`}
                    >
                      เติมเงิน
                    </button>
                    <button
                      onClick={() => setFilter('spend')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'spend'
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                      }`}
                    >
                      การใช้จ่าย
                    </button>
                  </div>

                  {/* Sort and Refresh */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">ใหม่สุดก่อน</option>
                      <option value="oldest">เก่าสุดก่อน</option>
                    </select>
                    
                    <SpotlightButton
                      onClick={loadTransactions}
                      variant="secondary"
                      size="sm"
                    >
                      รีเฟรช
                    </SpotlightButton>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Transaction List */}
          <div className="mb-8">
            <SpotlightCard
              hsl
              hslMin={200}
              hslMax={240}
              className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
            >
              <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
              <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
              <div className="relative">
                
                {loading ? (
                  <Loading message="กำลังโหลดประวัติการทำรายการ..." />
                ) : sortedTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {sortedTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-6 bg-gray-800/30 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition-all">
                        
                        {/* Transaction Icon and Info */}
                        <div className="flex items-center space-x-4">
                          {getTransactionIcon(transaction)}
                          <div>
                            <p className="font-medium text-white text-lg">
                              {getTransactionType(transaction)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.description || 'ไม่มีรายละเอียด'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Amount and Balance */}
                        <div className="text-right">
                          <p className={`text-xl font-bold mb-1 ${
                            transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount)} เครดิต
                          </p>
                          <p className="text-sm text-gray-400">
                            ยอดคงเหลือ: {transaction.balance_after} เครดิต
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      ยังไม่มีประวัติการทำรายการ
                    </h3>
                    <p className="text-gray-400">
                      เมื่อคุณทำรายการเติมเงินหรือซื้อสินค้า ประวัติจะแสดงที่นี่
                    </p>
                  </div>
                )}
              </div>
            </SpotlightCard>
          </div>

          {/* Summary Stats */}
          {sortedTransactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpotlightCard
                hsl
                hslMin={120}
                hslMax={160}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">รายการทั้งหมด</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {sortedTransactions.length}
                  </p>
                  <p className="text-sm text-gray-400">รายการ</p>
                </div>
              </SpotlightCard>

              <SpotlightCard
                hsl
                hslMin={120}
                hslMax={160}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">เติมเงินทั้งหมด</h3>
                  <p className="text-3xl font-bold text-green-400">
                    +{sortedTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)}
                  </p>
                  <p className="text-sm text-gray-400">เครดิต</p>
                </div>
              </SpotlightCard>

              <SpotlightCard
                hsl
                hslMin={0}
                hslMax={40}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">ใช้จ่ายทั้งหมด</h3>
                  <p className="text-3xl font-bold text-red-400">
                    {Math.abs(sortedTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                  <p className="text-sm text-gray-400">เครดิต</p>
                </div>
              </SpotlightCard>
            </div>
          )}

        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Transactions;