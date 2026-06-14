"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const CHAMFER = 13; // px — diagonal cut size

// Build SVG path for a rectangle with two chamfered corners:
// top-right and bottom-left cut, others square.
function makeSvgPath(w: number, h: number, c: number) {
  return [
    `M 0,0`,
    `L ${w - c},0`,   // top-right chamfer start
    `L ${w},${c}`,    // top-right chamfer end
    `L ${w},${h}`,    // bottom-right (square)
    `L ${c},${h}`,    // bottom-left chamfer start
    `L 0,${h - c}`,  // bottom-left chamfer end
    `Z`,
  ].join(" ");
}

// CSS clip-path version (responsive, uses calc + px)
function makeCssClipPath(c: number) {
  return `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, ${c}px 100%, 0 calc(100% - ${c}px))`;
}

interface BeveledCTAProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  download?: string;
}

export default function BeveledCTA({
  href,
  icon,
  children,
  variant = "primary",
  download,
}: BeveledCTAProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const measureRef    = useRef<SVGPathElement>(null);
  const [size, setSize]         = useState({ w: 0, h: 0 });
  const [pathLen, setPathLen]   = useState(500);
  const [hovered, setHovered]   = useState(false);

  // Measure the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Get SVG path length once size is known
  useEffect(() => {
    if (measureRef.current && size.w > 0) {
      setPathLen(measureRef.current.getTotalLength());
    }
  }, [size]);

  const isPrimary  = variant === "primary";
  const svgD       = size.w > 0 ? makeSvgPath(size.w, size.h, CHAMFER) : "";
  const clipPath   = makeCssClipPath(CHAMFER);

  // Colors
  const buttonBg     = isPrimary
    ? "linear-gradient(135deg, #8A6A1A 0%, #5F4A10 100%)"
    : "#FFFFFF";
  const textColor    = isPrimary ? "#ffffff" : "#0F172A";
  const staticBorder = isPrimary ? "rgba(200,168,75,0.50)" : "rgba(15,23,42,0.18)";
  const beam1Color   = isPrimary ? "rgba(255,215,60,0.95)" : "rgba(200,168,75,0.85)";
  const beam2Color   = isPrimary ? "rgba(200,168,75,0.55)" : "rgba(200,168,75,0.45)";
  const hoverShadow  = isPrimary
    ? "0 10px 30px rgba(138,106,26,0.48), 0 4px 10px rgba(138,106,26,0.28)"
    : "0 8px 24px rgba(15,23,42,0.12), 0 2px 6px rgba(15,23,42,0.07), 0 0 0 1px rgba(200,168,75,0.25)";
  const restShadow   = isPrimary
    ? "0 4px 14px rgba(138,106,26,0.32), 0 1px 3px rgba(138,106,26,0.18)"
    : "0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)";

  // Beam animation: dash sweeps all the way around the border
  const beamStyle = (beamFraction: number, delay: number): React.CSSProperties => ({
    strokeDasharray: hovered
      ? `${pathLen * beamFraction} ${pathLen * (1 - beamFraction)}`
      : `0 ${pathLen}`,
    strokeDashoffset: hovered ? -pathLen : 0,
    transition: hovered
      ? `stroke-dasharray 0.55s ${delay}s ease, stroke-dashoffset 0.55s ${delay}s ease`
      : `stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease`,
  });

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      style={{ isolation: "isolate" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SVG overlay: static border + two animated beams */}
      {size.w > 0 && (
        <svg
          className="pointer-events-none absolute inset-0"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          fill="none"
          aria-hidden="true"
        >
          {/* Hidden path for measuring length */}
          <path
            ref={measureRef}
            d={svgD}
            stroke="transparent"
            strokeWidth="0"
          />

          {/* Static border — always visible */}
          <path
            d={svgD}
            stroke={staticBorder}
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Beam 1 — primary sweep */}
          <path
            d={svgD}
            stroke={beam1Color}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={beamStyle(0.28, 0)}
          />

          {/* Beam 2 — follows half a lap behind */}
          <path
            d={svgD}
            stroke={beam2Color}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: hovered
                ? `${pathLen * 0.18} ${pathLen * 0.82}`
                : `0 ${pathLen}`,
              strokeDashoffset: hovered ? -(pathLen * 0.55) : 0,
              transition: hovered
                ? `stroke-dasharray 0.55s 0.10s ease, stroke-dashoffset 0.55s 0.10s ease`
                : `stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease`,
            }}
          />
        </svg>
      )}

      {/* Button content */}
      <motion.a
        href={href}
        {...(download ? { download } : {})}
        className="relative inline-flex items-center gap-2 px-5 py-3 font-bold text-[13px] tracking-[0.10em] uppercase select-none"
        style={{
          color:    textColor,
          clipPath: clipPath,
          background: buttonBg,
          boxShadow: restShadow,
          zIndex: 1,
          border: !isPrimary ? "1px solid rgba(15,23,42,0.10)" : "none",
        }}
        whileHover={{
          scale: 1.02,
          y: -3,
          boxShadow: hoverShadow,
          transition: { duration: 0.16, ease: "easeOut" },
        }}
        whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      >
        <Icon icon={icon} className="text-[15px] shrink-0" />
        <span>{children}</span>
      </motion.a>
    </div>
  );
}
