import React from 'react';

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-blue-400/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/6 w-80 h-80 bg-gradient-to-r from-blue-600/25 to-blue-500/25 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-700/20 to-blue-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
    </div>
  );
};

export default BackgroundEffects;