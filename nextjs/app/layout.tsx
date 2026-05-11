import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Globe Loader",
  description: "Monochrome spinning globe loading indicator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
