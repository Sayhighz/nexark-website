import React, { useEffect, useState } from 'react';

const BackgroundEffects = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 3,
          animationDuration: Math.random() * 2 + 2,
        });
      }
      setStars(starArray);
    };

    // Generate shooting stars
    const generateShootingStars = () => {
      const shootingStarArray = [];
      for (let i = 0; i < 2; i++) {
        shootingStarArray.push({
          id: i,
          startX: Math.random() * 50,
          startY: Math.random() * 50,
          endX: Math.random() * 50 + 50,
          endY: Math.random() * 50 + 50,
          animationDelay: Math.random() * 10,
          animationDuration: Math.random() * 2 + 1,
        });
      }
      setShootingStars(shootingStarArray);
    };

    generateStars();
    generateShootingStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Galaxy Nebula Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 70%, rgba(75, 0, 130, 0.25) 0%, transparent 40%),
            radial-gradient(ellipse at 40% 80%, rgba(72, 61, 139, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 20%, rgba(123, 104, 238, 0.15) 0%, transparent 45%),
            linear-gradient(45deg, rgba(25, 25, 112, 0.1) 0%, rgba(72, 61, 139, 0.05) 50%, rgba(138, 43, 226, 0.1) 100%)
          `
        }}
      />

      {/* Cosmic Dust Clouds */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 10% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 90% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 35%)
          `
        }}
      />

      {/* Animated Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0">
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              animation: `shootingStar 3s linear infinite`,
              animationDelay: `${star.animationDelay}s`,
              boxShadow: '0 0 6px #fff, 0 0 12px #fff, 0 0 18px #fff',
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatParticle ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Static Galaxy Core */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10"
        style={{
          background: `
            radial-gradient(circle,
              rgba(138, 43, 226, 0.4) 0%,
              rgba(75, 0, 130, 0.3) 30%,
              rgba(72, 61, 139, 0.2) 60%,
              transparent 100%
            )
          `
        }}
      />
    </div>
  );
};

export default BackgroundEffects;