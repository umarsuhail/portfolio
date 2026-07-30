"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function HeroTextScroller({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      if (!wrapper || !content) return;
      const target = Math.max(220, content.scrollHeight - wrapper.clientHeight);
      const max = Math.max(0, target);
      setMaxOffset(max);
      const clamped = Math.min(offsetRef.current, max);
      offsetRef.current = clamped;
      setOffset(clamped);
    });

    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaY;
      if (delta > 0 && offsetRef.current >= maxOffset) {
        return; // allow normal page scroll
      }
      if (delta < 0 && offsetRef.current <= 0) {
        return; // allow normal page scroll
      }

      event.preventDefault();
      event.stopPropagation();

      const next = Math.min(maxOffset, Math.max(0, offsetRef.current + delta));
      offsetRef.current = next;
      setOffset(next);
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [maxOffset]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let startY = 0;
    let isTouching = false;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      startY = event.touches[0].clientY;
      isTouching = true;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isTouching || event.touches.length !== 1) return;
      const delta = startY - event.touches[0].clientY;
      if (delta > 0 && offsetRef.current >= maxOffset) return;
      if (delta < 0 && offsetRef.current <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      startY = event.touches[0].clientY;
      const next = Math.min(maxOffset, Math.max(0, offsetRef.current + delta));
      offsetRef.current = next;
      setOffset(next);
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);

    return () => {
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
    };
  }, [maxOffset]);

  const progress = maxOffset > 0 ? Math.min(1, offset / maxOffset) : 0;

  const glowOpacity = Math.min(1, 0.4 + progress * 0.6);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-slate-950/60 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/90 to-transparent"
        style={{ opacity: 0.9 }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 to-transparent"
        style={{ opacity: 0.9 }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10"
        style={{ boxShadow: `0 0 120px rgba(230,36,41,${glowOpacity})` }}
      />
      <div ref={wrapperRef} className="relative z-10 max-h-[calc(100vh-220px)] px-5 py-6 md:px-8 md:py-8">
        <div
          ref={contentRef}
          className="space-y-8 transition-transform duration-150 will-change-transform"
          style={{ transform: `translateY(-${offset}px)` }}
        >
          {children}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {progress < 1 ? "Scroll text to continue" : "Page scroll enabled"}
      </div>
    </div>
  );
}
