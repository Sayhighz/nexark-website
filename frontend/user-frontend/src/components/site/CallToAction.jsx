import React from 'react';
import { Typography } from 'antd';
import { RocketOutlined, PlayCircleOutlined, DesktopOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import SpotlightButton from '../ui/SpotlightButton';

const { Title, Paragraph } = Typography;

const CallToAction = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <section className="relative z-20 px-6 py-24 bg-black/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center">
        <Title level={2} className="text-white text-4xl md:text-5xl font-bold mb-8">
          Ready to explore the{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            cosmos?
          </span>
        </Title>
        <Paragraph className="text-xl text-gray-100 mb-12 max-w-3xl mx-auto">
          Join thousands of survivors in the ultimate ARK adventure. Your journey awaits among the stars.
        </Paragraph>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/servers">
              <SpotlightButton
                size="xl"
                variant="accent"
                className="inline-flex items-center gap-2"
              >
                <PlayCircleOutlined />
                Browse Servers
              </SpotlightButton>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <SpotlightButton
                  size="xl"
                  variant="accent"
                  className="inline-flex items-center gap-2"
                >
                  <RocketOutlined />
                  Start Your Journey
                </SpotlightButton>
              </Link>
              <Link to="/servers">
                <SpotlightButton
                  size="xl"
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                >
                  <DesktopOutlined />
                  Explore Servers
                </SpotlightButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;