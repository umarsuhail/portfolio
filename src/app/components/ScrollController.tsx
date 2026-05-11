"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { usePathname } from "next/navigation";
import GlobeCanvas from "./GlobeCanvas";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollController() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const externalLambdaRef = useRef(0);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startScrollY: number;
    didDrag: boolean;
  } | null>(null);
  const isResumeBuilder = pathname?.startsWith("/resume-builder");

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;
      setProgress(p);
      setVisible(scrolled > 80);
      // 2 full rotations across the entire page length
      externalLambdaRef.current = p * 720;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (dragRef.current?.didDrag) return;
    if (progress > 0.88) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollY: window.scrollY,
      didDrag: false,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const distance = Math.hypot(dx, dy);

    if (distance < 5) return;

    drag.didDrag = true;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const nextY = Math.max(0, Math.min(total, drag.startScrollY - dy * 3));
    window.scrollTo({ top: nextY, behavior: "auto" });

    // Let horizontal thumb movement spin the globe a little while vertical drag scrolls.
    externalLambdaRef.current += dx * 0.02;
  };

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }

    if (drag.didDrag) {
      window.setTimeout(() => {
        if (dragRef.current === drag) dragRef.current = null;
      }, 0);
    } else {
      dragRef.current = null;
    }
  };

  const strokeDash = progress * CIRCUMFERENCE;
  const atTop = progress > 0.88;

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={atTop ? "Back to top" : "Scroll down"}
      className={[
        "fixed left-1/2 -translate-x-1/2 z-50 touch-none transition-all duration-500 ease-out",
        isResumeBuilder
          ? "bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] xl:bottom-6"
          : "bottom-6",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
    >
      <div
        className={[
          "relative h-[96px] w-[96px] group transition-transform duration-200",
          dragging ? "scale-105 cursor-grabbing" : "cursor-grab active:scale-105",
        ].join(" ")}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-[#0081A7]/10 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Dark backdrop */}
        <div
          className={[
            "absolute inset-0 rounded-full bg-[#030014]/70 backdrop-blur-md border shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-colors",
            dragging ? "border-[#0081A7]/70" : "border-white/10",
          ].join(" ")}
        />

        {/* Progress ring */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 96 96"
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="48" cy="48" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2"
          />
          {/* Progress arc */}
          <circle
            cx="48" cy="48" r={RADIUS}
            fill="none"
            stroke="#0081A7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${CIRCUMFERENCE}`}
            style={{ transition: "stroke-dasharray 0.15s ease" }}
          />
        </svg>

        {/* Globe */}
        <div className="absolute inset-0 flex items-center justify-center pb-3">
          <GlobeCanvas
            size={68}
            globeRadius={30}
            speed={8}
            tilt={16}
            externalLambdaRef={externalLambdaRef}
          />
        </div>

        {/* Percentage / icon at bottom */}
        <div className="absolute bottom-[10px] left-0 right-0 flex justify-center">
          {atTop ? (
            <svg
              width="10" height="10" viewBox="0 0 10 10"
              className="text-[#0081A7] fill-current opacity-90"
              aria-hidden="true"
            >
              <path d="M5 1 L9 7 L1 7 Z" />
            </svg>
          ) : (
            <span className="text-[9px] font-semibold tracking-wide text-white/50 leading-none tabular-nums">
              {Math.round(progress * 100)}%
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
