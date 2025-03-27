"use client";

import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Center, Points, PointMaterial } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import * as THREE from "three";

const FireParticles = () => {
  const pointsRef = useRef();
  
  const particlesCount = 10000; 
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100; 
      pos[i * 3 + 1] = Math.random() * 60 - 10; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50; 
    }
    return pos;
  }, []);

  useFrame((state) => {
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 1] += Math.random() * 0.1 + 0.05;
      positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.05;
      
      if (positions[i * 3 + 1] > 30) {
        positions[i * 3 + 1] = -10;
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points 
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
      position={[0, -10, -20]} 
    >
      <PointMaterial
        transparent
        color="#ff4500"
        size={0.08} 
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7} 
      />
    </Points>
  );
};

const AnimatedModel = ({ startAnimation, onAnimationComplete }) => {
  const scene = useLoader(GLTFLoader, "/untitled.glb");
  const modelRef = useRef(null);
  const groupRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    if (groupRef.current && modelRef.current && !isAnimating) {
      setIsAnimating(true);

      gsap.to(groupRef.current.position, {
        y: -10,
        duration: 1,
        ease: "power4.in",
        onComplete: () => {
          setIsAnimating(false);
          onAnimationComplete();
        },
      });
    }
  };

  useEffect(() => {
    if (startAnimation) {
      triggerAnimation();
    }
  }, [startAnimation]);

  return (
    <group ref={groupRef}>
      <primitive
        ref={modelRef}
        object={scene.scene.clone()}
        scale={1.5}
        rotation={[0, -1, 0]}
      />
    </group>
  );
};

const ModelCorridor = ({ 
  models, 
  startRiseAnimation, 
  startFadeInAnimation
}) => {
  const leftModelRefs = useRef([]);
  const rightModelRefs = useRef([]);
  const [fadeProgress, setFadeProgress] = useState(0);

  useEffect(() => {
    if (startRiseAnimation) {
      const leftAnimationTimeline = gsap.timeline();
      const rightAnimationTimeline = gsap.timeline();

      // Animate left corridor rise
      leftModelRefs.current.forEach((groupRef, index) => {
        if (groupRef) {
          leftAnimationTimeline.fromTo(
            groupRef.position,
            { y: -20 },
            {
              y: models[index].position[1],
              duration: 2.5,
              ease: "power2.out",
            },
            index * 0.3 // Staggered delay
          );
        }
      });

      // Animate right corridor rise
      rightModelRefs.current.forEach((groupRef, index) => {
        if (groupRef) {
          rightAnimationTimeline.fromTo(
            groupRef.position,
            { y: -20 },
            {
              y: models[index + leftModelRefs.current.length].position[1],
              duration: 2.5,
              ease: "power2.out",
            },
            index * 0.3 // Staggered delay
          );
        }
      });

      // Scale down animation for left corridor AFTER rise animations complete
      leftAnimationTimeline.add(() => {
        for (let i = leftModelRefs.current.length - 1; i >= 0; i--) {
          if (leftModelRefs.current[i]) {
            gsap.fromTo(
              leftModelRefs.current[i].scale, 
              {
                clipPath: 'inset(0% 0% 0% 0%)', // Start fully visible
                z: 1,
                x: 1,
                y: 1
              },
              {
                clipPath: 'inset(0% 0% 100% 0%)', // Fade out from bottom
                z: 0,
                x: 0,
                y: 0,
                duration: 1,
                delay: (leftModelRefs.current.length - i) * 0.1,
                ease: "power2.in"
              }
            );
          }
        }
      });
      
      // Scale down animation for right corridor AFTER rise animations complete
      rightAnimationTimeline.add(() => {
        for (let i = rightModelRefs.current.length - 1; i >= 0; i--) {
          if (rightModelRefs.current[i]) {
            gsap.fromTo(
              rightModelRefs.current[i].scale, 
              {
                clipPath: 'inset(0% 0% 0% 0%)', // Start fully visible
                z: 1,
                x: 1,
                y: 1
              },
              {
                clipPath: 'inset(0% 0% 100% 0%)', // Fade out from bottom
                z: 0,
                x: 0,
                y: 0,
                duration: 1,
                delay: (rightModelRefs.current.length - i) * 0.1,
                ease: "power2.in"
              }
            );
          }
        }
      });
    }
  }, [startRiseAnimation, models]);

  useEffect(() => {
    if (startFadeInAnimation) {
      gsap.to(setFadeProgress, {
        value: 1,
        duration: 4,
        ease: "power1.inOut",
      });
    }
  }, [startFadeInAnimation]);

  return (
    <>
      {models.slice(0, 13).map((modelProps, index) => {
        const reverseIndex = 12 - index; // Reverse index to start from last

        return (
          <group
            key={`left-${index}`}
            ref={(el) => (leftModelRefs.current[index] = el)}
            position={[
              modelProps.position[0],
              startRiseAnimation ? modelProps.position[1] : -20,
              modelProps.position[2],
            ]}
            style={{
              clipPath: `polygon(0 ${
                fadeProgress * 100 >= (reverseIndex / 12) * 100 ? 100 : 0
              }%, 100% ${
                fadeProgress * 100 >= (reverseIndex / 12) * 100 ? 100 : 0
              }%, 100% 100%, 0 100%)`,
            }}
          >
            <primitive
              object={modelProps.model}
              scale={modelProps.scale}
              rotation={[Math.PI, 5, 0]}
            />
          </group>
        );
      })}

      {models.slice(13).map((modelProps, index) => {
        const reverseIndex = 12 - index; // Reverse index to start from last

        return (
          <group
            key={`right-${index}`}
            ref={(el) => (rightModelRefs.current[index] = el)}
            position={[
              modelProps.position[0],
              startRiseAnimation ? modelProps.position[1] : -20,
              modelProps.position[2],
            ]}
            style={{
              clipPath: `polygon(0 ${
                fadeProgress * 100 >= (reverseIndex / 12) * 100 ? 100 : 0
              }%, 100% ${
                fadeProgress * 100 >= (reverseIndex / 12) * 100 ? 100 : 0
              }%, 100% 100%, 0 100%)`,
            }}
          >
            <primitive
              object={modelProps.model}
              scale={modelProps.scale}
              rotation={[Math.PI, -10, 0]}
            />
          </group>
        );
      })}
    </>
  );
};

