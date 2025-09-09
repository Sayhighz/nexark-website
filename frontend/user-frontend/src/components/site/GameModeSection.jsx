import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

const GameModeSection = ({
  title,
  playerType,
  description,
  features,
  bgGradient,
  textColor = 'text-white'
}) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Animate content when visible
          animate(contentRef.current, {
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 1200,
            ease: 'outExpo',
          });

          // Animate features with stagger
          setTimeout(() => {
            const featureElements = contentRef.current?.querySelectorAll('.feature-item');
            if (featureElements) {
              animate(featureElements, {
                translateX: [50, 0],
                opacity: [0, 1],
                duration: 800,
                delay: (el, i) => i * 200,
                ease: 'outQuart',
              });
            }
          }, 600);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden ${textColor}`}
      style={{ background: bgGradient }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`
        }} />
      </div>

      <div 
        ref={contentRef}
        className="relative z-10 max-w-6xl mx-auto text-center opacity-0"
      >
        {/* Mode Badge */}
        <div className="inline-flex items-center px-6 py-3 rounded-full mb-8 bg-white/10 border border-white/20">
          <span className="text-2xl font-bold font-english-bold">{title}</span>
        </div>

        {/* Player Type */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight font-thai-bold">
          {playerType}
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-thai-normal">
          {description}
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-item opacity-0 p-6 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/10 text-white">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-english-semibold">{feature.title}</h3>
              <p className="text-gray-400 font-thai-normal">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16">
          <button className="px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-gray-500/25">
            <span className="font-thai-semibold">เข้าสู่ </span>
            <span className="font-english-semibold">{title}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default GameModeSection;