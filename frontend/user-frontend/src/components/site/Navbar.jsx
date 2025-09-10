import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useAuthContext } from '../../contexts/AuthContext';
import SpotlightButton from '../ui/SpotlightButton';

const Navbar = () => {
  const { isAuthenticated } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Transparent at top, solid on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Hide/show navbar on scroll direction (show on even slight upward movement)
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    // initialize ref on mount / route change
    lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;

    const THRESHOLD = 6; // px of movement to consider (small upward movement will reveal)
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // If scrolling down quickly and past 100px, hide navbar
          if (delta > THRESHOLD && currentY > 100) {
            setIsVisible(false);
          }
          // If any meaningful upward scroll (even small), show navbar
          else if (delta < -THRESHOLD) {
            setIsVisible(true);
          }
          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9998] transition-transform duration-300 will-change-transform transform-gpu ${
        isScrolled ? 'backdrop-blur-md bg-black/80 border-b border-white/10' : 'bg-transparent'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'} px-6 py-4`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <ScrollLink
              to="servers"
              smooth={true}
              duration={500}
              className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer font-english-medium"
            >
              Servers
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