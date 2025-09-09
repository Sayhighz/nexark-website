import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import {
  DownOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
  BugOutlined,
  GiftOutlined,
  FileProtectOutlined,
  BookOutlined,
  CloudServerOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useServers } from '../../hooks/useServers';

const Navbar = () => {
  const { isAuthenticated } = useAuthContext();
  const { servers, getServers } = useServers();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const findServerByType = (typeKey) => {
    const key = String(typeKey).toLowerCase();
    return (servers || []).find(
      (s) =>
        (s.server_type && String(s.server_type).toLowerCase().includes(key)) ||
        (s.server_name && String(s.server_name).toLowerCase().includes(key))
    );
  };

  const buildTypeMenuItems = (typeKey) => {
    const s = findServerByType(typeKey);
    const q = typeKey === 'x25' ? 'x25' : 'x100';
    return [
      {
        key: `${typeKey}-ips`,
        icon: <CloudServerOutlined />,
        label: <Link to={`/servers?type=${q}`}>Server IPs</Link>,
      },
      {
        key: `${typeKey}-rules`,
        icon: <BookOutlined />,
        label: s ? <Link to={`/servers/${s.server_id}/rules`}>Rulebook</Link> : <Link to={`/servers?type=${q}`}>Rulebook</Link>,
      },
      {
        key: `${typeKey}-settings`,
        icon: <SettingOutlined />,
        label: s ? <Link to={`/servers/${s.server_id}/settings`}>Settings</Link> : <Link to={`/servers?type=${q}`}>Settings</Link>,
      },
      {
        key: `${typeKey}-drops`,
        icon: <GiftOutlined />,
        label: s ? <Link to={`/servers/${s.server_id}/items`}>Drops / Boss Loot / OSDs</Link> : <Link to={`/servers?type=${q}`}>Drops / Boss Loot / OSDs</Link>,
      },
      {
        key: `${typeKey}-caves`,
        icon: <CompassOutlined />,
        label: s ? <Link to={`/servers/${s.server_id}/dinos`}>Cave Changes</Link> : <Link to={`/servers?type=${q}`}>Cave Changes</Link>,
      },
    ];
  };

  const x25MenuItems = buildTypeMenuItems('x25');
  const x100MenuItems = buildTypeMenuItems('x100');

  // Ensure servers are loaded for dropdown
  useEffect(() => {
    if (!servers || servers.length === 0) {
      getServers().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transparent at top, solid on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const serverMenuItems = (servers || []).map((server) => ({
    key: String(server.server_id),
    label: (
      <span>
        <DesktopOutlined className="mr-2" />
        {server.server_name}
      </span>
    ),
    children: [
      {
        key: `${server.server_id}-settings`,
        icon: <SettingOutlined />,
        label: <Link to={`/servers/${server.server_id}/settings`}>Server Settings</Link>,
      },
      {
        key: `${server.server_id}-players`,
        icon: <UserOutlined />,
        label: <Link to={`/servers/${server.server_id}/players`}>Players</Link>,
      },
      {
        key: `${server.server_id}-dinos`,
        icon: <BugOutlined />,
        label: <Link to={`/servers/${server.server_id}/dinos`}>Dinos</Link>,
      },
      {
        key: `${server.server_id}-items`,
        icon: <GiftOutlined />,
        label: <Link to={`/servers/${server.server_id}/items`}>Items</Link>,
      },
      {
        key: `${server.server_id}-rules`,
        icon: <FileProtectOutlined />,
        label: <Link to={`/servers/${server.server_id}/rules`}>Rules</Link>,
      },
    ],
  }));

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-colors ${
        isScrolled ? 'backdrop-blur-md bg-black/80 border-b border-white/10' : 'bg-transparent'
      } px-6 py-4`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-white flex items-center">
            <span className="text-blue-400">⭐</span>
            <span className="ml-2">NEXArk</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">

            {/* X25 mega-menu */}
            <Dropdown menu={{ items: x25MenuItems }} trigger={['hover']} placement="bottomLeft">
              <a className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer" onClick={(e) => e.preventDefault()}>
                X25 <DownOutlined />
              </a>
            </Dropdown>

            {/* X100 mega-menu */}
            <Dropdown menu={{ items: x100MenuItems }} trigger={['hover']} placement="bottomLeft">
              <a className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer" onClick={(e) => e.preventDefault()}>
                X100 <DownOutlined />
              </a>
            </Dropdown>

            <Link to="/shop" className="text-gray-300 hover:text-white transition-colors font-medium">
              Store
            </Link>
            <Link to="/games" className="text-gray-300 hover:text-white transition-colors font-medium">
              Gacha
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link to="/profile" className="inline-flex items-center">
              <span className="rounded-full px-6 py-2 text-white font-semibold bg-gradient-to-r from-red-500 to-orange-500 shadow hover:opacity-90 transition">
                Profile
              </span>
            </Link>
          ) : (
            <Link to="/login" className="inline-flex items-center">
              <span className="rounded-full px-6 py-2 text-white font-semibold bg-gradient-to-r from-red-500 to-orange-500 shadow hover:opacity-90 transition">
                Sign in
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;