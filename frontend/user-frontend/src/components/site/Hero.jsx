import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import SpotlightButton from '../ui/SpotlightButton';

const Hero = () => {
  const titleRef = useRef(null);
  const logoRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Enhanced entrance animations with anime.js
    animate(titleRef.current, {
      translateY: [100, 0],
      opacity: [0, 1],
      scale: [0.7, 1],
      duration: 1500,
      ease: 'outElastic',
      delay: 200,
    });

    // Simple logo entrance animation
    setTimeout(() => {
      const logoElement = document.querySelector('.nexark-logo img');
      if (logoElement) {
        animate(logoElement, {
          scale: [1, 1.05, 1],
          duration: 4000,
          loop: true,
          ease: 'inOutSine',
        });
      }
    }, 1200);

    // Animate social media buttons
    setTimeout(() => {
      const socialButtons = document.querySelectorAll('.social-button');
      animate(socialButtons, {
        translateY: [50, 0],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        delay: (el, i) => i * 150,
        ease: 'outBack',
      });
    }, 1800);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // 3D mouse movement effect for logo
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!logoRef.current || !heroRef.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the hero section
      const mouseX = e.clientX - heroRect.left;
      const mouseY = e.clientY - heroRect.top;
      
      // Calculate center of logo relative to hero section
      const logoCenterX = (logoRect.left - heroRect.left) + logoRect.width / 2;
      const logoCenterY = (logoRect.top - heroRect.top) + logoRect.height / 2;
      
      // Calculate deltas normalized to [-1, 1]
      const deltaX = (mouseX - logoCenterX) / (heroRect.width / 2);
      const deltaY = (mouseY - logoCenterY) / (heroRect.height / 2);

      // Calculate rotation angles (increased for more visible effect)
      const maxRotation = 20;
      const rotateX = -deltaY * maxRotation;
      const rotateY = deltaX * maxRotation;
      const scale = 1 + Math.abs(deltaX * deltaY) * 0.15;

      // Apply 3D transform (single line to avoid issues)
      logoRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translateZ(30px)`;
    };

    const handleMouseLeave = () => {
      if (!logoRef.current) return;
      
      // Reset to original position with smooth transition
      logoRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`;
    };

    const heroElement = heroRef.current;
    
    if (heroElement) {
      // Add event listeners to hero section
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section
      ref={heroRef}
      className="hero-section relative z-20 flex items-center justify-center min-h-screen px-6 pt-16"
    >
      {/* Content overlay */}
      <div className="relative z-30 max-w-6xl mx-auto text-center">
        {/* Title */}
        <div className="mb-12">
          <div
            ref={titleRef}
            className="nexark-logo mb-16 flex flex-col items-center"
          >
            <div
              ref={logoRef}
              className="logo-3d-container transition-transform duration-300 ease-out cursor-pointer will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <img
                src="/images/NEXLogo.png"
                alt="NEXArk Logo"
                className="w-auto h-64 md:h-80 lg:h-96 xl:h-[32rem] 2xl:h-[40rem] object-contain smooth-neon-glow"
                style={{ transformStyle: 'preserve-3d' }}
              />
            </div>
 
            {/* Social Buttons below logo */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              {/* Discord */}
              <a
                href="https://discord.gg/nexark"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl bg-white border-2 border-white"
              >
                <svg
                  className="relative z-10 w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.174.372.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/nexark"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl bg-white border-2 border-white"
              >
                <svg
                  className="relative z-10 w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@nexark"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl bg-white border-2 border-white"
              >
                <svg
                  className="relative z-10 w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
 
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;