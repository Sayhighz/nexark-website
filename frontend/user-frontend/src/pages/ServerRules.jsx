import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, List, Tag, Spin, Alert, Divider, Space, Timeline } from 'antd';
import { 
  FileProtectOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  WarningOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { useServers } from '../hooks/useServers';

const { Title, Paragraph, Text } = Typography;

const ServerRules = () => {
  const { serverId } = useParams();
  const { getServerByID, getServerDisplayInfo, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await getServerByID(serverId);
        setServer(serverData.data);
        
        const rulesData = await getServerDisplayInfo(serverId, 'rules');
        setRules(rulesData.data || []);
      } catch (err) {
        console.error('Failed to load server data:', err);
      }
    };

    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  // Mock rules data for demonstration
  const serverRules = {
    general: [
      {
        id: 1,
        title: 'Respect All Players',
        description: 'Treat all players with respect. No harassment, bullying, or toxic behavior.',
        severity: 'high',
        punishment: 'Warning → Temporary Ban → Permanent Ban'
      },
      {
        id: 2,
        title: 'No Cheating or Exploiting',
        description: 'Use of cheats, hacks, exploits, or third-party software is strictly prohibited.',
        severity: 'critical',
        punishment: 'Immediate Permanent Ban'
      },
      {
        id: 3,
        title: 'English Only in Global Chat',
        description: 'Please use English in global chat to ensure all players can communicate.',
        severity: 'low',
        punishment: 'Warning → Temporary Mute'
      },
      {
        id: 4,
        title: 'No Spam or Advertising',
        description: 'Do not spam chat or advertise other servers/services.',
        severity: 'medium',
        punishment: 'Warning → Temporary Mute → Temporary Ban'
      }
    ],
    building: [
      {
        id: 5,
        title: 'No Foundation Spam',
        description: 'Do not place foundations to claim large areas without building on them.',
        severity: 'medium',
        punishment: 'Structure Removal → Warning → Temporary Ban'
      },
      {
        id: 6,
        title: 'No Building in Resource Areas',
        description: 'Do not build structures that block resource spawns or important areas.',
        severity: 'medium',
        punishment: 'Structure Removal → Warning'
      },
      {
        id: 7,
        title: 'Reasonable Base Size',
        description: 'Keep your base size reasonable. Massive structures may be removed.',
        severity: 'low',
        punishment: 'Warning → Structure Removal'
      }
    ],
    pvp: [
      {
        id: 8,
        title: 'No Offline Raiding',
        description: 'Raiding is only allowed when the tribe has at least one member online.',
        severity: 'high',
        punishment: 'Warning → Temporary Ban → Permanent Ban'
      },
      {
        id: 9,
        title: 'No Griefing New Players',
        description: 'Do not target or repeatedly kill players under level 20.',
        severity: 'high',
        punishment: 'Warning → Temporary Ban'
      },
      {
        id: 10,
        title: 'Raid Cooldown Period',
        description: 'After raiding a base, wait 24 hours before raiding the same tribe again.',
        severity: 'medium',
        punishment: 'Warning → Temporary Ban'
      }
    ]
  };

  const punishmentSystem = [
    {
      color: 'blue',
      children: (
        <div>
          <Title level={4}>First Offense</Title>
          <Text>Warning issued to player with explanation of rule violation</Text>
        </div>
      ),
    },
    {
      color: 'orange',
      children: (
        <div>
          <Title level={4}>Second Offense</Title>
          <Text>Temporary ban (1-7 days) depending on severity</Text>
        </div>
      ),
    },
    {
      color: 'red',
      children: (
        <div>
          <Title level={4}>Third Offense</Title>
          <Text>Extended ban (7-30 days) or permanent ban for severe violations</Text>
        </div>
      ),
    },
    {
      color: 'gray',
      children: (
        <div>
          <Title level={4}>Appeal Process</Title>
          <Text>Players can appeal bans through our Discord server</Text>
        </div>
      ),
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <CloseCircleOutlined />;
      case 'high': return <WarningOutlined />;
      case 'medium': return <InfoCircleOutlined />;
      case 'low': return <CheckCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

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
        description="Failed to load server rules"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <FileProtectOutlined className="mr-3 text-blue-600" />
          {server?.server_name} - Server Rules
        </Title>
        <Paragraph className="text-gray-600">
          Please read and follow all server rules to ensure a fair and enjoyable experience for everyone.
        </Paragraph>
      </div>

      {/* Important Notice */}
      <Alert
        message="Important Notice"
        description="By playing on this server, you agree to follow all rules listed below. Ignorance of the rules is not an excuse for violations."
        type="warning"
        showIcon
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Rules */}
        <Card title="General Rules" className="h-fit">
          <List
            dataSource={serverRules.general}
            renderItem={(rule) => (
              <List.Item>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <Title level={5} className="mb-0 flex items-center">
                      {getSeverityIcon(rule.severity)}
                      <span className="ml-2">{rule.title}</span>
                    </Title>
                    <Tag color={getSeverityColor(rule.severity)}>
                      {rule.severity.toUpperCase()}
                    </Tag>
                  </div>
                  <Paragraph className="text-gray-600 mb-2">
                    {rule.description}
                  </Paragraph>
                  <Text type="secondary" className="text-sm">
                    <strong>Punishment:</strong> {rule.punishment}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* Building Rules */}
        <Card title="Building Rules" className="h-fit">
          <List
            dataSource={serverRules.building}
            renderItem={(rule) => (
              <List.Item>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <Title level={5} className="mb-0 flex items-center">
                      {getSeverityIcon(rule.severity)}
                      <span className="ml-2">{rule.title}</span>
                    </Title>
                    <Tag color={getSeverityColor(rule.severity)}>
                      {rule.severity.toUpperCase()}
                    </Tag>
                  </div>
                  <Paragraph className="text-gray-600 mb-2">
                    {rule.description}
                  </Paragraph>
                  <Text type="secondary" className="text-sm">
                    <strong>Punishment:</strong> {rule.punishment}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* PvP Rules */}
        <Card title="PvP Rules" className="h-fit">
          <List
            dataSource={serverRules.pvp}
            renderItem={(rule) => (
              <List.Item>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <Title level={5} className="mb-0 flex items-center">
                      {getSeverityIcon(rule.severity)}
                      <span className="ml-2">{rule.title}</span>
                    </Title>
                    <Tag color={getSeverityColor(rule.severity)}>
                      {rule.severity.toUpperCase()}
                    </Tag>
                  </div>
                  <Paragraph className="text-gray-600 mb-2">
                    {rule.description}
                  </Paragraph>
                  <Text type="secondary" className="text-sm">
                    <strong>Punishment:</strong> {rule.punishment}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* Punishment System */}
        <Card title="Punishment System" className="h-fit">
          <Timeline items={punishmentSystem} />
          
          <Divider />
          
          <div className="bg-gray-50 p-4 rounded">
            <Title level={5}>Severity Levels</Title>
            <Space direction="vertical" className="w-full">
              <div className="flex items-center">
                <Tag color="red">CRITICAL</Tag>
                <Text>Immediate permanent ban</Text>
              </div>
              <div className="flex items-center">
                <Tag color="orange">HIGH</Tag>
                <Text>Serious violations, escalating punishments</Text>
              </div>
              <div className="flex items-center">
                <Tag color="yellow">MEDIUM</Tag>
                <Text>Moderate violations, warnings and temporary bans</Text>
              </div>
              <div className="flex items-center">
                <Tag color="blue">LOW</Tag>
                <Text>Minor violations, usually warnings</Text>
              </div>
            </Space>
          </div>
        </Card>
      </div>

      {/* Contact Information */}
      <Card title="Need Help?" className="mt-6">
        <Paragraph>
          If you have questions about the rules or need to report a violation, please contact our staff:
        </Paragraph>
        <Space direction="vertical">
          <Text><strong>Discord:</strong> Join our Discord server for support</Text>
          <Text><strong>In-Game:</strong> Use /admin command to contact online administrators</Text>
          <Text><strong>Appeals:</strong> Submit ban appeals through our Discord server</Text>
        </Space>
      </Card>
    </div>
  );
};

export default ServerRules;