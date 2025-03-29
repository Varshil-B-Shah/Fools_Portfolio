import React, { useEffect, useRef } from "react";

const BlossomBackground = ({
  children,
  width = "100%",
  height = "100vh",
  numPetals = 150,
  numParticles = 30,
  gravity = 0.8,
  windMaxSpeed = 4,
  className = "",
  petalStyles = [
    "petal-style1",
    "petal-style2",
    "petal-style3",
    "petal-style4",
  ],
  backgroundColor = "rgba(0, 0, 0, 0.9)",
  petalColor = "rgba(255, 105, 180, 0.8)",
  particleColor = "rgba(255, 192, 203, 0.5)",
  style = {},
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    class Petal {
      constructor(config = {}) {
        this.customClass = config.customClass || "";
        this.width = config.width || canvas.width;
        this.height = config.height || canvas.height;
        this.x = config.x || Math.random() * this.width;
        this.y = config.y || -Math.random() * this.height * 0.5;
        this.z = config.z || Math.random() * 200;
        this.xSpeedVariation = config.xSpeedVariation || 0;
        this.ySpeed = config.ySpeed || 0;
        this.fromRight = config.fromRight || Math.random() > 0.5;
        this.rotation = {
          axis: "X",
          value: 0,
          speed: Math.random() * 10,
          x: 0,
          ...(config.rotation || {}),
        };
        this.size = Math.random() * 20 + 22;
        this.opacity = Math.random() * 0.3 + 0.7;
      }

      calculateWindSpeed(t, y) {
        const noise = (x) => {
          x = (x * 0.1) % 1;
          return Math.sin(x * Math.PI * 2);
        };

        const windVariation = noise(t * 0.05) * 0.5 + 0.5;
        const baseWind = windMaxSpeed * windVariation;
        const verticalFactor = 1 - y / this.height;
        return baseWind * verticalFactor;
      }

      update(timer) {
        let petalWindSpeed = this.calculateWindSpeed(timer, this.y);
        let xSpeed = petalWindSpeed + this.xSpeedVariation;

        if (this.fromRight) {
          this.x -= xSpeed;
        } else {
          this.x += xSpeed;
        }

        this.y += this.ySpeed;
        this.rotation.value += this.rotation.speed;

        if (
          (this.fromRight && this.x < -10) ||
          (!this.fromRight && this.x > this.width + 10) ||
          this.y > this.height + 10
        ) {
          this.x = Math.random() * this.width;
          this.y = -Math.random() * this.height * 0.5;
          this.z = Math.random() * 200;
          this.xSpeedVariation = Math.random() * 0.8 - 0.4;
          this.ySpeed = Math.random() * 0.5 + gravity;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation.value * Math.PI) / 180);

        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size / 2);
        ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size / 2);

        ctx.fillStyle = petalColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(0, this.size / 2);
        ctx.strokeStyle = "rgba(255, 20, 147, 0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }
    }

    class Particle {
      constructor(width, height) {
        this.reset(width, height);
      }

      reset(width, height) {
        this.x = Math.random() * width;
        this.y = -10;

        this.xSpeed = (Math.random() - 0.5) * 2;
        this.ySpeed = Math.random() * 2 + 1;

        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.7 + 0.3;
      }

      update(width, height) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
          this.reset(width, height);
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    const petals = Array.from(
      { length: numPetals },
      () => new Petal({ width: canvas.width, height: canvas.height })
    );
    const particles = Array.from(
      { length: numParticles },
      () => new Particle(canvas.width, canvas.height)
    );

    let timer = 0;

    function animate() {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      petals.forEach((petal) => {
        petal.update(timer);
        petal.draw(ctx);
      });

      timer++;
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    numPetals,
    numParticles,
    gravity,
    windMaxSpeed,
    backgroundColor,
    particleColor,
    petalColor,
  ]);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={`blossom-background ${className}`}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      {children}
    </div>
  );
};

export default BlossomBackground;
