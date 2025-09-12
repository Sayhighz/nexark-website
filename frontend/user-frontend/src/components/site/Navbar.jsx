import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useAuthContext } from '../../contexts/AuthContext';
import SpotlightButton from '../ui/SpotlightButton';
import { MagneticText } from '../MagneticText';

const Navbar = () => {
  const { isAuthenticated, login, user, logout } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Transparent at top, solid on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
      if (!event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleServerSectionClick = (serverType, sectionId) => {
    setActiveDropdown(null);
    const targetPath = `/servers/${serverType}`;
    if (location.pathname === targetPath) {
      navigate('.', { state: { scrollToSection: sectionId }, replace: true });
    } else {
      navigate(targetPath, { state: { scrollToSection: sectionId } });
    }
  };

  const serverSections = [
    {
      name: 'Settings',
      id: 'settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Structures',
      id: 'structures',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Dinos',
      id: 'dinos',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Items',
      id: 'items',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Environment',
      id: 'environment',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Commands',
      id: 'commands',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Server Rules',
      id: 'server-rules',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <nav
      className={`${isScrolled ? 'fixed' : 'absolute'} top-0 left-0 w-full z-[9998] transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-black/80 border-b border-white/10' : 'bg-transparent'
      } px-6 py-4`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Only NEXARK Logo */}
        <div className="flex items-center">
          <RouterLink
            to="/"
            className="text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            <MagneticText
              body="NEXARK"
              as="div"
              className="text-2xl font-bold font-english-bold"
            >
              {(tokens) =>
                tokens.map((token, index) => (
                  <MagneticText.Token
                    key={index}
                    body={token}
                    className="inline-block cursor-pointer whitespace-pre"
                    min={400}
                    max={900}
                    threshold={150}
                  />
                ))
              }
            </MagneticText>
          </RouterLink>
        </div>

        {/* Right side - All menus and profile button */}
        <div className="flex items-center space-x-6">
          {/* Navigation Menus */}
          <div className="hidden md:flex items-center space-x-6">
            {/* X25 Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={() => toggleDropdown('x25')}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-medium font-english-medium"
              >
                <span>X25</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'x25' && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
                  {serverSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleServerSectionClick('x25', section.id)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                    >
                      <span className="text-gray-400">{section.icon}</span>
                      <span>{section.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* X100 Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={() => toggleDropdown('x100')}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-medium font-english-medium"
              >
                <span>X100</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'x100' && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
                  {serverSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleServerSectionClick('x100', section.id)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                    >
                      <span className="text-gray-400">{section.icon}</span>
                      <span>{section.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Store Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={() => toggleDropdown('store')}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-medium font-english-medium"
              >
                <span>Store</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'store' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
                  <RouterLink
                    to="/shop?server=x25"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    X25 Shop
                  </RouterLink>
                  <RouterLink
                    to="/shop?server=x100"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    X100 Shop
                  </RouterLink>
                  <RouterLink
                    to="/subscribe"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Subscribe
                  </RouterLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mobile-menu-container">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Profile/Sign in Button */}
          {isAuthenticated ? (
            <div className="dropdown-container relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium font-english-medium"
              >
                {/* User Avatar */}
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user?.display_name || user?.username || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.display_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                )}
                
                {/* User Name and Credits */}
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{user?.display_name || user?.username || 'User'}</span>
                  <span className="text-xs text-blue-400">฿{user?.credit_balance || 0}</span>
                </div>
                
                {/* Dropdown Arrow */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'profile' && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
                  <RouterLink
                    to="/account/credits"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>เติมเครดิต</span>
                  </RouterLink>
                  
                  <RouterLink
                    to="/account/transactions"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>ประวัติการเติมเงิน</span>
                  </RouterLink>
                  
                  <div className="border-t border-white/10"></div>
                  
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      logout();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <SpotlightButton
              onClick={login}
              variant="secondary"
              size="md"
              className="rounded-full font-english-semibold cursor-pointer"
            >
              Sign in
            </SpotlightButton>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-6 py-4 space-y-4">
            {/* X25 Section */}
            <div>
              <div className="text-white font-medium mb-2" style={{ fontFamily: 'SukhumvitSet' }}>X25 Server</div>
              <div className="space-y-2 pl-4">
                {serverSections.map((section) => (
                  <button
                    key={`x25-${section.id}`}
                    onClick={() => {
                      handleServerSectionClick('x25', section.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors w-full text-left py-2"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    <span className="text-gray-400">{section.icon}</span>
                    <span>{section.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* X100 Section */}
            <div>
              <div className="text-white font-medium mb-2" style={{ fontFamily: 'SukhumvitSet' }}>X100 Server</div>
              <div className="space-y-2 pl-4">
                {serverSections.map((section) => (
                  <button
                    key={`x100-${section.id}`}
                    onClick={() => {
                      handleServerSectionClick('x100', section.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors w-full text-left py-2"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    <span className="text-gray-400">{section.icon}</span>
                    <span>{section.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Store Section */}
            <div>
              <div className="text-white font-medium mb-2" style={{ fontFamily: 'SukhumvitSet' }}>Store</div>
              <div className="space-y-2 pl-4">
                <RouterLink
                  to="/shop?server=x25"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                  style={{ fontFamily: 'SukhumvitSet' }}
                >
                  X25 Shop
                </RouterLink>
                <RouterLink
                  to="/shop?server=x100"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                  style={{ fontFamily: 'SukhumvitSet' }}
                >
                  X100 Shop
                </RouterLink>
                <RouterLink
                  to="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                  style={{ fontFamily: 'SukhumvitSet' }}
                >
                  Subscribe
                </RouterLink>
              </div>
            </div>

            {/* Account Section for Mobile */}
            {isAuthenticated && (
              <div className="border-t border-white/10 pt-4">
                <div className="text-white font-medium mb-2" style={{ fontFamily: 'SukhumvitSet' }}>Account</div>
                <div className="space-y-2 pl-4">
                  <RouterLink
                    to="/account/credits"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white transition-colors py-2"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    เติมเครดิต
                  </RouterLink>
                  <RouterLink
                    to="/account/transactions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white transition-colors py-2"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    ประวัติการเติมเงิน
                  </RouterLink>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="block text-gray-300 hover:text-white transition-colors py-2 w-full text-left"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;