"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { usePathname } from "next/navigation";
import GlobeCanvas from "./GlobeCanvas";
import useIsMobile from "./useIsMobile";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollController() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
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
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, scrolled / total) : 0;
        setProgress(p);
        setVisible(scrolled > (isMobile ? 120 : 80));
        // 2 full rotations across the entire page length (desktop + mobile)
        externalLambdaRef.current = p * 720;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !visible || !showHint) return;
    const timer = window.setTimeout(() => setShowHint(false), 5000);
    return () => window.clearTimeout(timer);
  }, [isMobile, visible, showHint]);

  const handleClick = () => {
    setShowHint(false);
    if (dragRef.current?.didDrag) return;
    if (progress > 0.88) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    setShowHint(false);

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
        "fixed left-1/2 -translate-x-1/2 z-50 touch-pan-y transition-all duration-500 ease-out",
        isResumeBuilder
          ? "bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] xl:bottom-6"
          : "bottom-6",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
    >
      <div
        className={[
          `${isMobile ? "h-[68px] w-[68px]" : "h-[96px] w-[96px]"} relative group transition-transform duration-200`,
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
        <div
          className={[
            "absolute inset-0 flex items-center justify-center",
            isMobile ? "pb-2.5" : "pb-3",
          ].join(" ")}
        >
          <GlobeCanvas
            size={isMobile ? 46 : 68}
            globeRadius={isMobile ? 20 : 30}
            speed={8}
            tilt={16}
            externalLambdaRef={externalLambdaRef}
          />
        </div>

        {/* Percentage / icon at bottom */}
        <div
          className={[
            "absolute left-0 right-0 flex justify-center",
            isMobile ? "bottom-[6px]" : "bottom-[10px]",
          ].join(" ")}
        >
          {atTop ? (
            <svg
              width={isMobile ? "11" : "10"} height={isMobile ? "11" : "10"} viewBox="0 0 10 10"
              className="text-[#0081A7] fill-current opacity-90"
              aria-hidden="true"
            >
              <path d="M5 1 L9 7 L1 7 Z" />
            </svg>
          ) : (
            <span
              className={[
                "font-semibold tracking-wide text-white/50 leading-none tabular-nums",
                isMobile ? "text-[10px]" : "text-[9px]",
              ].join(" ")}
            >
              {Math.round(progress * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* First-time drag hint (mobile) */}
      {isMobile && visible && showHint && !atTop && (
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#030014]/80 px-2 py-1 text-[10px] font-medium tracking-wide text-white/65 backdrop-blur-sm">
          Drag up/down to scroll
        </span>
      )}

      {/* Back-to-top hint when the page is fully scrolled */}
      {visible && atTop && (
        <span className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full border border-[#0081A7]/40 bg-[#030014]/85 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#7fd4ec] backdrop-blur-sm animate-pulse">
          <svg width="9" height="9" viewBox="0 0 10 10" className="fill-current" aria-hidden="true">
            <path d="M5 1 L9 7 L1 7 Z" />
          </svg>
          {isMobile ? "Tap to scroll up" : "Click to scroll up"}
        </span>
      )}
    </button>
  );
}
