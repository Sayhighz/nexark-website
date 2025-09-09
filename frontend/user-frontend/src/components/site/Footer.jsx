import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';

const { Text } = Typography;

const Footer = () => {
  return (
    <footer className="relative z-20 px-6 py-12 bg-black/80 backdrop-blur-sm border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/images/NEXLogo.png" alt="NexARK Logo" className="h-16 w-auto" />
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/servers" className="text-gray-300 hover:text-white transition-colors">
              Servers
            </Link>
            <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">
              Shop
            </Link>
            <Link to="/games" className="text-gray-300 hover:text-white transition-colors">
              Games
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-700/50 mt-8 pt-8 text-center">
          <Text className="text-gray-300">© 2024 NexARK Galactic Command. All rights reserved.</Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;