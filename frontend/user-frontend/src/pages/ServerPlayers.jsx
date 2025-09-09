import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Table, Tag, Spin, Alert, Avatar, Space, Button } from 'antd';
import { UserOutlined, CrownOutlined, EyeOutlined } from '@ant-design/icons';
import { useServers } from '../hooks/useServers';

const { Title, Paragraph } = Typography;

const ServerPlayers = () => {
  const { serverId } = useParams();
  const { getServerByID, getServerDisplayInfo, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await getServerByID(serverId);
        setServer(serverData.data);
        
        const playersData = await getServerDisplayInfo(serverId, 'players');
        setPlayers(playersData.data || []);
      } catch (err) {
        console.error('Failed to load server data:', err);
      }
    };

    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  // Mock player data for demonstration
  const mockPlayers = [
    {
      key: '1',
      name: 'DragonSlayer123',
      steamId: '76561198123456789',
      level: 105,
      tribe: 'Alpha Survivors',
      status: 'online',
      playtime: '245h 30m',
      lastSeen: 'Now',
      isAdmin: false
    },
    {
      key: '2',
      name: 'ArkMaster',
      steamId: '76561198987654321',
      level: 87,
      tribe: 'Dino Tamers',
      status: 'offline',
      playtime: '189h 15m',
      lastSeen: '2 hours ago',
      isAdmin: true
    },
    {
      key: '3',
      name: 'SurvivalExpert',
      steamId: '76561198456789123',
      level: 92,
      tribe: 'Base Builders',
      status: 'online',
      playtime: '312h 45m',
      lastSeen: 'Now',
      isAdmin: false
    }
  ];

  const columns = [
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">
              {text}
              {record.isAdmin && <CrownOutlined className="ml-2 text-yellow-500" />}
            </div>
            <div className="text-gray-500 text-sm">Level {record.level}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tribe',
      dataIndex: 'tribe',
      key: 'tribe',
      render: (tribe) => tribe || 'No Tribe'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'online' ? 'green' : 'default'}>
          {status === 'online' ? 'Online' : 'Offline'}
        </Tag>
      ),
    },
    {
      title: 'Playtime',
      dataIndex: 'playtime',
      key: 'playtime',
    },
    {
      title: 'Last Seen',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>
            View Profile
          </Button>
        </Space>
      ),
    },
  ];

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
        description="Failed to load server players"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <UserOutlined className="mr-3 text-blue-600" />
          {server?.server_name} - Players
        </Title>
        <Paragraph className="text-gray-600">
          Player list for this ARK server
        </Paragraph>
      </div>

      {/* Players Table */}
      <Card title="Player List">
        <Table
          columns={columns}
          dataSource={mockPlayers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} players`,
          }}
        />
      </Card>
    </div>
  );
};

export default ServerPlayers;