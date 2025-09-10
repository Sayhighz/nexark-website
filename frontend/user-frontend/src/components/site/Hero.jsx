import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Button } from 'antd';

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
            className="nexark-logo mb-16 flex justify-center items-center"
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
          </div>

          {/* Jump Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              type="default"
              size="large"
              onClick={() => scrollToSection('x25-section')}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 h-auto font-semibold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 font-english-semibold"
            >
              Jump to X25 Server
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => scrollToSection('x100-section')}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 h-auto font-semibold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 font-english-semibold"
            >
              Jump to X100 Server
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;