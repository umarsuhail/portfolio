"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  // 0 when the section's top hits the bottom of the viewport,
  // 1 when the section's bottom leaves the top of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scroll-scrubbed glow: each character lights up in sequence as you scroll.
  useEffect(() => {
    const section = ref.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    gsap.registerPlugin(ScrollTrigger);
    const chars = heading.querySelectorAll<HTMLElement>(".spidey-char");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(chars, {
          color: "#F4E9E8",
          textShadow:
            "0 0 16px rgba(230,36,41,0.85), 0 0 34px rgba(43,108,232,0.45)",
        });
        return;
      }

      gsap.fromTo(
        chars,
        {
          color: "rgba(244,233,232,0.22)",
          textShadow:
            "0 0 0px rgba(230,36,41,0), 0 0 0px rgba(43,108,232,0)",
        },
        {
          color: "#F4E9E8",
          textShadow:
            "0 0 16px rgba(230,36,41,0.9), 0 0 34px rgba(43,108,232,0.5)",
          ease: "none",
          stagger: { each: 0.4 },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        }
      );
    }, section);

    // Recalculate once lazy sections below/above have settled
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  // Spider-Man drifts down + in, then swings back up + out → "comes and goes"
  const figureY = useTransform(scrollYProgress, [0, 0.5, 1], ["-20%", "0%", "18%"]);
  const figureX = useTransform(scrollYProgress, [0, 0.5, 1], ["10%", "0%", "-8%"]);
  const figureScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.32, 1.12, 1.32]);
  const figureRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-9, 0, 11]);
  const figureOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.5, 0.78, 1],
    [0, 1, 1, 1, 0]
  );

  return (
    <section
      ref={ref}
      data-spidey-feature
      className="relative min-h-[85vh] overflow-hidden flex items-center"
    >
      {/* Scroll-driven Spider-Man artwork */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-cover bg-right-top will-change-transform"
        style={{
          y: figureY,
          x: figureX,
          scale: figureScale,
          rotate: figureRotate,
          opacity: figureOpacity,
          backgroundImage: "url('/images/sp-bg1.jpg')",
        }}
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="badge mb-5 border-spidey-red/40 bg-spidey-red/15 text-spidey-silk">
            {eyebrow}
          </span>
          <h2
            ref={headingRef}
            aria-label={title}
            className="text-4xl md:text-6xl font-bold leading-tight text-spidey-silk mb-5"
          >
            {title.split(" ").map((word, wi, words) => (
              <span key={`${word}-${wi}`} className="inline-block" aria-hidden>
                {word.split("").map((ch, ci) => (
                  <span key={ci} className="spidey-char inline-block">
                    {ch}
                  </span>
                ))}
                {wi < words.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className="text-spidey-silk/75 text-lg md:text-xl max-w-xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
