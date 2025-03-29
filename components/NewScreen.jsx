import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NewScreen = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Animate the new screen coming in
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        }
      );
      
      // Animate the individual elements with staggered timing
      gsap.fromTo(
        ".animate-in",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full items-center justify-center flex h-full z-[10000] bg-gradient-to-br from-black via-pink-600 to-red-800 overflow-hidden"
    >
      Konichiwa!!
    </div>
  );
};

export default NewScreen;