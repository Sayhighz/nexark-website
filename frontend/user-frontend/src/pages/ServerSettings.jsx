import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, Spin, Alert, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useServers } from '../hooks/useServers';

const { Title, Paragraph } = Typography;

const ServerSettings = () => {
  const { serverId } = useParams();
  const { getServerByID, getServerDisplayInfo, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await getServerByID(serverId);
        setServer(serverData.data);
        
        const settingsData = await getServerDisplayInfo(serverId, 'settings');
        setSettings(settingsData.data || []);
      } catch (err) {
        console.error('Failed to load server data:', err);
      }
    };

    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load server settings"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <SettingOutlined className="mr-3 text-blue-600" />
          {server?.server_name} - Server Settings
        </Title>
        <Paragraph className="text-gray-600">
          Configuration and settings for this ARK server
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* Server Basic Info */}
        <Col xs={24} lg={12}>
          <Card title="Server Information" className="h-full">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Server Name">
                {server?.server_name}
              </Descriptions.Item>
              <Descriptions.Item label="Server Type">
                {server?.server_type}
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {server?.ip_address}
              </Descriptions.Item>
              <Descriptions.Item label="Port">
                {server?.port}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Server Settings */}
        <Col xs={24} lg={12}>
          <Card title="Game Settings" className="h-full">
            {settings.length > 0 ? (
              <Descriptions column={1} bordered>
                {settings.map((setting, index) => (
                  <Descriptions.Item key={index} label={setting.info_key}>
                    {setting.info_value}
                    {setting.description && (
                      <div className="text-gray-500 text-sm mt-1">
                        {setting.description}
                      </div>
                    )}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <SettingOutlined className="text-4xl mb-4" />
                <p>No settings data available</p>
              </div>
            )}
          </Card>
        </Col>

        {/* Additional Settings Cards */}
        <Col xs={24}>
          <Card title="Rate Multipliers">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">25x</div>
                  <div className="text-gray-600">Taming Speed</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">25x</div>
                  <div className="text-gray-600">Harvesting</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">25x</div>
                  <div className="text-gray-600">XP Gain</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">25x</div>
                  <div className="text-gray-600">Breeding</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServerSettings;