import React, { useEffect, useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import SpotlightButton from '../components/ui/SpotlightButton';
import { Sparkles } from '../components/ui/Sparkles';
import { useTranslation } from 'react-i18next';
import {
  HistoryOutlined,
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  WalletOutlined,
  ShoppingOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const Transactions = () => {
  const { t, i18n } = useTranslation();
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
    const locale = i18n.language && i18n.language.startsWith('th') ? 'th-TH' : 'en-US';
    return date.toLocaleDateString(locale, {
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
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
          <PlusOutlined className="text-xl text-green-400" />
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
          <MinusOutlined className="text-xl text-red-400" />
        </div>
      );
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.amount > 0) {
      return t('credits.title');
    } else {
      return t('dashboard.actions.shopItems');
    }
  };

  const getTransactionTypeIcon = (transaction) => {
    if (transaction.amount > 0) {
      return <WalletOutlined className="text-lg text-green-400" />;
    } else {
      return <ShoppingOutlined className="text-lg text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Section - Credits Style */}
      <>
        {/* Text header */}
        <div className="relative pt-20 pb-8">
          <div className="relative z-20 text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HistoryOutlined className="text-5xl text-blue-400" />
              <h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'SukhumvitSet' }}>
                {t('transactions.title')}
              </h1>
            </div>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'SukhumvitSet' }}>
              {t('transactions.subtitle')}
            </p>
          </div>
        </div>

        {/* Background band with sparkles */}
        <div className="relative mb-8">
          <div className="relative h-32 overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: `url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')`
              }}
            ></div>

            <Sparkles
              density={800}
              className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
              color="#8350e8"
              size={1.5}
              speed={0.3}
            />
          </div>
        </div>
      </>

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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'all'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                      }`}
                      style={{ fontFamily: 'SukhumvitSet' }}
                    >
                      <FilterOutlined />
                      {t('transactions.filters.all')}
                    </button>
                    <button
                      onClick={() => setFilter('topup')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'topup'
                          ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                      }`}
                      style={{ fontFamily: 'SukhumvitSet' }}
                    >
                      <PlusOutlined />
                      {t('transactions.filters.topup')}
                    </button>
                    <button
                      onClick={() => setFilter('spend')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === 'spend'
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                      }`}
                      style={{ fontFamily: 'SukhumvitSet' }}
                    >
                      <MinusOutlined />
                      {t('transactions.filters.spend')}
                    </button>
                  </div>

                  {/* Sort and Refresh */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                      <SortAscendingOutlined className="text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-white text-sm focus:outline-none"
                        style={{ fontFamily: 'SukhumvitSet' }}
                      >
                        <option value="newest" className="bg-gray-800">{t('transactions.sort.newest')}</option>
                        <option value="oldest" className="bg-gray-800">{t('transactions.sort.oldest')}</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={loadTransactions}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all backdrop-blur-sm"
                      style={{ fontFamily: 'SukhumvitSet' }}
                    >
                      <ReloadOutlined />
                      {t('transactions.refresh')}
                    </button>
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
                  <Loading message={t('transactions.loading')} />
                ) : sortedTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {sortedTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all backdrop-blur-sm">
                        
                        {/* Transaction Icon and Info */}
                        <div className="flex items-center space-x-4">
                          {getTransactionIcon(transaction)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getTransactionTypeIcon(transaction)}
                              <p className="font-medium text-white text-lg" style={{ fontFamily: 'SukhumvitSet' }}>
                                {getTransactionType(transaction)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                              {transaction.description || t('transactions.noDescription')}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CalendarOutlined />
                              <span style={{ fontFamily: 'SukhumvitSet' }}>
                                {formatDate(transaction.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Amount and Balance */}
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 mb-1">
                            <DollarOutlined className={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'} />
                            <p className={`text-xl font-bold ${
                              transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                            }`} style={{ fontFamily: 'SukhumvitSet' }}>
                              {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount)} {t('transactions.creditsUnit')}
                            </p>
                          </div>
                          <p className="text-sm text-gray-400" style={{ fontFamily: 'SukhumvitSet' }}>
                            {t('transactions.balanceAfter')} {transaction.balance_after} {t('transactions.creditsUnit')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <BarChartOutlined className="text-6xl text-gray-500 mb-4" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('transactions.empty.title')}
                    </h3>
                    <p className="text-gray-400 max-w-md mx-auto" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('transactions.empty.subtitle')}
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
                hslMin={200}
                hslMax={240}
                className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <BarChartOutlined className="text-2xl text-blue-400" />
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('transactions.summary.totalTitle')}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                    {sortedTransactions.length}
                  </p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'SukhumvitSet' }}>
                    {t('transactions.summary.itemsLabel')}
                  </p>
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
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <PlusOutlined className="text-2xl text-green-400" />
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('transactions.summary.topupTotal')}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-green-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                    +{sortedTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)}
                  </p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'SukhumvitSet' }}>
                    {t('transactions.summary.credits')}
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
                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <MinusOutlined className="text-2xl text-red-400" />
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('transactions.summary.spendTotal')}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-red-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                    {Math.abs(sortedTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'SukhumvitSet' }}>
                    {t('transactions.summary.credits')}
                  </p>
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