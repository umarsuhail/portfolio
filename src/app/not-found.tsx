import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold gradient-text mb-4">404</p>
        <h1 className="text-2xl font-semibold text-vintage-cream mb-3">
          Page not found
        </h1>
        <p className="text-vintage-cream/50 mb-8 max-w-sm mx-auto">
          This page doesn&apos;t exist on umar.website.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Back to portfolio
        </Link>
      </div>
    </main>
  );
}
