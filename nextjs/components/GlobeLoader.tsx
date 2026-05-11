"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

const INK = "#1a1a1a";
const PAPER = "#f1ede5";

type GlobeLoaderProps = {
  /** Pixel size of the loader (square). Default 200. */
  size?: number;
  /** Rotation speed in degrees per second. Default 26. */
  speed?: number;
  /** Tilt in degrees (positive tilts the north pole toward viewer). Default 14. */
  tilt?: number;
  /** Globe radius in CSS px (centered in `size`). Default 68. */
  globeRadius?: number;
  className?: string;
};

export default function GlobeLoader({
  size = 200,
  speed = 26,
  tilt = 14,
  globeRadius = 68,
  className = "",
}: GlobeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    const projection = geoOrthographic()
      .scale(globeRadius)
      .translate([cx, cy])
      .clipAngle(90)
      .precision(0.4);

    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    const sphere = { type: "Sphere" } as const;

    let countries: FeatureCollection<Geometry> | null = null;
    let land: Feature<Geometry> | FeatureCollection<Geometry> | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"
        );
        const world = (await res.json()) as Topology;
        countries = feature(
          world,
          world.objects.countries
        ) as FeatureCollection<Geometry>;
        land = feature(world, world.objects.land) as Feature<Geometry>;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Globe: world data failed to load", e);
      }
    })();

    // ---- Interaction state ----
    let autoLambda = 0;
    let manualLambda = 0;
    let manualPhi = 0;
    let autoPaused = false;
    let lastAutoTime = performance.now();
    let resumeTimer: number | null = null;

    const pauseAuto = () => {
      autoPaused = true;
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
    };
    const scheduleResume = (delay = 1400) => {
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        autoPaused = false;
        lastAutoTime = performance.now();
      }, delay);
    };

    let dragId: number | null = null;
    let dragStartX = 0, dragStartY = 0;
    let dragStartLambda = 0, dragStartPhi = 0;
    const DRAG_GAIN = 0.6;

    const onPointerDown = (e: PointerEvent) => {
      if (dragId !== null) return;
      dragId = e.pointerId;
      try { canvas.setPointerCapture(dragId); } catch {}
      canvas.classList.add("dragging");
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartLambda = manualLambda;
      dragStartPhi = manualPhi;
      pauseAuto();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== dragId) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      manualLambda = dragStartLambda + dx * DRAG_GAIN;
      manualPhi = Math.max(-85, Math.min(85, dragStartPhi - dy * DRAG_GAIN));
    };
    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== dragId) return;
      try { canvas.releasePointerCapture(dragId); } catch {}
      dragId = null;
      canvas.classList.remove("dragging");
      scheduleResume();
    };
    const onLostCapture = () => {
      dragId = null;
      canvas.classList.remove("dragging");
      scheduleResume();
    };
    // Wheel: rotate AND let page scroll naturally (passive listener).
    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX || (e.shiftKey ? e.deltaY : 0);
      const dy = e.deltaY;
      manualLambda += dy * 0.25;
      if (dx) manualPhi = Math.max(-85, Math.min(85, manualPhi - dx * 0.15));
      pauseAuto();
      scheduleResume(900);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("lostpointercapture", onLostCapture);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    const drawSphereOutline = () => {
      ctx.beginPath();
      path(sphere);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = INK;
      ctx.stroke();
    };

    const drawGraticule = () => {
      ctx.beginPath();
      path(graticule);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(26,26,26,0.20)";
      ctx.stroke();
    };

    const drawLand = () => {
      if (!countries) return;
      ctx.beginPath();
      path(countries);
      ctx.fillStyle = INK;
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.beginPath();
      path(countries);
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = PAPER;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.restore();
    };

    const drawBackLand = () => {
      if (!land) return;
      projection.clipAngle(180);
      ctx.beginPath();
      path(land as Feature<Geometry>);
      ctx.fillStyle = INK;
      ctx.globalAlpha = 0.13;
      ctx.fill();
      ctx.globalAlpha = 1;

      projection.clipAngle(90);
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      path(land as Feature<Geometry>);
      ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      if (cancelled) return;
      if (!autoPaused) {
        const dt = (now - lastAutoTime) / 1000;
        autoLambda -= dt * speed;
      }
      lastAutoTime = now;
      const lambda = autoLambda + manualLambda;
      const phi = -tilt + manualPhi;
      projection.rotate([lambda, phi, 0]);

      ctx.clearRect(0, 0, size, size);
      drawBackLand();
      drawGraticule();
      drawLand();
      drawSphereOutline();

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", onLostCapture);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [size, speed, tilt, globeRadius]);

  const center = 100; // viewBox is always 200x200

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Globe canvas underneath; transparent. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full select-none cursor-grab active:cursor-grabbing"
        style={{ background: "transparent", touchAction: "pan-y" }}
      />

      {/* Whirl orbits AROUND the globe, on top so it's never masked. */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
        aria-hidden="true"
      >
        {/* Halo pulse */}
        <circle
          cx={center}
          cy={center}
          r="80"
          fill="none"
          stroke={INK}
          strokeWidth="1"
          className="animate-halo motion-safe-only"
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        />

        {/* Outer dashed ring, CCW, r=96 */}
        <g
          className="animate-spin-ccw-slow motion-safe-only"
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        >
          <circle
            cx={center}
            cy={center}
            r="96"
            fill="none"
            stroke={INK}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray="14 10 4 10 22 10 6 10 30 10 8 10"
          />
        </g>

        {/* Mid ring, CW, r=88 */}
        <g
          className="animate-spin-cw-slow motion-safe-only"
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        >
          <circle
            cx={center}
            cy={center}
            r="88"
            fill="none"
            stroke={INK}
            strokeOpacity="0.55"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 6 24 8 2 6 40 8"
          />
        </g>

        {/* Comet trail #1, fast CW */}
        <g
          className="animate-spin-cw-fast motion-safe-only"
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        >
          <circle cx={center} cy="18" r="2.2" fill={INK} />
          <circle cx={center} cy="18" r="1.6" fill={INK} opacity="0.75" transform={`rotate(14 ${center} ${center})`} />
          <circle cx={center} cy="18" r="1.2" fill={INK} opacity="0.5"  transform={`rotate(26 ${center} ${center})`} />
          <circle cx={center} cy="18" r="0.9" fill={INK} opacity="0.3"  transform={`rotate(36 ${center} ${center})`} />
          <circle cx={center} cy="18" r="0.6" fill={INK} opacity="0.18" transform={`rotate(44 ${center} ${center})`} />
        </g>

        {/* Comet trail #2, fast CCW on opposite side */}
        <g
          className="animate-spin-ccw-fast motion-safe-only"
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        >
          <circle cx={center} cy="182" r="1.6" fill={INK} />
          <circle cx={center} cy="182" r="1.2" fill={INK} opacity="0.6"  transform={`rotate(12 ${center} ${center})`} />
          <circle cx={center} cy="182" r="0.9" fill={INK} opacity="0.35" transform={`rotate(22 ${center} ${center})`} />
        </g>
      </svg>
    </div>
  );
}
