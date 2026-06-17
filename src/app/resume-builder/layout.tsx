import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume Builder",
  description:
    "Build a professional resume online for free. ATS-friendly templates for software engineers, healthcare, aviation, and business professionals. Download as PDF instantly.",
  alternates: {
    canonical: "/resume-builder",
  },
  openGraph: {
    url: "https://www.umar.website/resume-builder",
    title: "Free Resume Builder – Professional PDF Templates",
    description:
      "Create and download a polished, ATS-ready resume in minutes. Templates for software engineers, nurses, cabin crew, finance, and marketing professionals.",
  },
  twitter: {
    title: "Free Resume Builder | ATS-Friendly PDF Templates",
    description:
      "Professional resume templates for any career. Build and download for free.",
  },
};

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
