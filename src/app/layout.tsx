import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "./components/Nav";
import DeferredClientFeatures from "./components/DeferredClientFeatures";
import HelpWidget from "./components/HelpWidget";

const BASE_URL = "https://www.umar.website";

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
    default:
      "Umar Suhail | Next.js & Frontend Developer in Abu Dhabi",
    template: "%s | Umar Suhail",
  },
  description:
    "Umar Suhail is a Next.js developer and frontend developer in Abu Dhabi, UAE. With 7+ years of experience, he builds React, Next.js, and TypeScript applications at Emirates Face Recognition (EFR). Also searched as Umer Suhail, Omer Suhail, and Umar Sohail.",
  keywords: [
    "Umar Suhail",
    "Umer Suhail",
    "Omer Suhail",
    "Umar Sohail",
    "Umer Sohail",
    "Omer Sohail",
    "Umar Suhail developer",
    "Umar Suhail UAE",
    "Umar Suhail India",
    "Umar Suhail React developer",
    "Umar Suhail frontend engineer",
    "Lead Frontend Engineer UAE",
    "Frontend Developer Abu Dhabi",
    "Next.js Developer Abu Dhabi",
    "React Developer Abu Dhabi",
    "Next.js Developer UAE",
    "Frontend Engineer India",
    "TypeScript Expert",
    "UI/UX Engineer Abu Dhabi",
    "Emirates Face Recognition developer",
    "software engineer UAE India",
    "React.js developer Abu Dhabi",
    "JavaScript developer UAE",
  ],
  authors: [{ name: "Umar Suhail", url: BASE_URL }],
  creator: "Umar Suhail",
  publisher: "Umar Suhail",
  alternates: {
    canonical: "/",
    languages: {
      "en-AE": "/",
      "en-IN": "/",
      en: "/",
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_AE",
    alternateLocale: ["en_IN", "en_US"],
    url: BASE_URL,
    title: "Umar Suhail | Next.js & Frontend Developer in Abu Dhabi",
    description:
      "Umar Suhail is a Next.js and frontend developer in Abu Dhabi, UAE, with 7+ years of React and TypeScript expertise at Emirates Face Recognition.",
    siteName: "Umar Suhail",
    images: [
      {
        url: "/images/me-s.jpeg",
        width: 1200,
        height: 630,
        alt: "Umar Suhail – Lead Frontend Engineer, Abu Dhabi UAE",
      },
    ],
  },
  other: {
    "profile:first_name": "Umar",
    "profile:last_name": "Suhail",
    "profile:username": "umarsuhail",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Suhail | Next.js & Frontend Developer in Abu Dhabi",
    description:
      "Next.js and frontend developer in Abu Dhabi, UAE. 7+ years building React and TypeScript applications.",
    images: ["/images/me-s.jpeg"],
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

// ── Structured data ───────────────────────────────────────────────────────────

const person = {
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Umar Suhail",
  alternateName: ["Umer Suhail", "Omer Suhail", "Umar Sohail", "Umer Sohail", "Omer Sohail"],
  url: BASE_URL,
  email: "umarsuhail112@gmail.com",
  telephone: "+971 551 912 074 / +971 568 323 258 / +91 949 765 6243",
  jobTitle: "Lead Frontend Engineer & Application Developer",
  description:
    "Umar Suhail is a Lead Frontend Engineer, Next.js developer, and frontend developer in Abu Dhabi, UAE. With 7+ years of experience building high-performance React and Next.js applications, he works at Emirates Face Recognition (EFR) and specialises in UI/UX design, TypeScript, design systems, and performance optimisation.",
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/me-s.jpeg`,
    width: 400,
    height: 400,
  },
  // Current UAE location and hometown in Kerala
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
  },
  homeLocation: {
    "@type": "Place",
    name: "Thrissur, Kerala",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Thrissur",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
  },
  workLocation: {
    "@type": "Place",
    name: "Abu Dhabi, United Arab Emirates",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abu Dhabi",
      addressCountry: "AE",
    },
  },
  nationality: {
    "@type": "Country",
    name: "India",
  },
  worksFor: {
    "@type": "Organization",
    name: "Emirates Face Recognition (EFR)",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abu Dhabi",
      addressCountry: "AE",
    },
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "KMP College of Engineering",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  },
  sameAs: [
    "https://www.linkedin.com/in/umar-suhail/",
    "https://github.com/umarsuhail",
    BASE_URL,
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Lead Frontend Engineer",
    occupationalCategory: "Software Developer",
    skills:
      "React.js, Next.js, TypeScript, JavaScript, Redux Toolkit, Tailwind CSS, Figma, UI/UX Design, Performance Optimisation, Accessibility",
    occupationLocation: {
      "@type": "City",
      name: "Abu Dhabi, United Arab Emirates",
    },
  },
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "UI/UX Design",
    "Frontend Architecture",
    "Design Systems",
    "Redux Toolkit",
    "Tailwind CSS",
    "Performance Optimisation",
    "Web Development",
    "Software Engineering",
  ],
  knowsLanguage: "English, Hindi, Urdu, Malayalam, Tamil",
};

// ProfilePage — Google's recommended schema for personal portfolio pages
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: "Umar Suhail – Lead Frontend Engineer Portfolio",
  description:
    "Official portfolio of Umar Suhail, Lead Frontend Engineer and Software Developer from Thrissur, Kerala, based in Abu Dhabi UAE.",
  inLanguage: "en",
  mainEntity: person,
};

// WebSite — makes the site name bold in Google results
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Umar Suhail",
  description:
    "Portfolio of Umar Suhail — Lead Frontend Engineer from Thrissur, Kerala, based in Abu Dhabi UAE.",
  inLanguage: "en",
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
        {/* Geo targeting — India origin, UAE current */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Abu Dhabi, United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        <Analytics />
        {/* hreflang — same content, targeting both markets */}
        <link rel="alternate" hrefLang="en-ae" href={BASE_URL} />
        <link rel="alternate" hrefLang="en-in" href={BASE_URL} />
        <link rel="alternate" hrefLang="en" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />

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
        <Nav />
        {children}
        <DeferredClientFeatures />
        <HelpWidget />
      </body>
    </html>
  );
}
