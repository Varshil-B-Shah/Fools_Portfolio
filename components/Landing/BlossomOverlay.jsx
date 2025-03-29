import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import BlossomBackground from "./BlossomBackground";
import Petal from "./Petal";

const BykuBankaiBlossomExplosion = ({
  timedExplosions,
  onScreenFallComplete,
}) => {
  const [currentExplosions, setCurrentExplosions] = useState([]);
  const explosionRefs = useRef([]);
  const containerRef = useRef(null);
  const [crackPhase, setCrackPhase] = useState(0);
  const [isScreenFalling, setIsScreenFalling] = useState(false);
  const slashRefs = useRef([]);

  useEffect(() => {
    const timers = timedExplosions.map(({ time }, index) =>
      setTimeout(() => {
        setCurrentExplosions((prev) => [
          ...prev,
          {
            id: index,
            position: {
              top: "50%",
              left: "40%",
              transform: "translate(-50%, -50%)",
            },
            rotationDirection: index % 2 === 0 ? 1 : -1,
          },
        ]);
      }, time)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [timedExplosions]);

  useEffect(() => {
    currentExplosions.forEach((explosion, index) => {
      const explosionRef = explosionRefs.current[index];
      if (explosionRef) {
        const petalContainer = explosionRef.querySelector(
          "#bankai-petal-layer1"
        );

        gsap.fromTo(
          petalContainer,
          {
            opacity: 0,
            scale: 0,
            rotation: explosion.rotationDirection * 0,
          },
          {
            opacity: 1,
            scale: 1.5,
            rotation: explosion.rotationDirection * 360,
            duration: 5,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(petalContainer, {
                opacity: 0.7,
                scale: 1.2,
                duration: 1.5,
                ease: "power1.inOut",
              });
            },
          }
        );

        setTimeout(() => {
          setCrackPhase(1);

          setTimeout(() => setCrackPhase(2), 1500);
          setTimeout(() => setCrackPhase(3), 3000);

          setTimeout(() => {
            setIsScreenFalling(true);
            setTimeout(() => {
              if (onScreenFallComplete) {
                onScreenFallComplete();
              }
            }, 2000);
          }, 6000);
        }, 5000);
      }
    });
  }, [currentExplosions, onScreenFallComplete]);

  useEffect(() => {
    if (crackPhase > 0 && slashRefs.current) {
      const currentSlashRef = slashRefs.current[crackPhase - 1];

      if (currentSlashRef) {
        const petals = currentSlashRef.querySelectorAll(".blossom-petal");

        gsap.fromTo(
          petals,
          {
            scale: 0,
            opacity: 0,
            rotation: 0,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: (i) => (i % 2 === 0 ? 45 : -45),
            duration: 0.4,
            stagger: 0.03,
            ease: "back.out(2)",
            onComplete: () => {
              gsap.to(petals, {
                y: (i) => 100 + Math.random() * 2000,
                duration: 5,
                stagger: 0.02,
                ease: "power1.out",
                opacity: 1,
              });

              gsap.to(petals, {
                x: (i) => (Math.random() - 0.5) * 70,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            },
          }
        );
      }
    }
  }, [crackPhase]);

  const generatePetals = (count) => {
    return Array.from({ length: count }).map((_, i) => {
      const leftPos = `${(i / count) * 100}%`;
      const size = 14 + Math.random() * 12;
      return (
        <div
          key={i}
          className="blossom-petal"
          style={{
            position: "absolute",
            left: leftPos,
            top: `-${size / 2}px`,
          }}
        >
          <Petal size={`${size}px`} left="0" top="0" />
        </div>
      );
    });
  };

  if (currentExplosions.length === 0) return null;

  return (
    <>
      {crackPhase > 0 && (
        <div
          className={`fixed inset-0 z-[9999] pointer-events-none ${
            isScreenFalling ? "falling-screen" : ""
          }`}
          style={{
            transformOrigin: "center top",
            boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="absolute inset-0 z-10 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, transparent 0%, transparent 25%, rgba(0,0,0,0.7) 25.1%, transparent 25.5%)
              `,
              backgroundSize: "100% 100%",
            }}
          >
            <div className="absolute w-full h-full overflow-hidden">
              {crackPhase >= 1 && (
                <div
                  ref={(el) => (slashRefs.current[0] = el)}
                  className="absolute cherry-slash-animation"
                  style={{
                    top: "2%",
                    left: "1%",
                    width: "90%",
                    height: "3px",
                    background:
                      "linear-gradient(90deg, rgba(255,245,250,0.1), rgba(255,0,140,0.9) 10%, rgba(255,255,255,0.95) 20%, rgba(255,0,140,0.9) 30%, rgba(255,245,250,0.1) 100%)",
                    backdropFilter: "blur(1px)",
                    transform: "rotate(15deg) translateZ(0)",
                    transformOrigin: "left center",
                    boxShadow:
                      "0 0 10px rgba(255,80,180,0.8), 0 0 20px rgba(255,20,147,0.6)",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute inset-0 blossom-edge"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,223,230,0.5) 40%, rgba(255,105,180,0.4) 60%, transparent)",
                      height: "2px",
                      top: "0",
                    }}
                  ></div>
                  {generatePetals(25)}
                </div>
              )}

              {crackPhase >= 2 && (
                <div
                  ref={(el) => (slashRefs.current[1] = el)}
                  className="absolute cherry-slash-animation"
                  style={{
                    top: "47%",
                    right: "-2%",
                    width: "90%",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, rgba(255,245,250,0.1), rgba(255,0,140,0.9) 10%, rgba(255,255,255,0.95) 20%, rgba(255,0,140,0.9) 30%, rgba(255,245,250,0.1) 100%)",
                    backdropFilter: "blur(1px)",
                    transform: "rotate(-25deg) translateZ(0)",
                    transformOrigin: "right center",
                    boxShadow:
                      "0 0 10px rgba(255,80,180,0.8), 0 0 20px rgba(255,20,147,0.6)",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute inset-0 blossom-edge"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,223,230,0.5) 40%, rgba(255,105,180,0.4) 60%, transparent)",
                      height: "2px",
                      top: "0",
                    }}
                  ></div>
                  {generatePetals(20)}
                </div>
              )}

              {crackPhase >= 3 && (
                <div
                  ref={(el) => (slashRefs.current[2] = el)}
                  className="absolute cherry-slash-animation"
                  style={{
                    top: "103%",
                    left: "20%",
                    width: "90%",
                    height: "4px",
                    background:
                      "linear-gradient(90deg, rgba(255,245,250,0.1), rgba(255,0,140,0.9) 10%, rgba(255,255,255,0.95) 20%, rgba(255,0,140,0.9) 30%, rgba(255,245,250,0.1) 100%)",
                    backdropFilter: "blur(1px)",
                    transform: "rotate(-48deg) translateZ(0)",
                    transformOrigin: "left center",
                    boxShadow:
                      "0 0 10px rgba(255,80,180,0.8), 0 0 20px rgba(255,20,147,0.6)",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute inset-0 blossom-edge"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,223,230,0.5) 40%, rgba(255,105,180,0.4) 60%, transparent)",
                      height: "2px",
                      top: "0",
                    }}
                  ></div>
                  {generatePetals(30)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none z-50 ${
          isScreenFalling ? "falling-screen" : ""
        }`}
      >
        {currentExplosions.map((explosion, index) => (
          <div
            key={explosion.id}
            ref={(el) => (explosionRefs.current[index] = el)}
            className="absolute flex items-center justify-center"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 50,
              ...explosion.position,
            }}
          >
            <div
              id="bankai-petal-layer1"
              style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
              }}
            >
              <BlossomBackground
                numPetals={100}
                width="100vw"
                height="100vh"
                gravity={2.5}
                windMaxSpeed={2}
                petalStyles={[
                  "petal-style1",
                  "petal-style2",
                  "petal-style3",
                  "petal-style4",
                ]}
                style={{
                  backgroundColor: "transparent",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BykuBankaiBlossomExplosion;
