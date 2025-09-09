import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Planet component
function Planet({ position, size, color, speed, orbitRadius, orbitSpeed }) {
  const meshRef = useRef();
  const orbitRef = useRef();
  
  useFrame((state) => {
    // Rotate planet on its axis
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
    
    // Orbit around center
    if (orbitRef.current && orbitRadius > 0) {
      const time = state.clock.getElapsedTime();
      orbitRef.current.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
      orbitRef.current.position.z = Math.sin(time * orbitSpeed) * orbitRadius;
    }
  });

  return (
    <group ref={orbitRef} position={position}>
      <Sphere ref={meshRef} args={[size, 32, 32]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Add a subtle glow effect */}
      <Sphere args={[size * 1.1, 32, 32]}>
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

// Central star/sun
function CentralStar() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshBasicMaterial 
        color="#4F46E5"
        emissive="#3B82F6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </Sphere>
  );
}

// Orbit rings
function OrbitRing({ radius }) {
  const ringRef = useRef();
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial 
        color="#3B82F6" 
        transparent 
        opacity={0.1} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Main solar system component
function SolarSystemScene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#4F46E5" />
      
      {/* Stars background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={1000} 
        factor={2} 
        saturation={0} 
        fade={true}
        speed={0.5}
      />
      
      {/* Central star */}
      <CentralStar />
      
      {/* Orbit rings */}
      <OrbitRing radius={3} />
      <OrbitRing radius={5} />
      <OrbitRing radius={7} />
      <OrbitRing radius={9} />
      
      {/* Planets */}
      <Planet 
        position={[3, 0, 0]} 
        size={0.3} 
        color="#60A5FA" 
        speed={0.02} 
        orbitRadius={3}
        orbitSpeed={0.8}
      />
      <Planet 
        position={[5, 0, 0]} 
        size={0.4} 
        color="#34D399" 
        speed={0.015} 
        orbitRadius={5}
        orbitSpeed={0.6}
      />
      <Planet 
        position={[7, 0, 0]} 
        size={0.35} 
        color="#F472B6" 
        speed={0.018} 
        orbitRadius={7}
        orbitSpeed={0.4}
      />
      <Planet 
        position={[9, 0, 0]} 
        size={0.5} 
        color="#A78BFA" 
        speed={0.012} 
        orbitRadius={9}
        orbitSpeed={0.3}
      />
      
      {/* Additional small asteroids */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Planet
          key={i}
          position={[
            Math.random() * 20 - 10,
            Math.random() * 4 - 2,
            Math.random() * 20 - 10
          ]}
          size={Math.random() * 0.1 + 0.05}
          color="#94A3B8"
          speed={Math.random() * 0.01 + 0.005}
          orbitRadius={0}
          orbitSpeed={0}
        />
      ))}
    </>
  );
}

// Main export component
export default function SolarSystem() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 5, 15], 
          fov: 60,
          near: 0.1,
          far: 200 
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent' }}
      >
        <SolarSystemScene />
      </Canvas>
    </div>
  );
}