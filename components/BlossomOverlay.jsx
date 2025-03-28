import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BlossomBackground from './BlossomBackground';

const BykuBankaiBlossomExplosion = ({ timedExplosions }) => {
  const [currentExplosions, setCurrentExplosions] = useState([]);
  const explosionRefs = useRef([]);

  useEffect(() => {
    // Create timers for each scheduled explosion
    const timers = timedExplosions.map(({ time }, index) => 
      setTimeout(() => {
        setCurrentExplosions(prev => [...prev, { 
          id: index,
          position: { 
            top: '40%', 
            left: '40%', 
            transform: 'translate(-50%, -50%)' 
          },
          rotationDirection: index % 2 === 0 ? 1 : -1 // Alternate rotation directions
        }]);
      }, time)
    );

    // Cleanup timers on component unmount
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [timedExplosions]);

  // Animate explosions
  useEffect(() => {
    currentExplosions.forEach((explosion, index) => {
      const explosionRef = explosionRefs.current[index];
      if (explosionRef) {
        const petalContainer = explosionRef.querySelector('#bankai-petal-layer1');
        
        // Dramatic Bankai-style explosion animation with alternating rotation
        gsap.fromTo(
          petalContainer,
          { 
            opacity: 0,
            scale: 0.005,
            rotation: explosion.rotationDirection * 0
          },
          { 
            opacity: 1, 
            scale: 1.5,
            rotation: explosion.rotationDirection * 360,
            duration: 5,
            ease: 'power2.out',
            onComplete: () => {
              // Optional additional animation for dramatic effect
              gsap.to(petalContainer, {
                opacity: 0.7,
                scale: 1.2,
                duration: 1.5,
                ease: 'power1.inOut'
              });
            }
          }
        );
      }
    });
  }, [currentExplosions]);

  if (currentExplosions.length === 0) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    >
      {currentExplosions.map((explosion, index) => (
        <div 
          key={explosion.id}
          ref={el => explosionRefs.current[index] = el}
          className="absolute flex items-center justify-center"
          style={{ 
            width: '100%',
            height: '100%',
            zIndex: 50,
            ...explosion.position
          }}
        >
          <div 
            id="bankai-petal-layer1"
            style={{
              width: '100vw',
              height: '100vh',
              position: 'absolute'
            }}
          >
            <BlossomBackground
              numPetals={100}
              width="100vw"
              height="100vh"
              gravity={2.5}
              windMaxSpeed={2}
              petalStyles={[
                'petal-style1', 
                'petal-style2', 
                'petal-style3', 
                'petal-style4'
              ]}
              style={{ 
                backgroundColor: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BykuBankaiBlossomExplosion;