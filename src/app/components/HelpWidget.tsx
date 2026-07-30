"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-help", onOpen);
    return () => window.removeEventListener("open-help", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector<HTMLElement>("button, a, [tabindex]:not([tabindex='-1'])");
    firstFocusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        // basic focus trap
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])"
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lastActiveRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-controls="help-dialog"
        onClick={() => window.dispatchEvent(new CustomEvent("open-help"))}
        className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full bg-vintage-burgundy px-4 py-2 text-sm font-medium shadow-lg"
      >
        <Icon icon="solar:help-circle-bold" className="text-white text-lg" />
        Help
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          aria-describedby="help-desc"
          id="help-dialog"
          ref={dialogRef}
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white/5 border border-white/10 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="help-title" className="text-xl font-semibold">
                  Need help exploring the portfolio?
                </h2>
                <p id="help-desc" className="mt-2 text-sm text-white/80">
                  Use this assistant to ask questions about Umar&apos;s work, projects, skills, and how to contact him. The assistant is scoped to professional information only. You can also use the Resume Builder or visit About for detailed sections.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.open("/about", "_self");
                  }}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm"
                >
                  About
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close help"
                  className="rounded-full bg-white/10 px-3 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-900/60 p-4">
                <h3 className="font-semibold">How to ask</h3>
                <p className="mt-2 text-sm text-white/80">
                  Ask about Umar&apos;s projects, role, tech stack, experience years, or how to contact him. Example: &quot;What technologies did Umar use in the Dashboard v2 project?&quot;
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-4">
                <h3 className="font-semibold">Scope & privacy</h3>
                <p className="mt-2 text-sm text-white/80">
                  The assistant only answers professional questions based on information on this site. It will not provide general advice or unrelated content.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Quick answers</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    const faq = { q: "What does Umar do?", a: "Umar Suhail is a Lead Frontend Engineer & Application Developer with 7+ years of experience building high-performance React and Next.js applications. He currently works at Emirates Face Recognition (EFR) in Dubai, UAE." };
                    window.dispatchEvent(new CustomEvent('open-portfolio-chat'));
                    window.dispatchEvent(new CustomEvent('submit-faq', { detail: faq }));
                    setOpen(false);
                  }}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-vintage-burgundy/40 bg-vintage-burgundy/10 text-white/90 hover:bg-vintage-burgundy/20 transition-colors"
                >
                  What does Umar do?
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const faq = { q: "What's his tech stack?", a: "React, Next.js, TypeScript, JavaScript, Node.js, Redux, and Tailwind CSS — with a focus on scalable architecture, UI/UX, and accessibility." };
                    window.dispatchEvent(new CustomEvent('open-portfolio-chat'));
                    window.dispatchEvent(new CustomEvent('submit-faq', { detail: faq }));
                    setOpen(false);
                  }}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-vintage-burgundy/40 bg-vintage-burgundy/10 text-white/90 hover:bg-vintage-burgundy/20 transition-colors"
                >
                  What&apos;s his tech stack?
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const faq = { q: "Notable projects?", a: "Emirates multi-tenant biometric dashboards for 50+ banks and financial institutions, a Telecom Onboarding Dashboard, an Enterprise Revenue & Billing Analytics Platform, a Loyalty Rewards Platform, GetLife Insurance Portal, and SkySearch.AI." };
                    window.dispatchEvent(new CustomEvent('open-portfolio-chat'));
                    window.dispatchEvent(new CustomEvent('submit-faq', { detail: faq }));
                    setOpen(false);
                  }}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-vintage-burgundy/40 bg-vintage-burgundy/10 text-white/90 hover:bg-vintage-burgundy/20 transition-colors"
                >
                  Notable projects?
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const faq = { q: "How can I contact Umar?", a: "Email umarsuhail112@gmail.com or connect on LinkedIn at linkedin.com/in/umar-suhail." };
                    window.dispatchEvent(new CustomEvent('open-portfolio-chat'));
                    window.dispatchEvent(new CustomEvent('submit-faq', { detail: faq }));
                    setOpen(false);
                  }}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-vintage-burgundy/40 bg-vintage-burgundy/10 text-white/90 hover:bg-vintage-burgundy/20 transition-colors"
                >
                  How can I contact Umar?
                </button>
              </div>
            </div>

            <div className="mt-6 text-sm text-white/70">
              <p>
                Email: <a href="mailto:umarsuhail112@gmail.com" className="underline">umarsuhail112@gmail.com</a>
              </p>
              <p className="mt-1">
                Phone: <a href="tel:+971551912074" className="underline">+971 551 912 074</a> / <a href="tel:+971568323258" className="underline">+971 568 323 258</a> / <a href="tel:+919497656243" className="underline">+91 949 765 6243</a>
              </p>
              <p className="mt-1">
                WhatsApp: <a href="https://wa.me/971551912074" target="_blank" rel="noopener noreferrer" className="underline">+971 551 912 074</a> / <a href="https://wa.me/971568323258" target="_blank" rel="noopener noreferrer" className="underline">+971 568 323 258</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
