"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "./useIsMobile";

export default function BackgroundEffects() {
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        frameRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-vintage-navy" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-vintage-burgundy/10 rounded-full blur-[90px]" />
        <div className="absolute inset-0 vintage-texture" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-vintage-navy" />
      
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] transition-transform duration-1000 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(191, 9, 47, 0.4) 0%, transparent 70%)",
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
      />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-vintage-burgundy/15 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-vintage-slate/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-vintage-cream/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTAsMTkzLDE4MiwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <div className="absolute top-20 left-10 w-2 h-2 bg-vintage-burgundy rounded-full animate-pulse-slow" />
      <div className="absolute top-40 right-20 w-1 h-1 bg-vintage-cream/60 rounded-full animate-pulse-slow animation-delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-vintage-slate rounded-full animate-pulse-slow animation-delay-2000" />
      <div className="absolute top-1/2 right-10 w-1 h-1 bg-vintage-burgundy/70 rounded-full animate-pulse-slow animation-delay-3000" />
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-vintage-cream/40 rounded-full animate-pulse-slow animation-delay-4000" />

      <div className="absolute inset-0 vintage-texture" />
    </div>
  );
}
