import React from 'react';
import { Spin } from 'antd';

const Loading = ({ size = 'default', message = 'Loading...' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 'small';
      case 'large': return 'large';
      case 'lg': return 'large';
      default: return 'default';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Custom themed spinner */}
      <div className="relative">
        <div className={`${getSizeClass()} animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500`}></div>
        <div className={`${getSizeClass()} absolute inset-0 animate-ping rounded-full border border-blue-400/30`}></div>
      </div>
      
      {/* Fallback Ant Design spinner with custom styling */}
      <div className="hidden">
        <Spin size={getSpinnerSize()} />
      </div>
      
      {message && (
        <div
          className="mt-4 text-white/80 text-center backdrop-blur-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10"
          style={{ fontFamily: 'SukhumvitSet' }}
        >
          {message}
        </div>
      )}
      
      {/* Optional sparkle effects for larger loading */}
      {(size === 'large' || size === 'lg') && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-twinkle opacity-60" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-twinkle opacity-60 absolute -top-8 -left-8" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-1 h-1 bg-blue-300 rounded-full animate-twinkle opacity-60 absolute -top-8 left-8" style={{ animationDelay: '1s' }}></div>
            <div className="w-1 h-1 bg-purple-300 rounded-full animate-twinkle opacity-60 absolute top-8 -left-8" style={{ animationDelay: '1.5s' }}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-twinkle opacity-60 absolute top-8 left-8" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;