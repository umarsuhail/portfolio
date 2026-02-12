import { lazy, Suspense } from "react";
import Card from "./components/Card";

const Experience = lazy(() => import("./components/Experience"));
const SkillUniverse = lazy(() => import("./components/SkillUniverse"));
const ProjectsA = lazy(() => import("./components/ProjectsA"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        <p className="text-white/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative">
      <Card />

      <Suspense fallback={<LoadingFallback />}>
        <Experience />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <SkillUniverse />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ProjectsA />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </main>
  );
}
