"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Web = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  spokes: string; // radial threads
  rings: string; // spiral connecting threads
};

let _id = 0;

const CX = 50;
const CY = 50;
const R = 46;

// Build a fresh, slightly-irregular web so no two clicks look identical.
function buildWeb() {
  const count = 8 + Math.floor(Math.random() * 3); // 8–10 spokes
  const ringCount = 3 + Math.floor(Math.random() * 2); // 3–4 rings

  const angles = Array.from({ length: count }, (_, i) => {
    const base = (i / count) * Math.PI * 2;
    return base + (Math.random() - 0.5) * 0.18; // jitter for organic feel
  });

  const pt = (a: number, r: number): [number, number] => [
    CX + Math.cos(a) * r,
    CY + Math.sin(a) * r,
  ];

  let spokes = "";
  for (const a of angles) {
    const [x, y] = pt(a, R);
    spokes += `M${CX},${CY}L${x.toFixed(1)},${y.toFixed(1)}`;
  }

  let rings = "";
  for (let ring = 1; ring <= ringCount; ring++) {
    const radius = (R / ringCount) * ring * (0.85 + Math.random() * 0.15);
    angles.forEach((a, i) => {
      const [x, y] = pt(a, radius * (0.92 + Math.random() * 0.08));
      rings += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    rings += "Z";
  }

  return { spokes, rings };
}

function WebMark({ web, onDone }: { web: Web; onDone: (id: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      onDone(web.id);
      return;
    }
    const tl = gsap.timeline({ onComplete: () => onDone(web.id) });
    tl.fromTo(
      el,
      { opacity: 0, scale: 0.15, rotate: web.rotate },
      { opacity: 0.9, scale: 1, rotate: web.rotate, duration: 0.4, ease: "power3.out" }
    )
      .to(el, { opacity: 0.65, duration: 0.2 })
      .to(el, { opacity: 0, scale: 1.12, duration: 0.3, ease: "power1.in" }, "+=0.15");

    return () => {
      tl.kill();
    };
  }, [web.id, web.rotate, onDone]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: web.x,
        top: web.y,
        width: web.size,
        height: web.size,
        marginLeft: -web.size / 2,
        marginTop: -web.size / 2,
        pointerEvents: "none",
        zIndex: 9990,
        opacity: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.45))" }}
      >
        <path
          d={web.spokes}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={0.6}
          strokeLinecap="round"
        />
        <path
          d={web.rings}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
        <circle cx={CX} cy={CY} r={1.2} fill="rgba(255,255,255,0.9)" />
      </svg>
    </div>
  );
}

export default function SpiderWebClick() {
  const [webs, setWebs] = useState<Web[]>([]);

  const removeWeb = useCallback((id: number) => {
    setWebs((prev) => prev.filter((w) => w.id !== id));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'a, button, [role="button"], input, textarea, select, label'
        )
      )
        return;

      const id = _id++;
      const { spokes, rings } = buildWeb();
      setWebs((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
          rotate: Math.random() * 360,
          size: 120 + Math.random() * 70,
          spokes,
          rings,
        },
      ]);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {webs.map((w) => (
        <WebMark key={w.id} web={w} onDone={removeWeb} />
      ))}
    </>
  );
}
