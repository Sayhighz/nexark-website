import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { ThunderboltOutlined, ShoppingOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const FeatureCard = ({ icon, title, description, variant = 1 }) => {
  const gradients = {
    1: 'from-gray-800/80 to-blue-900/80 border-blue-500/30 hover:border-blue-400/50',
    2: 'from-gray-800/80 to-blue-800/80 border-blue-600/30 hover:border-blue-500/50',
    3: 'from-gray-800/80 to-blue-700/80 border-blue-700/30 hover:border-blue-600/50',
  };

  return (
    <Card
      className={`text-center h-full bg-gradient-to-br ${gradients[variant]} backdrop-blur-sm transition-all duration-300`}
      hoverable
    >
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
        {icon}
      </div>
      <Title level={3} className="text-white mb-4">
        {title}
      </Title>
      <Paragraph className="text-gray-200">{description}</Paragraph>
    </Card>
  );
};

const Features = () => {
  return (
    <section className="relative z-20 px-6 py-24 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Title level={2} className="text-white text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Why Choose NexARK?
            </span>
          </Title>
          <Paragraph className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the most advanced ARK gaming platform in the galaxy
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <FeatureCard
              icon={<ThunderboltOutlined className="text-3xl text-white" />}
              title="Warp Speed Performance"
              description="Quantum-optimized servers with zero-lag technology for the ultimate gaming experience."
              variant={1}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard
              icon={<ShoppingOutlined className="text-3xl text-white" />}
              title="Galactic Marketplace"
              description="Exclusive items, boosts, and resources to dominate the universe."
              variant={2}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard
              icon={<PlayCircleOutlined className="text-3xl text-white" />}
              title="Cosmic Adventures"
              description="Daily missions, spin wheel, and stellar rewards across the galaxy."
              variant={3}
            />
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Features;