"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const ACTIVITY_EVENTS = [
  "pointermove",
  "pointerdown",
  "scroll",
  "keydown",
  "touchstart",
];

export default function InteractiveToast() {
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);
  const hasShown = useRef(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (hasShown.current) return;

    const startTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setShow(true);
        hasShown.current = true;
      }, 10000);
    };

    const resetTimer = () => {
      if (hasShown.current) return;
      startTimer();
    };

    startTimer();

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, resetTimer);
      }
    };
  }, [pathname]);

  if (pathname !== "/" || !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xl px-4 py-6">
      <div className="relative w-full max-w-3xl rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-white/80 transition hover:text-white"
          aria-label="Dismiss welcome overlay"
        >
          ×
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-vintage-burgundy/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-vintage-cream">
              Get started
            </span>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Explore Umar’s world on the portfolio
            </h2>
            <p className="max-w-xl text-sm leading-6 text-white/80">
              Discover his experience, start a chat with the AI assistant, or build a resume using the free resume builder. This overlay appears when you pause on the homepage.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => router.push("/about")}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/15"
              >
                Know more
              </button>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-portfolio-chat"));
                  setShow(false);
                }}
                className="rounded-2xl bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/90 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-vintage-burgundy/30 transition hover:brightness-110"
              >
                Start chat
              </button>
              <button
                type="button"
                onClick={() => router.push("/resume-builder")}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/15"
              >
                Resume builder
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Need a quick guide?</p>
                <div className="space-y-3 rounded-3xl bg-slate-950/70 p-4">
                  <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-white/85">
                    <p className="font-semibold">About Umar</p>
                    <p className="mt-2 text-xs leading-5 text-white/70">
                      Learn his role, experience, and technical strengths across frontend architecture and product delivery.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-white/85">
                    <p className="font-semibold">AI chat bot</p>
                    <p className="mt-2 text-xs leading-5 text-white/70">
                      Ask the assistant about real projects, career highlights, and working experience.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-sm text-white/70">
                <p className="font-semibold text-white">Tip</p>
                <p className="mt-2 leading-6">
                  If you don’t move for 10 seconds, this overlay will appear and guide you to the main actions on the homepage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
