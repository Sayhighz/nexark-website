import React, { useEffect, useRef } from 'react';
import { Typography } from 'antd';
import { animate } from 'animejs';

const { Title, Paragraph } = Typography;

const Hero = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Simple entrance animations
    animate(titleRef.current, {
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 900,
      ease: 'outExpo',
      delay: 150,
    });

    animate(subtitleRef.current, {
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700,
      ease: 'outExpo',
      delay: 450,
    });
  }, []);

  return (
    <section className="relative z-20 flex items-center justify-center min-h-[70vh] px-6 pt-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <div className="mb-8">
          <Title
            level={1}
            ref={titleRef}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight opacity-0"
          >
            Explore the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ARK Universe
            </span>
          </Title>

          <Paragraph
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light opacity-0"
          >
            Choose your adventure across different realms. Experience premium ARK: Survival Evolved gameplay with optimized rates and exclusive features.
          </Paragraph>
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-12 h-12 bg-gradient-to-r from-blue-500/60 to-blue-400/60 rounded-2xl animate-bounce animation-delay-1000 transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/6 w-10 h-10 bg-gradient-to-r from-blue-600/60 to-blue-500/60 rounded-full animate-bounce animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-14 h-14 bg-gradient-to-r from-blue-700/60 to-blue-600/60 rounded-xl animate-bounce animation-delay-3000 transform -rotate-12"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;