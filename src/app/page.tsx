import React, { lazy, Suspense } from "react";
import Card from "./components/Card";
import { quickSand } from "./fonts/fonts";

// Lazy load components
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const Footer = lazy(() => import("./components/Footer"));

export default function Home() {
  return (
    <div className={`min-h-screen md:flex md:flex-col items-center justify-center bg-gray-900 ${quickSand.className}`}>
      <Card />
      
      {/* Lazy loaded components */}
      <Suspense fallback={<div className="text-white">Loading Skills...</div>}>
        <Skills />
      </Suspense>
      
      <Suspense fallback={<div className="text-white">Loading Projects...</div>}>
        <Projects />
      </Suspense>
      
      <Suspense fallback={<div className="text-white">Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
