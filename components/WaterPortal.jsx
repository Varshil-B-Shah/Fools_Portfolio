"use client";
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

const BluePortal = () => {
  return (
    <div 
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
      style={{ 
        width: '200px', 
        height: '200px',
        position: 'absolute' 
      }}
    >
      <Canvas 
        camera={{ 
          position: [0, 0, 5], 
          fov: 45 
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <PortalScene />
      </Canvas>
    </div>
  );
};

const PortalScene = () => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      // Pulsing animation
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotation effect
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <>
      {/* Main Portal */}
      <mesh ref={meshRef}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial 
          color="#0000ff" 
          transparent 
          opacity={0.7} 
        />
      </mesh>

      {/* Outer Glow Ring */}
      <mesh>
        <torusGeometry args={[1.1, 0.1, 16, 100]} />
        <meshBasicMaterial 
          color="#4444ff" 
          transparent 
          opacity={0.5} 
        />
      </mesh>
    </>
  );
};

export default BluePortal;