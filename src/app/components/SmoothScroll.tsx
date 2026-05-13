"use client";

import { ReactNode } from "react";
import useIsMobile from "./useIsMobile";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className="relative"
      style={{
        scrollBehavior: "smooth",
        ...(isMobile ? {} : { scrollSnapType: "y mandatory" }),
      }}
    >
      {children}
    </div>
  );
}
