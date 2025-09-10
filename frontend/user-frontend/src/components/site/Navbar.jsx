import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useAuthContext } from '../../contexts/AuthContext';
import SpotlightButton from '../ui/SpotlightButton';

const Navbar = () => {
  const { isAuthenticated } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Transparent at top, solid on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Navbar remains visible at all times

  // Removed scroll hide/show logic to keep navbar always visible


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9998] transition-all duration-300 will-change-transform transform-gpu ${
        isScrolled ? 'backdrop-blur-md bg-black/80 border-b border-white/10' : 'bg-transparent'
      } px-6 py-4`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <RouterLink to="/servers/x25" className="text-gray-300 hover:text-white transition-colors font-medium font-english-medium">
              X25
            </RouterLink>
            <RouterLink to="/servers/x100" className="text-gray-300 hover:text-white transition-colors font-medium font-english-medium">
              X100
            </RouterLink>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <RouterLink to="/profile">
              <SpotlightButton
                variant="accent"
                size="md"
                className="rounded-full font-english-semibold"
              >
                Profile
              </SpotlightButton>
            </RouterLink>
          ) : (
            <RouterLink to="/login">
              <SpotlightButton
                variant="secondary"
                size="md"
                className="rounded-full font-english-semibold"
              >
                Sign in
              </SpotlightButton>
            </RouterLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;