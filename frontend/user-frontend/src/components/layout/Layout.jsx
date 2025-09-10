import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Badge, Button } from 'antd';
import {
  HomeOutlined,
  DesktopOutlined,
  ShoppingOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
  DownOutlined,
  SettingOutlined,
  BugOutlined,
  GiftOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useServers } from '../../hooks/useServers';
import SpotlightButton from '../ui/SpotlightButton';

const { Header, Content, Footer } = AntLayout;

const LayoutComponent = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const { servers, getServers } = useServers();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      getServers();
    }
  }, [isAuthenticated]);

  // Server dropdown menu
  const serverMenuItems = servers?.map(server => ({
    key: `server-${server.server_id}`,
    label: server.server_name,
    children: [
      {
        key: `${server.server_id}-settings`,
        icon: <SettingOutlined />,
        label: <Link to={`/servers/${server.server_id}/settings`}>Server Settings</Link>,
      },
      {
        key: `${server.server_id}-players`,
        icon: <UserOutlined />,
        label: <Link to={`/servers/${server.server_id}/players`}>Players</Link>,
      },
      {
        key: `${server.server_id}-dinos`,
        icon: <BugOutlined />,
        label: <Link to={`/servers/${server.server_id}/dinos`}>Dinos</Link>,
      },
      {
        key: `${server.server_id}-items`,
        icon: <GiftOutlined />,
        label: <Link to={`/servers/${server.server_id}/items`}>Items</Link>,
      },
      {
        key: `${server.server_id}-rules`,
        icon: <FileProtectOutlined />,
        label: <Link to={`/servers/${server.server_id}/rules`}>Rules</Link>,
      },
    ]
  })) || [];

  const navigation = [
    {
      key: 'servers',
      label: 'Servers',
      href: '/servers',
      icon: <DesktopOutlined />,
      dropdown: serverMenuItems.length > 0 ? serverMenuItems : null
    },
    { key: 'shop', label: 'Shop', href: '/shop', icon: <ShoppingOutlined /> },
    { key: 'games', label: 'Games', href: '/games', icon: <PlayCircleOutlined /> },
  ];

  const accountMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: 'credits',
      icon: <WalletOutlined />,
      label: <Link to="/account/credits">Credits</Link>,
    },
    {
      key: 'payments',
      icon: <CreditCardOutlined />,
      label: <Link to="/account/payments">Payments</Link>,
    },
    {
      key: 'transactions',
      icon: <BarChartOutlined />,
      label: <Link to="/account/transactions">Transactions</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
      danger: true,
    },
  ];

  const getCurrentKey = () => {
    const path = location.pathname;
    const navItem = navigation.find(item => item.href === path);
    return navItem ? navItem.key : 'dashboard';
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white shadow-lg px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-500">
            ⭐ NexARK
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <Menu
            mode="horizontal"
            selectedKeys={[getCurrentKey()]}
            className="border-none bg-transparent"
            items={navigation.map(item => {
              if (item.dropdown && item.dropdown.length > 0) {
                return {
                  key: item.key,
                  icon: item.icon,
                  label: (
                    <Dropdown
                      menu={{ items: item.dropdown }}
                      trigger={['hover']}
                      placement="bottomLeft"
                    >
                      <span className="cursor-pointer">
                        {item.label} <DownOutlined />
                      </span>
                    </Dropdown>
                  ),
                };
              }
              return {
                key: item.key,
                icon: item.icon,
                label: <Link to={item.href}>{item.label}</Link>,
              };
            })}
          />
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* User Credits */}
              <Badge
                count={user?.credit_balance || 0}
                showZero
                style={{ backgroundColor: '#52c41a' }}
                className="hidden sm:block"
              >
                <WalletOutlined className="text-lg text-blue-500" />
              </Badge>

              {/* User Dropdown */}
              <Dropdown
                menu={{ items: accountMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                  <Avatar
                    src={user?.avatar_url}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.display_name || user?.username}
                  </span>
                </div>
              </Dropdown>
            </div>
          ) : (
            <Link to="/login">
              <SpotlightButton variant="accent" size="md">
                Login with Steam
              </SpotlightButton>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            className="md:hidden"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </Header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <Menu
            mode="vertical"
            selectedKeys={[getCurrentKey()]}
            items={navigation.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>{item.label}</Link>,
            }))}
          />
        </div>
      )}

      {/* Main Content */}
      <Content className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </Content>

      {/* Footer */}
      <Footer className="text-center bg-white border-t">
        © 2024 NexARK. All rights reserved.
      </Footer>
    </AntLayout>
  );
};

export default LayoutComponent;