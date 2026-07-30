"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Experience from "./Experience";
import useIsMobile from "./useIsMobile";

const SkillUniverse = lazy(() => import("./SkillUniverse"));
const ProjectsA = lazy(() => import("./ProjectsA"));
const SpideyFeature = lazy(() => import("./SpideyFeature"));
const FAQ = lazy(() => import("./FAQ"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));

function SectionSkeleton({ minHeight = 360 }: { minHeight?: number }) {
  return (
    <div
      aria-hidden
      className="home-section-skeleton relative overflow-hidden"
      style={{ "--section-skeleton-height": `${minHeight}px` } as React.CSSProperties}
    >
      <div className="absolute inset-x-4 top-10 h-px bg-gradient-to-r from-transparent via-spidey-red/40 to-transparent" />
      <div className="absolute left-1/2 top-10 h-1.5 w-20 -translate-x-1/2 rounded-full bg-spidey-red/70 shadow-[0_0_14px_rgba(230,36,41,0.65)]" />
    </div>
  );
}

function LazyWhenNear({
  children,
  minHeight,
}: {
  children: React.ReactNode;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: isMobile ? "900px 0px" : "240px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, visible]);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<SectionSkeleton minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton minHeight={minHeight} />
      )}
    </div>
  );
}

export default function HomeDeferredSections() {
  return (
    <>
      <Experience />
      <LazyWhenNear minHeight={640}>
        <SkillUniverse />
      </LazyWhenNear>
      <LazyWhenNear minHeight={720}>
        <ProjectsA />
      </LazyWhenNear>
      <LazyWhenNear minHeight={560}>
        <SpideyFeature />
      </LazyWhenNear>
      <LazyWhenNear minHeight={480}>
        <FAQ />
      </LazyWhenNear>
      <LazyWhenNear minHeight={420}>
        <Contact />
      </LazyWhenNear>
      <LazyWhenNear minHeight={280}>
        <Footer />
      </LazyWhenNear>
    </>
  );
}
