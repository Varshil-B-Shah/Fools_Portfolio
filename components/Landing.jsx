"use client";

import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  Environment, 
  useGLTF, 
  Center 
} from "@react-three/drei";
import { gsap } from "gsap";

const AnimatedModel = ({ startAnimation, onAnimationComplete }) => {
  const { scene } = useGLTF("/models/untitled.glb");
  const modelRef = useRef(null);
  const groupRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    if (groupRef.current && modelRef.current && !isAnimating) {
      setIsAnimating(true);
      
      // Animate down and then trigger corridor effect
      gsap.to(groupRef.current.position, {
        y: -10,  // Go straight down
        duration: 5,
        ease: "power4.in",
        onComplete: () => {
          setIsAnimating(false);
          onAnimationComplete();
        }
      });
    }
  };

  React.useEffect(() => {
    if (startAnimation) {
      triggerAnimation();
    }
  }, [startAnimation]);

  return (
    <group ref={groupRef}>
      <primitive 
        ref={modelRef}
        object={scene.clone()} 
        scale={1.5} 
        rotation={[0, -1, 0]} 
      />
    </group>
  );
};

const ModelCorridor = ({ models, startRiseAnimation }) => {
  const leftModelRefs = useRef([]);
  const rightModelRefs = useRef([]);

  useEffect(() => {
    if (startRiseAnimation) {
      // Animate left side models
      leftModelRefs.current.forEach((groupRef, index) => {
        if (groupRef) {
          gsap.fromTo(
            groupRef.position, 
            { y: -20 }, // Start from below the view
            {
              y: models[index].position[1], 
              duration: 2.5, 
              delay: index * 0.3, // Staggered delay
              ease: "power2.out"
            }
          );
        }
      });

      // Animate right side models
      rightModelRefs.current.forEach((groupRef, index) => {
        if (groupRef) {
          gsap.fromTo(
            groupRef.position, 
            { y: -20 }, // Start from below the vie
            {
              y: models[index + leftModelRefs.current.length].position[1], 
              duration: 2.5, 
              delay: index * 0.3, // Staggered delay
              ease: "power2.out"
            }
          );
        }
      });
    }
  }, [startRiseAnimation, models]);

  // Separate rendering for left and right sides
  return (
    <>
      {/* Left side models */}
      {models.slice(0, 13).map((modelProps, index) => (
        <group 
          key={`left-${index}`} 
          ref={(el) => leftModelRefs.current[index] = el}
          position={[
            modelProps.position[0], 
            startRiseAnimation ? modelProps.position[1] : -20, // Start below if not animating
            modelProps.position[2]
          ]}
        >
          <primitive 
            object={modelProps.model} 
            scale={modelProps.scale} 
            rotation={[Math.PI, 5, 0]}
          />
        </group>
      ))}

      {/* Right side models */}
      {models.slice(13).map((modelProps, index) => (
        <group 
          key={`right-${index}`} 
          ref={(el) => rightModelRefs.current[index] = el}
          position={[
            modelProps.position[0], 
            startRiseAnimation ? modelProps.position[1] : -20, // Start below if not animating
            modelProps.position[2]
          ]}
        >
          <primitive 
            object={modelProps.model} 
            scale={modelProps.scale} 
            rotation={[Math.PI, -10, 0]}
          />
        </group>
      ))}
    </>
  );
};

const Landing = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showCorridor, setShowCorridor] = useState(false);
  const [startRiseAnimation, setStartRiseAnimation] = useState(false);
  const { scene } = useGLTF("/models/untitled.glb");

  const corridorModels = useMemo(() => {
    const leftSide = Array.from({ length: 13 }, (_, i) => ({
      position: [
        -9.5 + (i * 0.75),  // Spread horizontally
        8 - (i * 0.3),   // Slight vertical offse
        0 - (i * 2)    // Depth with perspectiv
      ],
      
      scale: 2.3 - (i * 0.17),  // Decreasing scale
      model: scene.clone()
    }));

    const rightSide = Array.from({ length: 13 }, (_, i) => ({
      position: [
        10 - (i * 0.75),   // Spread horizontally
        8 - (i * 0.3),   // Slight vertical offset
        0 - (i * 2)    // Depth with perspective
      ],
      
      scale: 2.3 - (i * 0.17),  // Decreasing scale
      model: scene.clone()
    }));

    return [...leftSide, ...rightSide];
  }, [scene]);

  const handleAnimationComplete = () => {
    setShowCorridor(true);
    // Slight delay to ensure corridor is set up before rising
    setTimeout(() => {
      setStartRiseAnimation(true);
    }, 500);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <Canvas 
        camera={{ 
          position: [0, 0, 9], 
          fov: 50 
        }}
      >
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
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
              />
            )}
          </Center>
        </Suspense>
        <Environment preset="city" />
      </Canvas>

      {!showCorridor && (
        <button 
          onClick={() => setStartAnimation(true)}
          className="absolute z-10 top-10 right-10 
          bg-white/20 backdrop-blur-md text-white 
          px-6 py-3 rounded-xl 
          border border-white/30
          hover:bg-white/30 transition-all duration-300"
        >
          Bankai!
        </button>
      )}
    </div>
  );
};

export default Landing;