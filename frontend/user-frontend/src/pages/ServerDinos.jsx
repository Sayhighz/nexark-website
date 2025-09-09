import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Table, Tag, Spin, Alert, Avatar, Space, Button, Input, Select } from 'antd';
import { BugOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useServers } from '../hooks/useServers';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const ServerDinos = () => {
  const { serverId } = useParams();
  const { getServerByID, getServerDisplayInfo, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [dinos, setDinos] = useState([]);
  const [filteredDinos, setFilteredDinos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await getServerByID(serverId);
        setServer(serverData.data);
        
        const dinosData = await getServerDisplayInfo(serverId, 'dinos');
        setDinos(dinosData.data || []);
      } catch (err) {
        console.error('Failed to load server data:', err);
      }
    };

    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  // Mock dino data for demonstration
  const mockDinos = [
    {
      key: '1',
      name: 'Rex',
      species: 'Tyrannosaurus Rex',
      level: 150,
      type: 'Carnivore',
      tameable: true,
      rideable: true,
      breedable: true,
      location: 'Mountain Peak',
      rarity: 'Common',
      stats: {
        health: 1100,
        stamina: 420,
        oxygen: 150,
        food: 3000,
        weight: 500,
        damage: 62
      }
    },
    {
      key: '2',
      name: 'Argentavis',
      species: 'Argentavis Atrocollum',
      level: 224,
      type: 'Carnivore',
      tameable: true,
      rideable: true,
      breedable: true,
      location: 'Sky',
      rarity: 'Uncommon',
      stats: {
        health: 365,
        stamina: 750,
        oxygen: 150,
        food: 2000,
        weight: 400,
        damage: 25
      }
    },
    {
      key: '3',
      name: 'Ankylosaurus',
      species: 'Ankylosaurus Crassacutis',
      level: 135,
      type: 'Herbivore',
      tameable: true,
      rideable: true,
      breedable: true,
      location: 'Forest',
      rarity: 'Common',
      stats: {
        health: 700,
        stamina: 175,
        oxygen: 150,
        food: 3000,
        weight: 250,
        damage: 32
      }
    }
  ];

  useEffect(() => {
    let filtered = mockDinos;
    
    if (searchTerm) {
      filtered = filtered.filter(dino => 
        dino.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dino.species.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(dino => 
        dino.type.toLowerCase() === filterType.toLowerCase()
      );
    }
    
    setFilteredDinos(filtered);
  }, [searchTerm, filterType]);

  const columns = [
    {
      title: 'Dino',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
            🦕
          </Avatar>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">{record.species}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      sorter: (a, b) => a.level - b.level,
      render: (level) => (
        <Tag color={level >= 200 ? 'red' : level >= 150 ? 'orange' : 'blue'}>
          Level {level}
        </Tag>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Carnivore' ? 'red' : 'green'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity) => (
        <Tag color={rarity === 'Rare' ? 'purple' : rarity === 'Uncommon' ? 'orange' : 'default'}>
          {rarity}
        </Tag>
      ),
    },
    {
      title: 'Features',
      key: 'features',
      render: (_, record) => (
        <Space>
          {record.tameable && <Tag color="blue">Tameable</Tag>}
          {record.rideable && <Tag color="green">Rideable</Tag>}
          {record.breedable && <Tag color="purple">Breedable</Tag>}
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
        description="Failed to load server dinos"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <BugOutlined className="mr-3 text-blue-600" />
          {server?.server_name} - Dinos
        </Title>
        <Paragraph className="text-gray-600">
          Dinosaurs and creatures available on this ARK server
        </Paragraph>
      </div>

      {/* Dino Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockDinos.length}
          </div>
          <div className="text-gray-600">Total Species</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {mockDinos.filter(d => d.tameable).length}
          </div>
          <div className="text-gray-600">Tameable</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {mockDinos.filter(d => d.rideable).length}
          </div>
          <div className="text-gray-600">Rideable</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {mockDinos.filter(d => d.breedable).length}
          </div>
          <div className="text-gray-600">Breedable</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Search dinos..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            size="large"
            value={filterType}
            onChange={setFilterType}
            style={{ width: 200 }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">All Types</Option>
            <Option value="carnivore">Carnivore</Option>
            <Option value="herbivore">Herbivore</Option>
            <Option value="omnivore">Omnivore</Option>
          </Select>
        </div>
      </Card>

      {/* Dinos Table */}
      <Card title="Dino List">
        <Table
          columns={columns}
          dataSource={filteredDinos}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} dinos`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-gray-50 rounded">
                <Title level={5}>Base Stats</Title>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <strong>Health:</strong> {record.stats.health}
                  </div>
                  <div>
                    <strong>Stamina:</strong> {record.stats.stamina}
                  </div>
                  <div>
                    <strong>Oxygen:</strong> {record.stats.oxygen}
                  </div>
                  <div>
                    <strong>Food:</strong> {record.stats.food}
                  </div>
                  <div>
                    <strong>Weight:</strong> {record.stats.weight}
                  </div>
                  <div>
                    <strong>Damage:</strong> {record.stats.damage}%
                  </div>
                </div>
              </div>
            ),
            rowExpandable: (record) => true,
          }}
        />
      </Card>
    </div>
  );
};

export default ServerDinos;