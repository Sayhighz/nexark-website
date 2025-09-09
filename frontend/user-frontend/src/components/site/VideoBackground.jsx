import React, { useEffect, useRef } from 'react';
import backgroundVideo from '../../assets/video/background.mp4';

const VideoBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure seamless looping
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });

      // Handle any loading issues
      video.addEventListener('loadeddata', () => {
        video.play().catch(() => {
          // Autoplay might be blocked, but that's okay
        });
      });

      return () => {
        video.removeEventListener('ended', () => {});
        video.removeEventListener('loadeddata', () => {});
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        className="w-full h-full object-cover pointer-events-none"
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{
          filter: `
            contrast(0.7)
            brightness(0.5)
            saturate(0.6)
            sepia(0.3)
            hue-rotate(10deg)
            blur(0.5px)
          `
        }}
      />
      {/* Spotlight Effect - Strong Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center,
              transparent 0%,
              transparent 25%,
              rgba(0,0,0,0.3) 35%,
              rgba(0,0,0,0.7) 50%,
              rgba(0,0,0,0.9) 70%,
              rgba(0,0,0,1) 100%
            )
          `
        }}
      />
      
      {/* Vintage Overlay (only in center) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center,
              rgba(139,69,19,0.05) 0%,
              rgba(101,67,33,0.05) 20%,
              transparent 40%,
              transparent 100%
            )
          `,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
};

export default VideoBackground;