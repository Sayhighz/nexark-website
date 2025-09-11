import React, { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useServers } from '../../hooks/useServers';
import Navbar from '../site/Navbar';
import StarBackground from '../site/StarBackground';

const LayoutComponent = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const { getServers } = useServers();

  useEffect(() => {
    if (isAuthenticated) {
      getServers();
    }
  }, [isAuthenticated, getServers]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      <StarBackground />
      
      <div className="relative z-20 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutComponent;