import type { Metadata } from "next";
import Card from "./components/Card";
import HomeDeferredSections from "./components/HomeDeferredSections";
import "./css/landing.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
        text: "You can contact Umar Suhail by email at umarsuhail112@gmail.com, on LinkedIn at linkedin.com/in/umar-suhail, or on WhatsApp at +971 551912074 (UAE) or +91 9497656243 (India). His portfolio is at umar.website.",
      },
    },
  ],
};

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
        <div
          className="spidey-progress fixed top-0 left-0 right-0 h-1 z-50 origin-left scale-x-0"
          aria-hidden
        />

        <Card />
        <HomeDeferredSections />
      </main>
    </>
  );
}
