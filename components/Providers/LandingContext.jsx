"use client";

import { createContext, useState, useContext } from "react";

export const LandingContext = createContext({
  isLandingAnimationComplete: false,
  setIsLandingAnimationComplete: () => {},
});

export function LandingProvider({ children }) {
  const [isLandingAnimationComplete, setIsLandingAnimationComplete] =
    useState(false);

  return (
    <LandingContext.Provider
      value={{
        isLandingAnimationComplete,
        setIsLandingAnimationComplete,
      }}
    >
      {children}
    </LandingContext.Provider>
  );
}

export function useLandingAnimation() {
  return useContext(LandingContext);
}
