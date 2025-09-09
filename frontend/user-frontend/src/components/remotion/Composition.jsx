import React from 'react';
import { Composition } from 'remotion';
import { BackgroundAnimation } from './BackgroundAnimation';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="BackgroundAnimation"
        component={BackgroundAnimation}
        durationInFrames={480} // 8 seconds at 60fps
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};