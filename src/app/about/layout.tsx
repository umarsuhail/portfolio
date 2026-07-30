import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Umar Suhail, a Next.js developer and frontend developer in Abu Dhabi at Emirates Face Recognition (EFR). 7+ years of React, Next.js, TypeScript, and UI/UX design expertise.",
  keywords: [
    "Umar Suhail",
    "Umer Suhail",
    "Omer Suhail",
    "Umar Sohail",
    "Lead Frontend Engineer Abu Dhabi",
    "Frontend Developer Abu Dhabi",
    "Next.js Developer Abu Dhabi",
    "React Developer UAE",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "https://www.umar.website/about",
    title: "About Umar Suhail | Next.js Developer in Abu Dhabi",
    description:
      "Next.js and frontend developer in Abu Dhabi at EFR, with deep expertise in React, TypeScript, design systems, and performance optimisation.",
  },
  twitter: {
    title: "About Umar Suhail | Next.js Developer in Abu Dhabi",
    description:
      "7+ years building scalable React and Next.js applications in Abu Dhabi, UAE.",
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://www.umar.website/about/#webpage",
      url: "https://www.umar.website/about",
      name: "About Umar Suhail | Lead Frontend Engineer",
      description:
        "Professional background, skills, and experience of Umar Suhail, a Next.js developer and frontend developer in Abu Dhabi, UAE.",
      inLanguage: "en",
      about: { "@id": "https://www.umar.website/#person" },
      mainEntity: { "@id": "https://www.umar.website/#person" },
      breadcrumb: { "@id": "https://www.umar.website/about/#breadcrumb" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.umar.website/about/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.umar.website/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About Umar Suhail",
          item: "https://www.umar.website/about",
        },
      ],
    },
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      {children}
    </>
  );
}
