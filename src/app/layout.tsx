import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import ChatBot from "./chatbot/ChatBot";
import BackgroundEffects from "./components/BackgroundEffects";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";
import ScrollController from "./components/ScrollController";

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
  title: "Umar Suhail | Senior Frontend Developer & UI/UX Expert",
  description:
    "Portfolio of Umar Suhail - A passionate Frontend Developer with 6+ years of experience building premium web experiences using React, Next.js, and modern technologies.",
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js",
    "UI/UX",
    "Web Developer",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Umar Suhail" }],
  creator: "Umar Suhail",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Umar Suhail | Senior Frontend Developer",
    description: "Building premium web experiences with modern technologies",
    siteName: "Umar Suhail Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Suhail | Senior Frontend Developer",
    description: "Building premium web experiences with modern technologies",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
