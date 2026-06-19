"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// spider.svg is the resting pointer; turn.gif is the hover/click effect.
// turn.gif is 25 frames ≈ 1500ms for a single play-through.
const GIF_DURATION = 1500;

// Both assets share a ~0.56 (w/h) tall aspect ratio.
const POINTER_H = 40;
const POINTER_W = Math.round((POINTER_H * 468.27) / 839); // ≈ 22
const GIF_H = 58;
const GIF_W = Math.round((GIF_H * 474) / 846); // ≈ 33

export default function CustomCursor() {
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { stiffness: 1000, damping: 50, mass: 0.25 });
  const y = useSpring(rawY, { stiffness: 1000, damping: 50, mass: 0.25 });

  const [visible, setVisible] = useState(false);
  const [playGif, setPlayGif] = useState(false);
  // Bumped on every trigger so the <img> remounts and the gif replays from frame 0.
  const [gifKey, setGifKey] = useState(0);

  const isTouch = useRef(false);
  const hoverRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouch.current = true;
      return;
    }

    // Play the gif exactly one pass, then fall back to the static spider.
    const trigger = () => {
      setGifKey((k) => k + 1);
      setPlayGif(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(
        () => setPlayGif(false),
        GIF_DURATION
      );
    };

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, label'
      );

      // Fire once on the rising edge of entering a clickable element.
      if (clickable && !hoverRef.current) {
        hoverRef.current = true;
        trigger();
      } else if (!clickable) {
        hoverRef.current = false;
      }
    };

    const onDown = () => trigger(); // play once on click
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [rawX, rawY, visible]);

  if (isTouch.current) return null;

  return (
    <motion.div
      style={{ x, y, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
    >
      {playGif ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={gifKey}
          src={`/images/turn.gif?t=${gifKey}`}
          alt=""
          width={GIF_W}
          height={GIF_H}
          style={{ width: GIF_W, height: GIF_H, display: "block" }}
          draggable={false}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/spider.svg"
          alt=""
          width={POINTER_W}
          height={POINTER_H}
          style={{ width: POINTER_W, height: POINTER_H, display: "block" }}
          draggable={false}
        />
      )}
    </motion.div>
  );
}
