import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Umar Suhail — Lead Frontend Engineer at Emirates Face Recognition (EFR), UAE. 7+ years of React, Next.js, and UI/UX design expertise.",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
