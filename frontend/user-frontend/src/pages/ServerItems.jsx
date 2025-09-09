import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Table, Tag, Spin, Alert, Avatar, Space, Input, Select, Tabs } from 'antd';
import { GiftOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useServers } from '../hooks/useServers';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const ServerItems = () => {
  const { serverId } = useParams();
  const { getServerByID, getServerDisplayInfo, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await getServerByID(serverId);
        setServer(serverData.data);
        
        const itemsData = await getServerDisplayInfo(serverId, 'items');
        setItems(itemsData.data || []);
      } catch (err) {
        console.error('Failed to load server data:', err);
      }
    };

    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  // Mock item data for demonstration
  const mockItems = [
    {
      key: '1',
      name: 'Metal Pickaxe',
      category: 'Tools',
      rarity: 'Common',
      durability: 200,
      damage: 32,
      weight: 2.0,
      craftable: true,
      engram: true,
      level: 20,
      materials: ['Metal Ingot x15', 'Wood x10', 'Hide x10']
    },
    {
      key: '2',
      name: 'Assault Rifle',
      category: 'Weapons',
      rarity: 'Uncommon',
      durability: 100,
      damage: 280,
      weight: 3.5,
      craftable: true,
      engram: true,
      level: 39,
      materials: ['Metal Ingot x35', 'Cementing Paste x5', 'Polymer x20']
    },
    {
      key: '3',
      name: 'Flak Chestpiece',
      category: 'Armor',
      rarity: 'Common',
      durability: 120,
      armor: 200,
      weight: 20.0,
      craftable: true,
      engram: true,
      level: 56,
      materials: ['Metal Ingot x18', 'Hide x40', 'Fiber x25']
    },
    {
      key: '4',
      name: 'Stimulant',
      category: 'Consumables',
      rarity: 'Common',
      effect: 'Restores 40 Stamina',
      weight: 0.1,
      craftable: true,
      engram: true,
      level: 6,
      materials: ['Stimberry x5', 'Sparkpowder x2']
    },
    {
      key: '5',
      name: 'Industrial Forge',
      category: 'Structures',
      rarity: 'Rare',
      health: 10000,
      weight: 4.0,
      craftable: true,
      engram: true,
      level: 75,
      materials: ['Metal Ingot x2500', 'Cementing Paste x400', 'Crystal x150']
    }
  ];

  useEffect(() => {
    let filtered = mockItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, filterCategory]);

  const columns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#52c41a' }}>
            📦
          </Avatar>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">{record.category}</div>
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
        <Tag color="blue">Level {level}</Tag>
      )
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
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight) => `${weight} kg`
    },
    {
      title: 'Properties',
      key: 'properties',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.damage && <div>Damage: {record.damage}</div>}
          {record.armor && <div>Armor: {record.armor}</div>}
          {record.durability && <div>Durability: {record.durability}</div>}
          {record.health && <div>Health: {record.health}</div>}
          {record.effect && <div>Effect: {record.effect}</div>}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space>
          {record.craftable && <Tag color="green">Craftable</Tag>}
          {record.engram && <Tag color="blue">Engram</Tag>}
        </Space>
      ),
    },
  ];

  const categories = ['Tools', 'Weapons', 'Armor', 'Consumables', 'Structures'];

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
        description="Failed to load server items"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <GiftOutlined className="mr-3 text-blue-600" />
          {server?.server_name} - Items
        </Title>
        <Paragraph className="text-gray-600">
          Items, weapons, armor and structures available on this ARK server
        </Paragraph>
      </div>

      {/* Item Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockItems.length}
          </div>
          <div className="text-gray-600">Total Items</div>
        </Card>
        {categories.map((category, index) => (
          <Card key={category} className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockItems.filter(item => item.category === category).length}
            </div>
            <div className="text-gray-600">{category}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Search items..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            size="large"
            value={filterCategory}
            onChange={setFilterCategory}
            style={{ width: 200 }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">All Categories</Option>
            {categories.map(category => (
              <Option key={category} value={category.toLowerCase()}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Items Table */}
      <Card>
        <Tabs defaultActiveKey="all" size="large">
          <TabPane tab="All Items" key="all">
            <Table
              columns={columns}
              dataSource={filteredItems}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="p-4 bg-gray-50 rounded">
                    <Title level={5}>Crafting Materials</Title>
                    <div className="flex flex-wrap gap-2">
                      {record.materials.map((material, index) => (
                        <Tag key={index} color="blue">{material}</Tag>
                      ))}
                    </div>
                  </div>
                ),
                rowExpandable: (record) => record.materials && record.materials.length > 0,
              }}
            />
          </TabPane>
          {categories.map(category => (
            <TabPane tab={category} key={category}>
              <Table
                columns={columns}
                dataSource={mockItems.filter(item => item.category === category)}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="p-4 bg-gray-50 rounded">
                      <Title level={5}>Crafting Materials</Title>
                      <div className="flex flex-wrap gap-2">
                        {record.materials.map((material, index) => (
                          <Tag key={index} color="blue">{material}</Tag>
                        ))}
                      </div>
                    </div>
                  ),
                  rowExpandable: (record) => record.materials && record.materials.length > 0,
                }}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default ServerItems;