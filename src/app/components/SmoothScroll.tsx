"use client";

import { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <div className="relative" style={{ scrollBehavior: 'smooth', scrollSnapType: 'y mandatory' }}>
      {children}
    </div>
  );
}
