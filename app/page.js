"use client";
import { useState, useEffect } from "react";
import BykuBankaiBlossomExplosion from "@/components/Landing/BlossomOverlay";
import Landing from "@/components/Landing/Landing";
import NewScreen from "@/components/NewScreen"; // Make sure to create this component
import { useLandingAnimation } from "@/components/Providers/LandingContext";

const explosions = [
  {
    time: 0,
  },
];

export default function Home() {
  const { isLandingAnimationComplete } = useLandingAnimation();
  const [showNewScreen, setShowNewScreen] = useState(false);
  const [isScreenFalling, setIsScreenFalling] = useState(false);

  // Handle screen fall completion
  const handleScreenFallComplete = () => {
    setIsScreenFalling(true);

    // Small delay to ensure all falling animations are complete
    setTimeout(() => {
      setShowNewScreen(true);
    }, 100);
  };

  // Add a body class while screen is falling to prevent scrolling
  useEffect(() => {
    if (isScreenFalling) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isScreenFalling]);

  return (
    <div
      className={`h-full w-full overflow-x-hidden ${
        isScreenFalling ? "screen-falling" : ""
      }`}
    >
      {/* Original components */}
      {!showNewScreen && (
        <>
          <Landing />
          {isLandingAnimationComplete && (
            <BykuBankaiBlossomExplosion
              timedExplosions={explosions}
              onScreenFallComplete={handleScreenFallComplete}
            />
          )}
        </>
      )}

      {/* New screen component */}
      {showNewScreen && <NewScreen />}
    </div>
  );
}
