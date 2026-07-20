import { lazy, Suspense } from "react";
import type { Metadata } from "next";
import Card from "./components/Card";
import ScrollProgress from "./components/ScrollProgress";
import SpideyFeature from "./components/SpideyFeature";
import "./css/landing.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const Experience    = lazy(() => import("./components/Experience"));
const SkillUniverse = lazy(() => import("./components/SkillUniverse"));
const ProjectsA     = lazy(() => import("./components/ProjectsA"));
const FAQ           = lazy(() => import("./components/FAQ"));
const Contact       = lazy(() => import("./components/Contact"));
const Footer        = lazy(() => import("./components/Footer"));

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Umar Suhail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Umar Suhail is a Lead Frontend Engineer and software developer from India, currently based in Abu Dhabi, UAE. With 7+ years of experience, he builds high-performance web applications using React and Next.js, and currently works at Emirates Face Recognition (EFR) in Abu Dhabi.",
      },
    },
    {
      "@type": "Question",
      name: "What does Umar Suhail specialise in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Umar Suhail specialises in React.js, Next.js, TypeScript, and UI/UX design. He is an expert in frontend architecture, design systems, Redux Toolkit, Tailwind CSS, performance optimisation, and accessibility (WCAG). He also designs with Figma and Adobe Creative Suite.",
      },
    },
    {
      "@type": "Question",
      name: "Where does Umar Suhail work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Umar Suhail works at Emirates Face Recognition (EFR) in Abu Dhabi, UAE, as an Application Developer. Previously he was Development Team Lead at Epixel Solutions, Software Engineer at Aspire Systems, and UI Developer at Uvionics Tech — all in India.",
      },
    },
    {
      "@type": "Question",
      name: "Is Umar Suhail available for freelance or new roles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Umar Suhail is available for senior frontend engineering roles and select freelance projects. He is open to opportunities in UAE, India, and remote positions. You can reach him at umarsuhail112@gmail.com or via LinkedIn.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Umar Suhail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can contact Umar Suhail by email at umarsuhail112@gmail.com, on LinkedIn at linkedin.com/in/umar-suhail, or on WhatsApp at +971 568 323 258. His portfolio is at umar.website.",
      },
    },
  ],
};

function SectionSkeleton({ height = "py-20" }: { height?: string }) {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#E62429]/25 border-t-[#E62429] animate-spin" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-32 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-24 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main
        data-landing
        className="relative min-h-screen overflow-hidden text-spidey-silk"
      >
        {/* Spider-Man grunge background + web overlay */}
        <div className="spidey-bg" aria-hidden />
        <div className="spidey-web fixed inset-0 -z-[2] opacity-50" aria-hidden />
        <ScrollProgress />

        <Card />

        <Suspense fallback={<SectionSkeleton height="py-24" />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="py-24" />}>
          <SkillUniverse />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="py-24" />}>
          <ProjectsA />
        </Suspense>

        <SpideyFeature />

        <Suspense fallback={<SectionSkeleton height="py-20" />}>
          <FAQ />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="py-16" />}>
          <Contact />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="py-10" />}>
          <Footer />
        </Suspense>
      </main>
    </>
  );
}
