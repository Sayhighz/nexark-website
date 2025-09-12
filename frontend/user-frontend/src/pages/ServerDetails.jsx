import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useServers } from '../hooks/useServers';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StarBackground from '../components/site/StarBackground';
import Navbar from '../components/site/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerHero, ServerTabs, ServerSectionContent } from '../components/server/ServerDetailsParts';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Table,
  List,
  Badge,
  Divider,
  Statistic,
  Tag,
  Space,
  Alert,
  BackTop,
  Affix,
  Button,
  Spin
} from 'antd';
import {
  SettingOutlined,
  BookOutlined,
  GiftOutlined,
  BugOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  CodeOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const ServerDetails = () => {
  const { t, i18n } = useTranslation();
  const { serverId } = useParams();
  const location = useLocation();
  const { getServerByID, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [displayInfos, setDisplayInfos] = useState({});
  const [activeTab, setActiveTab] = useState('settings');
  const [sectionLoading, setSectionLoading] = useState(false);

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('server.sections.settings')
    },
    {
      key: 'structures',
      icon: <DatabaseOutlined />,
      label: t('server.sections.structures')
    },
    {
      key: 'dinos',
      icon: <BugOutlined />,
      label: t('server.sections.dinos')
    },
    {
      key: 'items',
      icon: <GiftOutlined />,
      label: t('server.sections.items')
    },
    {
      key: 'environment',
      icon: <EnvironmentOutlined />,
      label: t('server.sections.environment')
    },
    {
      key: 'commands',
      icon: <CodeOutlined />,
      label: t('server.sections.commands')
    },
    {
      key: 'rules',
      icon: <BookOutlined />,
      label: t('server.sections.rules')
    }
  ];

  // Updated server settings data (core gameplay settings only)
  // Updated structures section with moved settings from server config
  // Updated comprehensive dinos section
  // PvP Calendar for Environment section
  // Commands organized by categories with correct information
  // Server Rules section
  // Updated loot/items settings with comprehensive weapon, armor, and crafting data
  // Handle scroll to section from state
  useEffect(() => {
    if (location.state && location.state.scrollToSection) {
      const targetSection = location.state.scrollToSection;
      // Map server-rules to rules for consistency
      const sectionKey = targetSection === 'server-rules' ? 'rules' : targetSection;
      
      // Check if the section exists in menuItems
      const validSection = menuItems.find(item => item.key === sectionKey);
      if (validSection) {
        setActiveTab(sectionKey);
      }
      
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setSectionLoading(true);
        const serverData = await getServerByID(serverId);
        console.log('Server Data:', serverData);
        console.log('Rules Data:', serverData?.details?.rules);
        setServer(serverData);

        const d = {
          settings: Array.isArray(serverData?.details?.settings) ? serverData.details.settings : [],
          structures: Array.isArray(serverData?.details?.structures) ? serverData.details.structures : [],
          dinos: serverData?.details?.dinos || {},
          items: serverData?.details?.items || {},
          environment: Array.isArray(serverData?.details?.environment) ? serverData.details.environment : [],
          commands: Array.isArray(serverData?.details?.commands) ? serverData.details.commands : [],
          rules: Array.isArray(serverData?.details?.rules) ? serverData.details.rules : [],
        };

        setDisplayInfos({
          settings: d.settings,
          structures: d.structures,
          dinos: d.dinos,
          items: d.items,
          environment: d.environment,
          commands: d.commands,
          rules: d.rules,
        });
      } catch {
        // error handled by hook
      } finally {
        setSectionLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
    // Re-fetch when language changes to pull localized details from backend
  }, [serverId, getServerByID, i18n.language]);

  if (loading || sectionLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <StarBackground />
        <Loading size="lg" message="Loading server details..." />
      </div>
    );
  }
  
  if (error && !server) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <StarBackground />
        <ErrorMessage error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      <StarBackground />
      
      {/* Hero */}
      <ServerHero title={`${t('server.sections.settings')} ${server?.server_name || 'NEXArk'}`} />
  
      {/* Navigation and Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Navigation Tabs */}
          <ServerTabs menuItems={menuItems} setActiveTab={setActiveTab} activeTab={activeTab} />

          {/* Main Content */}
          <Content style={{ background: 'transparent' }}>
            <div className="mb-6">
              <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
                {menuItems.find(c => c.key === activeTab)?.label}
              </Title>
              <div className="h-1 w-20 bg-blue-500 rounded"></div>
            </div>

              <ServerSectionContent
                activeTab={activeTab}
                displayInfos={displayInfos}
                menuItems={menuItems}
              />
          </Content>
        </div>
      </div>
  
      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
      
      <BackTop />
    </div>
  );
};

export default ServerDetails;