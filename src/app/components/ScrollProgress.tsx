"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, window.scrollY / total) : 0;
        if (ref.current) ref.current.style.transform = `scaleX(${p})`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="spidey-progress fixed top-0 left-0 right-0 h-1 z-50 origin-left scale-x-0"
      aria-hidden
    />
  );
}
