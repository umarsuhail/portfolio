"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Experience = lazy(() => import("./Experience"));
const SkillUniverse = lazy(() => import("./SkillUniverse"));
const ProjectsA = lazy(() => import("./ProjectsA"));
const SpideyFeature = lazy(() => import("./SpideyFeature"));
const FAQ = lazy(() => import("./FAQ"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));

function SectionSkeleton({ minHeight = 360 }: { minHeight?: number }) {
  return <div aria-hidden style={{ minHeight }} />;
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

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "160px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

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
      <LazyWhenNear minHeight={640}>
        <Experience />
      </LazyWhenNear>
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
