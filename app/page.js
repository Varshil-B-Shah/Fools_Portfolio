"use client";
import BykuBankaiBlossomExplosion from "@/components/BlossomOverlay";
// import BlossomExplosion from "@/components/BlossomOverlay";
// import ProgrammaticBlossomOverlays from "@/components/BlossomOverlay";
import Landing from "@/components/Landing";
import { LandingProvider,useLandingAnimation } from "@/components/LandingContext";


const timedOverlays = [
  {
    time: 9500,
    index: 0,
    position: {
      top: "25%",
      left: "0%",
    },
  },
  {
    time: 10000,
    index: 1,
    position: {
      top: "25%",
      left: "0%",
    },
  },
  {
    time: 10500,
    index: 2,
    position: {
      top: "25%",
      left: "0%",
    },
  },
  {
    time: 11000,
    index: 3,
    position: {
      top: "25%",
      left: "0%",
    },
  },
  {
    time: 11500,
    index: 4,
    position: {
      top: "25%",
      left: "0%",
    },
  },
  {
    time: 12000,
    index: 5,
    position: {
      top: "22%",
      left: "0%",
    },
  },
  {
    time: 12500,
    index: 6,
    position: {
      top: "20%",
      left: "0%",
    },
  },
  {
    time: 13000,
    index: 7,
    position: {
      top: "18%",
      left: "0%",
    },
  },
];

const explosions = [
  {
    time: 0, // Trigger Bankai explosion after 2 seconds
  },
];

export default function Home() {
  // const { isLandingAnimationComplete } = useLandingStore();
  const { isLandingAnimationComplete } = useLandingAnimation();

  return (
    <div className="h-full w-full overflow-x-hidden">
      <Landing />
      {/* <ProgrammaticBlossomOverlays timedOverlays={timedOverlays} /> */}
      {/* <BlossomExplosion timedExplosions={explosions} /> */}
      {isLandingAnimationComplete && (
        <BykuBankaiBlossomExplosion timedExplosions={explosions} />
      )}
    </div>
  );
}
