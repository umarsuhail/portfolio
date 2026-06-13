import { lazy, Suspense } from "react";
import type { Metadata } from "next";
import Card from "./components/Card";

// PPR: this page gets a static shell pre-rendered at build time;
// each Suspense boundary streams in independently on the client.
export const experimental_ppr = true;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const Experience = lazy(() => import("./components/Experience"));
const SkillUniverse = lazy(() => import("./components/SkillUniverse"));
const ProjectsA = lazy(() => import("./components/ProjectsA"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function SectionSkeleton({ height = "py-20" }: { height?: string }) {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-vintage-burgundy/30 border-t-vintage-burgundy animate-spin" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-32 rounded bg-white/5 animate-pulse" />
          <div className="h-2 w-24 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative">
      {/* Static — prerendered in PPR shell */}
      <Card />

      {/* Each section streams independently */}
      <Suspense fallback={<SectionSkeleton height="py-24" />}>
        <Experience />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="py-24" />}>
        <SkillUniverse />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="py-24" />}>
        <ProjectsA />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="py-16" />}>
        <Contact />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="py-10" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
