import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Statistic, Button, Space } from 'antd';
import {
  WalletOutlined,
  DesktopOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../contexts/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { useServers } from '../hooks/useServers';
import { useShop } from '../hooks/useShop';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { user } = useAuthContext();
  const { balance, getBalance, loading: creditsLoading, error: creditsError } = useCredits();
  const { servers, getServers, loading: serversLoading } = useServers();
  const { cart, getCart, loading: cartLoading } = useShop();
  const [stats, setStats] = useState({
    totalServers: 0,
    onlineServers: 0,
    cartItems: 0
  });

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          getBalance(),
          getServers(),
          getCart()
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [getBalance, getServers, getCart]);

  useEffect(() => {
    if (servers && cart) {
      setStats({
        totalServers: servers.length,
        onlineServers: servers.filter(s => s.status === 'online').length,
        cartItems: cart.length
      });
    }
  }, [servers, cart]);

  if (creditsLoading || serversLoading || cartLoading) {
    return <Loading size="lg" message="Loading dashboard..." />;
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none">
        <Title level={2} className="text-white mb-2">
          Welcome back, {user?.display_name || user?.username}! 🚀
        </Title>
        <Paragraph className="text-blue-100 mb-0">
          Ready to explore ARK Survival Evolved servers?
        </Paragraph>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        {/* Credits Card */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Credits"
              value={balance?.balance || 0}
              prefix={<WalletOutlined className="text-blue-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
            {creditsError && (
              <ErrorMessage error={creditsError} onRetry={getBalance} />
            )}
          </Card>
        </Col>

        {/* Servers Card */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Servers"
              value={stats.totalServers}
              prefix={<DesktopOutlined className="text-blue-600" />}
              suffix={`(${stats.onlineServers} online)`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* Cart Card */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Cart Items"
              value={stats.cartItems}
              prefix={<ShoppingCartOutlined className="text-blue-600" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card>
        <Title level={3} className="mb-4">Quick Actions</Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Link to="/servers">
              <Card hoverable className="text-center bg-blue-50 border-blue-200">
                <DesktopOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-blue-700">Browse Servers</div>
              </Card>
            </Link>
          </Col>

          <Col xs={12} sm={6}>
            <Link to="/shop">
              <Card hoverable className="text-center bg-blue-50 border-blue-200">
                <ShoppingOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-blue-700">Shop Items</div>
              </Card>
            </Link>
          </Col>

          <Col xs={12} sm={6}>
            <Link to="/games">
              <Card hoverable className="text-center bg-blue-50 border-blue-200">
                <PlayCircleOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-blue-700">Play Games</div>
              </Card>
            </Link>
          </Col>

          <Col xs={12} sm={6}>
            <Link to="/account/credits">
              <Card hoverable className="text-center bg-blue-50 border-blue-200">
                <DollarOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-blue-700">Top Up Credits</div>
              </Card>
            </Link>
          </Col>
        </Row>
      </Card>

      {/* Recent Activity */}
      <Card>
        <Title level={3} className="mb-4">Recent Activity</Title>
        <Card className="bg-gray-50">
          <div className="flex items-center space-x-3">
            <TrophyOutlined className="text-lg text-blue-600" />
            <div>
              <div className="font-medium">Welcome to NexARK!</div>
              <div className="text-sm text-gray-500">Start exploring our ARK servers</div>
            </div>
          </div>
        </Card>
      </Card>
    </Space>
  );
};

export default Dashboard;