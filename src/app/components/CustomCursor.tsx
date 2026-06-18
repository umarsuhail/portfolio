"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth follow.
  const x = useSpring(rawX, { stiffness: 700, damping: 45, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 700, damping: 45, mass: 0.35 });

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

  return (
    <motion.img
      src="/images/spider-r.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ x, y, width: 40, height: 40 }}
      animate={{
        scale:   clicking ? 0.82 : hovered ? 1.18 : 1,
        opacity: visible ? 1 : 0,
        filter:  hovered ? "drop-shadow(0 0 6px rgba(212,175,55,0.55))" : "none",
      }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 select-none object-contain"
    />
  );
}
