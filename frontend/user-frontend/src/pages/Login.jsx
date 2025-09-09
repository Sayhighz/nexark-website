import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Typography, Row, Col, Spin, Alert } from 'antd';
import {  DesktopOutlined, ShoppingOutlined, PlayCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuthContext } from '../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;

const Login = () => {
  const { login, isAuthenticated, loading, error } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/servers';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Title level={1} className="mb-2">Welcome to NexARK</Title>
          <Paragraph className="text-gray-600">
            Your ARK Survival Evolved Server Management Platform
          </Paragraph>
        </div>

        {/* Login Card */}
        <Card className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <PlayCircleOutlined className="text-3xl text-blue-600" />
          </div>

          <Title level={3} className="mb-2">
            Sign in with Steam
          </Title>
          <Paragraph className="text-gray-600 mb-6">
            Connect your Steam account to access ARK servers and manage your gaming experience
          </Paragraph>

          {/* Error Message */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {/* Login Button */}
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            onClick={handleLogin}
            className="w-full"
          >
            Continue with Steam
          </Button>
        </Card>

        {/* Features */}
        <Row gutter={[16, 16]} className="text-center">
          <Col span={8}>
            <Card size="small" hoverable>
              <DesktopOutlined className="text-2xl mb-2" />
              <Title level={5} className="mb-1">Server Management</Title>
              <Text type="secondary" className="text-sm">Access premium ARK servers</Text>
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small" hoverable>
              <ShoppingOutlined className="text-2xl mb-2" />
              <Title level={5} className="mb-1">In-Game Shop</Title>
              <Text type="secondary" className="text-sm">Purchase items and boosts</Text>
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small" hoverable>
              <PlayCircleOutlined className="text-2xl mb-2" />
              <Title level={5} className="mb-1">Gaming Features</Title>
              <Text type="secondary" className="text-sm">Spin wheel and daily rewards</Text>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <div className="text-center">
          <Text type="secondary" className="text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;