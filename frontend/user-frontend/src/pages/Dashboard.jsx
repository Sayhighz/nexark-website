import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Statistic, Button, Space } from 'antd';
import {
  WalletOutlined,
  DesktopOutlined,
  PlayCircleOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../contexts/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { useServers } from '../hooks/useServers';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { user } = useAuthContext();
  const { balance, getBalance, loading: creditsLoading, error: creditsError } = useCredits();
  const { servers, getServers, loading: serversLoading } = useServers();
  const [stats, setStats] = useState({
    totalServers: 0,
    onlineServers: 0
  });

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          getBalance(),
          getServers()
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [getBalance, getServers]);

  useEffect(() => {
    if (servers) {
      setStats({
        totalServers: servers.length,
        onlineServers: servers.filter(s => s.status === 'online').length
      });
    }
  }, [servers]);

  if (creditsLoading || serversLoading) {
    return (
      <div className="space-y-6">
        <div className="relative z-20 pt-20">
          <Loading size="lg" message="Loading dashboard..." />
        </div>
      </div>
    );
  }

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
                Welcome back, {user?.display_name || user?.username}! 🚀
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Ready to explore ARK Survival Evolved servers?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Credits Card */}
            <SpotlightCard
              hsl
              hslMin={120}
              hslMax={160}
              className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
            >
              <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <WalletOutlined className="text-green-400 text-xl" />
                      <h3 className="text-lg font-semibold text-white">Credits</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-400">
                      {balance?.balance || 0}
                    </p>
                  </div>
                </div>
                {creditsError && (
                  <ErrorMessage error={creditsError} onRetry={getBalance} />
                )}
              </div>
            </SpotlightCard>

            {/* Servers Card */}
            <SpotlightCard
              hsl
              hslMin={200}
              hslMax={240}
              className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5"
            >
              <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DesktopOutlined className="text-blue-400 text-xl" />
                      <h3 className="text-lg font-semibold text-white">Servers</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                      {stats.totalServers}
                    </p>
                    <p className="text-sm text-gray-400">({stats.onlineServers} online)</p>
                  </div>
                </div>
              </div>
            </SpotlightCard>

          </div>

          {/* Quick Actions */}
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
                <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/servers">
                    <div className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg p-4 text-center transition-all cursor-pointer">
                      <DesktopOutlined className="text-3xl text-blue-400 mb-2 block" />
                      <div className="font-medium text-blue-300">Browse Servers</div>
                    </div>
                  </Link>

                  <Link to="/shop">
                    <div className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-lg p-4 text-center transition-all cursor-pointer">
                      <ShoppingOutlined className="text-3xl text-purple-400 mb-2 block" />
                      <div className="font-medium text-purple-300">Shop Items</div>
                    </div>
                  </Link>

                  <Link to="/games">
                    <div className="bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg p-4 text-center transition-all cursor-pointer">
                      <PlayCircleOutlined className="text-3xl text-green-400 mb-2 block" />
                      <div className="font-medium text-green-300">Play Games</div>
                    </div>
                  </Link>

                  <Link to="/credits">
                    <div className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg p-4 text-center transition-all cursor-pointer">
                      <DollarOutlined className="text-3xl text-yellow-400 mb-2 block" />
                      <div className="font-medium text-yellow-300">Top Up Credits</div>
                    </div>
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Recent Activity */}
          <SpotlightCard
            hsl
            hslMin={280}
            hslMax={320}
            className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
          >
            <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <TrophyOutlined className="text-2xl text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Welcome to NexARK!</div>
                    <div className="text-sm text-gray-400">Start exploring our ARK servers</div>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Dashboard;