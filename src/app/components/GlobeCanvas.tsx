"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

type GlobeCanvasProps = {
  size?: number;
  speed?: number;
  tilt?: number;
  globeRadius?: number;
  /** Ref whose .current is added to the rotation each frame — use for scroll-driven control. */
  externalLambdaRef?: React.MutableRefObject<number>;
  className?: string;
};

export default function GlobeCanvas({
  size = 120,
  speed = 18,
  tilt = 14,
  globeRadius = 52,
  externalLambdaRef,
  className = "",
}: GlobeCanvasProps) {
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
        const res = await fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json");
        const world = (await res.json()) as Topology;
        countries = feature(world, world.objects.countries) as FeatureCollection<Geometry>;
        land = feature(world, world.objects.land) as Feature<Geometry>;
      } catch {
        // silently degrade — globe still spins without land detail
      }
    })();

    let autoLambda = 0;
    let lastAutoTime = performance.now();

    const frame = (now: number) => {
      if (cancelled) return;
      const dt = (now - lastAutoTime) / 1000;
      autoLambda -= dt * speed;
      lastAutoTime = now;

      const lambda = autoLambda + (externalLambdaRef?.current ?? 0);
      const phi = -tilt;
      projection.rotate([lambda, phi, 0]);

      ctx.clearRect(0, 0, size, size);

      // Back-face land (ghosted, through the sphere)
      if (land) {
        projection.clipAngle(180);
        ctx.beginPath();
        path(land as Feature<Geometry>);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fill();
        projection.clipAngle(90);

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        path(land as Feature<Geometry>);
        ctx.fill();
        ctx.restore();
      }

      // Graticule
      ctx.beginPath();
      path(graticule);
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.stroke();

      // Countries
      if (countries) {
        ctx.beginPath();
        path(countries);
        ctx.fillStyle = "rgba(200,225,240,0.88)";
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.beginPath();
        path(countries);
        ctx.lineWidth = 0.35;
        ctx.strokeStyle = "rgba(10,20,40,0.45)";
        ctx.stroke();
        ctx.restore();
      }

      // Sphere outline
      ctx.beginPath();
      path(sphere);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.stroke();

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [size, speed, tilt, globeRadius, externalLambdaRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`select-none ${className}`}
      style={{ background: "transparent" }}
    />
  );
}
