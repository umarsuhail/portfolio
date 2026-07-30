"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

interface SpideyFeatureProps {
  /** Small eyebrow label above the heading */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Full-bleed feature band: the sp-bg1.jpg Spider-Man artwork swings IN as you
 * scroll into the section and swings back OUT as you scroll past it — driven by
 * the section's own scroll progress. Reusable: drop it between any two sections.
 */
export default function SpideyFeature({
  eyebrow = "Friendly Neighbourhood Developer",
  title = "With Great Power Comes Great Responsibility",
  subtitle = "Building resilient, high-performance interfaces — one web at a time.",
}: SpideyFeatureProps) {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);

  // Scroll-interactive reveal (no pin — keeps page scroll smooth):
  //  • the Spider-Man artwork swings in once and stays as a steady backdrop;
  //  • the headline highlights letter-by-letter, scrubbed to the heading's own
  //    travel through the viewport, and is fully lit while it sits comfortably
  //    in the upper-middle of the screen — then stays lit.
  useEffect(() => {
    const section = ref.current;
    const heading = headingRef.current;
    const figure = figureRef.current;
    if (!section || !heading || !figure) return;

    gsap.registerPlugin(ScrollTrigger);
    const chars = heading.querySelectorAll<HTMLElement>(".spidey-char");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const litShadow =
      "0 0 16px rgba(230,36,41,0.9), 0 0 34px rgba(43,108,232,0.5)";

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(figure, { yPercent: 0, xPercent: 0, scale: 1.12, rotation: 0, opacity: 1 });
        gsap.set(chars, { color: "#F4E9E8", textShadow: litShadow });
        return;
      }

      // Artwork swings in once, then settles and stays put.
      gsap.fromTo(
        figure,
        { yPercent: -16, xPercent: 8, scale: 1.3, rotation: -8, opacity: 0 },
        {
          yPercent: 0,
          xPercent: 0,
          scale: 1.12,
          rotation: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        }
      );

      // Letters light up in sequence, driven by scroll position (scrubbed).
      gsap.fromTo(
        chars,
        {
          color: "rgba(244,233,232,0.22)",
          textShadow: "0 0 0px rgba(230,36,41,0), 0 0 0px rgba(43,108,232,0)",
        },
        {
          color: "#F4E9E8",
          textShadow: litShadow,
          ease: "none",
          stagger: { each: 0.5 },
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.8,
          },
        }
      );
    }, section);

    // Recalculate once lazy sections above have settled.
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      data-spidey-feature
      className="relative min-h-[85vh] overflow-hidden flex items-center"
    >
      {/* Scroll-driven Spider-Man artwork */}
      <div
        ref={figureRef}
        aria-hidden
        className="absolute inset-0 bg-cover bg-right-top will-change-transform opacity-0"
        style={{ backgroundImage: "url('/images/sp-bg1.jpg')" }}
      />

      {/* Left→right darken keeps the heading legible; Spidey stays bright on the right */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent"
        aria-hidden
      />
      {/* Top/bottom fade blends the band seamlessly into the page background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-spidey-web via-transparent to-spidey-web opacity-90"
        aria-hidden
      />
      <div className="spidey-web absolute inset-0 opacity-25" aria-hidden />

      <div className="section-container relative z-10">
        <Reveal inView y={40} amount={0.4} duration={0.7} className="max-w-2xl">
          <span className="badge mb-5 border-spidey-red/40 bg-spidey-red/15 text-spidey-silk">
            {eyebrow}
          </span>
          <h2
            ref={headingRef}
            aria-label={title}
            className="text-4xl md:text-6xl font-bold leading-tight text-spidey-silk mb-5"
          >
            {title.split(" ").map((word, wi) => (
              <span key={`${word}-${wi}`} className="inline-block mr-[0.28em]" aria-hidden>
                {word.split("").map((ch, ci) => (
                  <span key={ci} className="spidey-char inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="text-spidey-silk/75 text-lg md:text-xl max-w-xl">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
