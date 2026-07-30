"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import useIsMobile from "./useIsMobile";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollController() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [scrollPulse, setScrollPulse] = useState(0);
  const lastPulseRef = useRef(0);
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
        if (
          scrolled > 0 &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
          performance.now() - lastPulseRef.current > 180
        ) {
          lastPulseRef.current = performance.now();
          setScrollPulse((current) => current + 1);
        }
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
    if (progress > 0.88) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  const strokeDash = progress * CIRCUMFERENCE;
  const atTop = progress > 0.88;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={atTop ? "Back to top" : "Scroll down"}
      className={[
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
        isResumeBuilder
          ? "bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] xl:bottom-6"
          : "bottom-6",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
    >
      <div
        key={scrollPulse}
        className={[
          `${isMobile ? "h-[68px] w-[68px]" : "h-[96px] w-[96px]"} relative group transition-transform duration-200 motion-safe:animate-[scroll-controller-pulse_0.32s_ease-out]`,
          "cursor-pointer active:scale-95",
        ].join(" ")}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-[#E62429]/10 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Dark backdrop */}
        <div
          className={[
            "absolute inset-0 rounded-full bg-[#0B1026]/75 backdrop-blur-md border shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-colors",
            "border-white/10 group-hover:border-[#E62429]/70",
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
            stroke="#E62429"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${CIRCUMFERENCE}`}
            style={{ transition: "stroke-dasharray 0.15s ease" }}
          />
        </svg>

        {/* Spider mark */}
        <div
          className={[
            "absolute inset-0 flex items-center justify-center",
            isMobile ? "pb-2.5" : "pb-3",
          ].join(" ")}
        >
          <Icon
            icon="game-icons:spider-alt"
            className={[
              "text-[#F4E9E8] drop-shadow-[0_0_8px_rgba(230,36,41,0.6)] transition-transform duration-200",
                "group-hover:scale-110",
              isMobile ? "text-[26px]" : "text-[38px]",
            ].join(" ")}
            aria-hidden
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
              className="text-[#E62429] fill-current opacity-90"
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

      {/* First-time scroll hint (mobile) */}
      {isMobile && visible && showHint && !atTop && (
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#030014]/80 px-2 py-1 text-[10px] font-medium tracking-wide text-white/65 backdrop-blur-sm">
          Tap to scroll
        </span>
      )}

      {/* Back-to-top hint when the page is fully scrolled */}
      {visible && atTop && (
        <span className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full border border-[#E62429]/40 bg-[#0B1026]/85 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#F4A0A2] backdrop-blur-sm animate-pulse">
          <svg width="9" height="9" viewBox="0 0 10 10" className="fill-current" aria-hidden="true">
            <path d="M5 1 L9 7 L1 7 Z" />
          </svg>
          {isMobile ? "Tap to scroll up" : "Click to scroll up"}
        </span>
      )}
    </button>
  );
}
