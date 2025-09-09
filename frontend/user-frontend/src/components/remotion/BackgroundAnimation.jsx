import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const BackgroundAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a smooth loop
  const progress = (frame % (fps * 8)) / (fps * 8); // 8 second loop

  // Pulsing blue circle
  const circleOpacity = interpolate(
    progress,
    [0, 0.5, 1],
    [0.3, 0.8, 0.3]
  );

  const circleScale = interpolate(
    progress,
    [0, 0.5, 1],
    [0.8, 1.2, 0.8]
  );

  // Floating particles
  const particleOffset1 = interpolate(
    progress,
    [0, 1],
    [0, 360]
  );

  const particleOffset2 = interpolate(
    progress,
    [0, 1],
    [0, -360]
  );

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.05), rgba(0, 0, 0, 1))',
      }}
    >
      {/* Main pulsing circle */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center,
            rgba(37, 99, 235, ${circleOpacity * 0.3}) 0%,
            rgba(59, 130, 246, ${circleOpacity * 0.2}) 20%,
            rgba(30, 64, 175, ${circleOpacity * 0.15}) 35%,
            rgba(15, 23, 42, 0.6) 60%,
            rgba(0, 0, 0, 1) 100%
          )`,
          transform: `scale(${circleScale})`,
          transformOrigin: 'center center',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 200 + (i % 3) * 100;
        
        const x = Math.cos(angle + (particleOffset1 * Math.PI) / 180) * radius;
        const y = Math.sin(angle + (particleOffset1 * Math.PI) / 180) * radius;
        
        const particleOpacity = interpolate(
          (frame + i * 10) % (fps * 4),
          [0, fps * 2, fps * 4],
          [0.2, 1, 0.2]
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
            }}
          />
        );
      })}

      {/* Secondary floating particles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 150 + (i % 2) * 80;
        
        const x = Math.cos(angle + (particleOffset2 * Math.PI) / 180) * radius;
        const y = Math.sin(angle + (particleOffset2 * Math.PI) / 180) * radius;
        
        const particleOpacity = interpolate(
          (frame + i * 15) % (fps * 6),
          [0, fps * 3, fps * 6],
          [0.1, 0.6, 0.1]
        );

        return (
          <div
            key={`secondary-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '1px',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};