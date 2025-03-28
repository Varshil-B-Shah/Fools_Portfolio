"use client";

import { createContext, useState, useContext } from 'react';

// Create the context with a default value
export const LandingContext = createContext({
  isLandingAnimationComplete: false,
  setIsLandingAnimationComplete: () => {}
});

// Context Provider Component
export function LandingProvider({ children }) {
  const [isLandingAnimationComplete, setIsLandingAnimationComplete] = useState(false);

  return (
    <LandingContext.Provider value={{ 
      isLandingAnimationComplete, 
      setIsLandingAnimationComplete 
    }}>
      {children}
    </LandingContext.Provider>
  );
}

// Custom hook to use the Landing context
export function useLandingAnimation() {
  return useContext(LandingContext);
}