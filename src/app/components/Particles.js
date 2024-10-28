import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Fireworks = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    // Load the particles engine
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "rgba(0, 0, 0, 0)", // Transparent background
        },
      },
      fpsLimit: 60,
      interactivity: {
        detectsOn: "window",
        events: {
          onClick: { enable: false },
          onHover: { enable: false },
        },
      },
      particles: {
        number: {
          value: 0, // Start with no particles
        },
        color: {
          value: [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#00ffff",
          ], // Different colors for fireworks
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 1,
        },
        size: {
          value: { min: 5, max: 10 }, // Adjust size as needed
          animation: {
            enable: true,
            speed: 20,
            minimumValue: 1,
            sync: false,
          },
        },
        life: {
          duration: {
            sync: true,
            value: 1, // Short duration for the firework
          },
          count: 1,
        },
        move: {
          enable: true,
          speed: 10,
          direction: "none",
          outModes: { default: "destroy" },
        },
      },
      emitters: {
        direction: "none",
        rate: {
          quantity: 30, // Emit multiple particles at once
          delay: 0.1, // Delay between bursts
        },
        size: { width: 0, height: 0 },
        position: {
          x: 50,
          y: 50, // Center of the canvas
        },
      },
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="fireworks"
        options={options}
      />
    );
  }

  return null;
};

export default Fireworks;
