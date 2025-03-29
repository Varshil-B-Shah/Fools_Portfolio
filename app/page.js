"use client";
import BykuBankaiBlossomExplosion from "@/components/Landing/BlossomOverlay";
import Landing from "@/components/Landing/Landing";
import { useLandingAnimation } from "@/components/Providers/LandingContext";

const explosions = [
  {
    time: 0,
  },
];

export default function Home() {
  const { isLandingAnimationComplete } = useLandingAnimation();

  return (
    <div className="h-full w-full overflow-x-hidden">
      <Landing />
      {isLandingAnimationComplete && (
        <BykuBankaiBlossomExplosion timedExplosions={explosions} />
      )}
    </div>
  );
}
