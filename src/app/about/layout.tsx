import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Umar Suhail, also searched as Umer Suhail, Omer Suhail, and Umar Sohail — Lead Frontend Engineer at Emirates Face Recognition (EFR), UAE. 7+ years of React, Next.js, and UI/UX design expertise.",
  keywords: [
    "Umar Suhail",
    "Umer Suhail",
    "Omer Suhail",
    "Umar Sohail",
    "Lead Frontend Engineer Abu Dhabi",
    "React Developer UAE",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "https://www.umar.website/about",
    title: "About Umar Suhail | Lead Frontend Engineer",
    description:
      "Senior frontend engineer at EFR, UAE. Deep expertise in React, Next.js, TypeScript, design systems, and performance optimisation.",
  },
  twitter: {
    title: "About Umar Suhail | Lead Frontend Engineer",
    description:
      "7+ years building scalable React applications. Currently at Emirates Face Recognition, UAE.",
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
        "Professional background, skills, and experience of Umar Suhail, Lead Frontend Engineer in Abu Dhabi, UAE.",
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
