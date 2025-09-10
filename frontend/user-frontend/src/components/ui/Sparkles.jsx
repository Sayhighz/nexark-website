import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export function Sparkles({
  className,
  size = 1,
  minSize = null,
  density = 800,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  color = "#FFFFFF",
  background = "transparent",
  options = {},
  particleColor = "#FFFFFF",
  particleSize = 1,
  ...props
}) {
  const [init, setInit] = useState(false);
  const id = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const defaultOptions = {
    background: {
      color: {
        value: background,
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: particleColor,
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: false,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: speed,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: density,
        },
        value: 80,
      },
      opacity: {
        value: opacity,
        animation: {
          enable: true,
          speed: opacitySpeed,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: minSize || size, max: size * 2 },
        animation: {
          enable: true,
          speed: minSpeed || speed,
          minimumValue: 0.1,
        },
      },
    },
    detectRetina: true,
    ...options,
  };

  if (init) {
    return (
      <div className={className} {...props}>
        <Particles
          id={id}
          particlesLoaded={particlesLoaded}
          options={defaultOptions}
        />
      </div>
    );
  }

  return <></>;
}