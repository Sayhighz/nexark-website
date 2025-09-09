import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Tag, Spin, Alert } from 'antd';
import { SoundOutlined, FileTextOutlined } from '@ant-design/icons';
import { useContent } from '../../hooks/useContent';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const NewsCard = ({ title, summary, createdAt }) => (
  <Card hoverable className="h-full">
    <div className="flex items-center mb-2">
      <FileTextOutlined className="text-blue-600 mr-2" />
      <Text type="secondary" className="text-sm">{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</Text>
    </div>
    <Title level={4} className="mb-2">{title}</Title>
    <Paragraph className="text-gray-600 line-clamp-3">{summary}</Paragraph>
  </Card>
);

const AnnouncementCard = ({ title, type, content }) => (
  <Card hoverable className="h-full">
    <div className="flex items-center mb-2">
      <SoundOutlined className="text-blue-600 mr-2" />
      <Tag color={type === 'maintenance' ? 'orange' : type === 'event' ? 'green' : 'blue'}>
        {String(type || 'info').toUpperCase()}
      </Tag>
    </div>
    <Title level={4} className="mb-2">{title}</Title>
    <Paragraph className="text-gray-600 line-clamp-3">{content}</Paragraph>
  </Card>
);

/**
 * NewsSection
 * - Shows featured news and latest active announcements on the homepage.
 * - Keeps API integration behind useContent hook.
 */
const NewsSection = () => {
  const { getFeaturedNews, getAnnouncements, loading, error } = useContent();
  const [featured, setFeatured] = useState([]);
  const [anncs, setAnncs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const f = await getFeaturedNews(3);
        setFeatured(Array.isArray(f) ? f : []);
      } catch (_) {}
      try {
        const a = await getAnnouncements({ limit: 3, only_active: true });
        setAnncs(a?.announcements || []);
      } catch (_) {}
    };
    load();
  }, [getFeaturedNews, getAnnouncements]);

  return (
    <section className="relative z-20 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Title level={2} className="text-white text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              News & Announcements
            </span>
          </Title>
          <Paragraph className="text-gray-300">
            Latest updates, events, and important information from our ARK servers
          </Paragraph>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        )}

        {error && (
          <Alert
            className="mb-6"
            type="warning"
            message="Some content failed to load"
            description={error}
            showIcon
          />
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Featured News" className="bg-white/80 backdrop-blur-sm">
              {featured.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No featured news available</div>
              ) : (
                <Row gutter={[16, 16]}>
                  {featured.map((n) => (
                    <Col xs={24} md={12} key={n?.news_id || n?.id}>
                      <NewsCard
                        title={n?.title || 'News'}
                        summary={n?.summary || n?.content || ''}
                        createdAt={n?.created_at}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Announcements" className="bg-white/80 backdrop-blur-sm h-full">
              {anncs.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No active announcements</div>
              ) : (
                <Row gutter={[16, 16]}>
                  {anncs.map((a) => (
                    <Col xs={24} key={a?.announcement_id || a?.id}>
                      <AnnouncementCard
                        title={a?.title || 'Announcement'}
                        type={a?.type}
                        content={a?.content}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-8">
          <Link to="/servers" className="text-blue-200 hover:text-white">
            View servers and start playing →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;