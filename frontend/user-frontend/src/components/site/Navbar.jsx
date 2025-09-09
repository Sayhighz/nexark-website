import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown } from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  GiftOutlined,
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


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-colors ${
        isScrolled ? 'backdrop-blur-md bg-black/80 border-b border-white/10' : 'bg-transparent'
      } px-6 py-4`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <Dropdown menu={{ items: x25MenuItems }} trigger={['hover']} placement="bottomLeft">
              <a className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer font-english-medium" onClick={(e) => e.preventDefault()}>
                X25 <DownOutlined />
              </a>
            </Dropdown>

            <Dropdown menu={{ items: x100MenuItems }} trigger={['hover']} placement="bottomLeft">
              <a className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer font-english-medium" onClick={(e) => e.preventDefault()}>
                X100 <DownOutlined />
              </a>
            </Dropdown>

            <Link to="/shop" className="text-gray-300 hover:text-white transition-colors font-medium font-english-medium">
              Store
            </Link>
            <Link to="/games" className="text-gray-300 hover:text-white transition-colors font-medium font-english-medium">
              Gacha
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link to="/profile" className="inline-flex items-center">
              <span className="rounded-full px-6 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-english-semibold">
                Profile
              </span>
            </Link>
          ) : (
            <Link to="/login" className="inline-flex items-center">
              <span className="rounded-full px-6 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-english-semibold">
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