const Landing = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showCorridor, setShowCorridor] = useState(false);
  const [startRiseAnimation, setStartRiseAnimation] = useState(false);
  const [startFadeInAnimation, setStartFadeInAnimation] = useState(false);
  const scene = useLoader(GLTFLoader, "/untitled.glb");

  const corridorModels = useMemo(() => {
    const leftSide = Array.from({ length: 13 }, (_, i) => ({
      position: [-9.5 + i * 0.75, 8 - i * 0.3, 0 - i * 2],
      scale: 2.3 - i * 0.17,
      model: scene.scene.clone(),
    }));

    const rightSide = Array.from({ length: 13 }, (_, i) => ({
      position: [10 - i * 0.75, 8 - i * 0.3, 0 - i * 2],
      scale: 2.3 - i * 0.17,
      model: scene.scene.clone(),
    }));

    return [...leftSide, ...rightSide];
  }, [scene]);

  const handleAnimationComplete = () => {
    setShowCorridor(true);
    setTimeout(() => {
      setStartRiseAnimation(true);
      setTimeout(() => {
        setStartFadeInAnimation(true);
      }, 2000); // Start fade-in 2 seconds after rise animation
    }, 500);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 9],
          fov: 50,
        }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} color="#ff4500" />
        
        <Suspense fallback={null}>
          <Center>
            {!showCorridor ? (
              <AnimatedModel
                startAnimation={startAnimation}
                onAnimationComplete={handleAnimationComplete}
              />
            ) : (
              <ModelCorridor
                models={corridorModels}
                startRiseAnimation={startRiseAnimation}
                startFadeInAnimation={startFadeInAnimation}
              />
            )}
          </Center>
          
          <FireParticles />
        </Suspense>
        
        <Environment preset="city" />
      </Canvas>

      {!showCorridor && (
        <button
          onClick={() => setStartAnimation(true)}
          className="absolute z-10 top-10 right-10 
          bg-red-500/30 backdrop-blur-md text-white 
          px-6 py-3 rounded-xl 
          border border-red-500/50
          hover:bg-red-500/50 transition-all duration-300
          animate-pulse"
        >
          Bankai!
        </button>
      )}
    </div>
  );
};

export default Landing;