"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Dot snaps fast
  const dotX = useSpring(rawX, { stiffness: 900, damping: 50, mass: 0.3 });
  const dotY = useSpring(rawY, { stiffness: 900, damping: 50, mass: 0.3 });

  // Ring lags behind
  const ringX = useSpring(rawX, { stiffness: 180, damping: 28, mass: 0.6 });
  const ringY = useSpring(rawY, { stiffness: 180, damping: 28, mass: 0.6 });

  const [hovered, setHovered]   = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible]   = useState(false);
  const isTouch = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouch.current = true;
      return;
    }

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = el?.closest(
        'a, button, [role="button"], input, textarea, select, label'
      );
      setHovered(!!clickable);
    };

    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [rawX, rawY, visible]);

  if (isTouch.current) return null;

  const dotSize  = clicking ? 5 : 7;
  const ringSize = 32;

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width:      dotSize,
            height:     dotSize,
            background: hovered ? "#D4AF37" : "#9ca3af",
            boxShadow:  hovered
              ? "0 0 8px 2px rgba(212,175,55,0.6)"
              : "0 0 4px 1px rgba(156,163,175,0.3)",
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="rounded-full"
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width:     ringSize,
            height:    ringSize,
            borderColor: hovered
              ? "rgba(212,175,55,0.85)"
              : "rgba(156,163,175,0.4)",
            boxShadow: hovered
              ? "0 0 14px 2px rgba(212,175,55,0.22)"
              : "none",
            scale:   clicking ? 0.88 : 1,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full border border-solid"
          style={{ background: "transparent" }}
        />
      </motion.div>
    </>
  );
}
