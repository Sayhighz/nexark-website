import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useAuthContext } from '../../contexts/AuthContext';

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


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-colors ${
        isScrolled ? 'backdrop-blur-md bg-black/80 border-b border-white/10' : 'bg-transparent'
      } px-6 py-4`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <ScrollLink
              to="x25"
              smooth={true}
              duration={500}
              className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer font-english-medium"
            >
              X25
            </ScrollLink>

            <ScrollLink
              to="x100"
              smooth={true}
              duration={500}
              className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer font-english-medium"
            >
              X100
            </ScrollLink>

            <RouterLink to="/shop" className="text-gray-300 hover:text-white transition-colors font-medium font-english-medium">
              Store
            </RouterLink>
            <RouterLink to="/games" className="text-gray-300 hover:text-white transition-colors font-medium font-english-medium">
              Gacha
            </RouterLink>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <RouterLink to="/profile" className="inline-flex items-center">
              <span className="rounded-full px-6 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-english-semibold">
                Profile
              </span>
            </RouterLink>
          ) : (
            <RouterLink to="/login" className="inline-flex items-center">
              <span className="rounded-full px-6 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-english-semibold">
                Sign in
              </span>
            </RouterLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;