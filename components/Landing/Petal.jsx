import React from "react";

const Petal = ({ size, left, top }) => {
  const petalStyle = {
    position: "absolute",
    left,
    top,
    width: size,
    height: size,
    pointerEvents: "none",
  };

  return (
    <svg style={petalStyle} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ff9ad2", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#ff69b4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ff5ba7", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#petalGradient)"
        d="M50,0 C20,20 20,80 50,100 C80,80 80,20 50,0 Z"
      />
    </svg>
  );
};

export default Petal;
