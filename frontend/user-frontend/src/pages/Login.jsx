import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Row, Col, Spin, Alert } from 'antd';
import {  DesktopOutlined, ShoppingOutlined, PlayCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuthContext } from '../contexts/AuthContext';
import SpotlightButton from '../components/ui/SpotlightButton';
import StarBackground from '../components/site/StarBackground';
import Navbar from '../components/site/Navbar';
import { SpotlightCard } from '../components/ui/SpotlightCard';

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
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Navbar />
        <StarBackground />
        <div className="relative z-20 pt-20 flex items-center justify-center min-h-screen">
          <Spin size="large" />
        </div>
      </div>
    );
  }

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
                Welcome to NexARK
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Your ARK Survival Evolved Server Management Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-lg space-y-8">
              {/* Login Card */}
              <SpotlightCard
                hsl
                hslMin={200}
                hslMax={280}
                className="w-full rounded-xl bg-white/10 p-8 shadow-xl shadow-white/2.5"
              >
                <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
                <div className="relative text-center">
                  <div className="mx-auto h-16 w-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-600/30">
                    <PlayCircleOutlined className="text-3xl text-blue-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Sign in with Steam
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Connect your Steam account to access ARK servers and manage your gaming experience
                  </p>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Login Button */}
                  <SpotlightButton
                    variant="accent"
                    size="lg"
                    onClick={handleLogin}
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <LoginOutlined />
                    Continue with Steam
                  </SpotlightButton>
                </div>
              </SpotlightCard>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SpotlightCard
                  hsl
                  hslMin={180}
                  hslMax={220}
                  className="w-full rounded-lg bg-white/10 p-4 shadow-lg"
                >
                  <div className="absolute inset-px rounded-[calc(theme(borderRadius.lg)-1px)] bg-zinc-800/50"></div>
                  <div className="relative text-center">
                    <DesktopOutlined className="text-2xl mb-2 text-blue-400" />
                    <h5 className="text-white font-semibold mb-1">Server Management</h5>
                    <p className="text-gray-400 text-sm">Access premium ARK servers</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard
                  hsl
                  hslMin={250}
                  hslMax={290}
                  className="w-full rounded-lg bg-white/10 p-4 shadow-lg"
                >
                  <div className="absolute inset-px rounded-[calc(theme(borderRadius.lg)-1px)] bg-zinc-800/50"></div>
                  <div className="relative text-center">
                    <ShoppingOutlined className="text-2xl mb-2 text-purple-400" />
                    <h5 className="text-white font-semibold mb-1">In-Game Shop</h5>
                    <p className="text-gray-400 text-sm">Purchase items and boosts</p>
                  </div>
                </SpotlightCard>

                <SpotlightCard
                  hsl
                  hslMin={120}
                  hslMax={160}
                  className="w-full rounded-lg bg-white/10 p-4 shadow-lg"
                >
                  <div className="absolute inset-px rounded-[calc(theme(borderRadius.lg)-1px)] bg-zinc-800/50"></div>
                  <div className="relative text-center">
                    <PlayCircleOutlined className="text-2xl mb-2 text-green-400" />
                    <h5 className="text-white font-semibold mb-1">Gaming Features</h5>
                    <p className="text-gray-400 text-sm">Spin wheel and daily rewards</p>
                  </div>
                </SpotlightCard>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Login;