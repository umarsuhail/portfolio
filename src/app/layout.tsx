import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import ChatBot from "./chatbot/ChatBot";
import BackgroundEffects from "./components/BackgroundEffects";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";
import ScrollController from "./components/ScrollController";

const BASE_URL = "https://umar.website";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Umar Suhail | Lead Frontend Engineer & Application Developer",
    template: "%s | Umar Suhail",
  },
  description:
    "Lead Frontend Engineer with 7+ years building high-performance React & Next.js applications. Currently at Emirates Face Recognition (EFR), UAE. Available for senior frontend roles.",
  keywords: [
    "Lead Frontend Engineer",
    "React Developer UAE",
    "Next.js Developer",
    "TypeScript Expert",
    "UI/UX Engineer",
    "Frontend Architect",
    "Emirates Face Recognition",
    "React.js",
    "Redux Toolkit",
    "Tailwind CSS",
    "JavaScript Developer",
    "Web Performance Optimisation",
    "Design Systems",
    "Umar Suhail",
  ],
  authors: [{ name: "Umar Suhail", url: BASE_URL }],
  creator: "Umar Suhail",
  publisher: "Umar Suhail",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Umar Suhail | Lead Frontend Engineer & Application Developer",
    description:
      "7+ years of React, Next.js & TypeScript. Building scalable UIs and design systems. Currently at Emirates Face Recognition, UAE.",
    siteName: "Umar Suhail Portfolio",
    images: [
      {
        url: "/images/me-s.jpg",
        width: 1200,
        height: 630,
        alt: "Umar Suhail – Lead Frontend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Suhail | Lead Frontend Engineer",
    description:
      "7+ years React & Next.js. Frontend architecture, design systems, performance optimisation.",
    images: ["/images/me-s.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const person = {
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Umar Suhail",
  url: BASE_URL,
  email: "umarsuhail112@gmail.com",
  telephone: "+971568323258",
  jobTitle: "Lead Frontend Engineer & Application Developer",
  description:
    "Lead Frontend Engineer with 7+ years building scalable React & Next.js applications at Emirates Face Recognition (EFR), UAE. Specialising in UI/UX design, frontend architecture, TypeScript, and performance optimisation.",
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/me-s.jpg`,
    width: 400,
    height: 400,
  },
  sameAs: [
    "https://www.linkedin.com/in/umar-suhail/",
    "https://github.com/umarsuhail",
    BASE_URL,
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "AE",
    addressRegion: "Dubai",
  },
  worksFor: {
    "@type": "Organization",
    name: "Emirates Face Recognition (EFR)",
    address: { "@type": "PostalAddress", addressCountry: "AE" },
  },
  knowsAbout: [
    "React.js", "Next.js", "TypeScript", "JavaScript",
    "UI/UX Design", "Frontend Architecture", "Design Systems",
    "Redux Toolkit", "Tailwind CSS", "Performance Optimisation",
  ],
};

// ProfilePage tells Google this is a personal portfolio — enables rich author cards
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: "Umar Suhail – Lead Frontend Engineer Portfolio",
  description:
    "Portfolio of Umar Suhail, Lead Frontend Engineer at Emirates Face Recognition, UAE.",
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  mainEntity: person,
};

// WebSite schema — enables the site name to appear in search results
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Umar Suhail",
  description: "Portfolio of Umar Suhail — Lead Frontend Engineer & Application Developer, UAE.",
  publisher: { "@id": `${BASE_URL}/#person` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([profilePageSchema, websiteSchema]),
          }}
        />
      </head>
      <body
        className={`${quicksand.variable} font-sans antialiased bg-[#030014] text-white min-h-screen`}
      >
        <BackgroundEffects />
        <Nav />
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
        <ScrollController />
        <ChatBot />
      </body>
    </html>
  );
}
