"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { Icon } from "@iconify/react";
import { skills } from "@/utils/constants";
import useIsMobile from "./useIsMobile";
import Reveal from "./Reveal";

interface Splatter {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

interface SkillWithSplatters {
  name: string;
  level: string;
  icon: string;
  splatters: Splatter[];
}

const levelColors: Record<string, string> = {
  Expert: "from-vintage-burgundy to-vintage-burgundy/70",
  Intermediate: "from-vintage-slate to-vintage-navy",
  Basic: "from-vintage-gray to-vintage-slate",
};

const levelBadgeColors: Record<string, string> = {
  Expert: "bg-vintage-burgundy/20 text-vintage-cream border-vintage-burgundy/30",
  Intermediate: "bg-vintage-slate/30 text-vintage-cream/80 border-vintage-slate/50",
  Basic: "bg-vintage-gray/20 text-vintage-cream/70 border-vintage-gray/30",
};

const splatterColors = [
  "#BF092F", // vintage-burgundy
  "#D2C1B6", // vintage-cream
  "#1B3C53", // vintage-slate
  "#7A7A73", // vintage-gray
  "#132440", // vintage-navy
  "#FF6B6B", // accent red
  "#4ECDC4", // accent teal
  "#FFE66D", // accent yellow
];

const GraffitiSplatter = ({ splatter }: { splatter: Splatter }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // Pop-and-fade envelope on the whole splatter
      gsap
        .timeline()
        .fromTo(
          el,
          { scale: 0, opacity: 1 },
          { scale: 1.5, opacity: 0.8, duration: 0.32, ease: "power2.out" }
        )
        .to(el, { scale: 1.2, opacity: 0, duration: 0.48, ease: "power1.in" });

      // Core blob grows
      gsap.fromTo(
        el.querySelector(".splatter-main"),
        { attr: { r: 0 } },
        { attr: { r: 20 }, duration: 0.3, ease: "power2.out" }
      );
      // Inner ring of droplets
      gsap.fromTo(
        el.querySelectorAll(".splatter-mid"),
        { opacity: 0 },
        { opacity: 0.8, duration: 0.2, delay: 0.1, stagger: 0.02 }
      );
      // Outer speckles
      gsap.fromTo(
        el.querySelectorAll(".splatter-outer"),
        { opacity: 0 },
        { opacity: 0.6, duration: 0.25, delay: 0.15, stagger: 0.015 }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: splatter.x,
        top: splatter.y,
        transform: `rotate(${splatter.rotation}deg)`,
        pointerEvents: "none",
        zIndex: 50,
        opacity: 0,
      }}
    >
      <svg
        width={splatter.size}
        height={splatter.size}
        viewBox="0 0 100 100"
        className="overflow-visible"
      >
        <circle className="splatter-main" cx="50" cy="50" r="20" fill={splatter.color} />
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const distance = 25 + Math.random() * 15;
          const cx = 50 + Math.cos(angle) * distance;
          const cy = 50 + Math.sin(angle) * distance;
          const r = 3 + Math.random() * 8;
          return (
            <circle key={i} className="splatter-mid" cx={cx} cy={cy} r={r} fill={splatter.color} />
          );
        })}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const distance = 35 + Math.random() * 20;
          const cx = 50 + Math.cos(angle) * distance;
          const cy = 50 + Math.sin(angle) * distance;
          const r = 1 + Math.random() * 4;
          return (
            <circle key={`outer-${i}`} className="splatter-outer" cx={cx} cy={cy} r={r} fill={splatter.color} />
          );
        })}
      </svg>
    </div>
  );
};

export default function SkillsUniverse() {
  const isMobile = useIsMobile();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const shouldReduceMotion = isMobile || prefersReducedMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const [skillState, setSkillState] = useState<SkillWithSplatters[]>(
    skills.map((s) => ({ ...s, splatters: [] }))
  );
  const [filter, setFilter] = useState<string>("All");
  const [globalSplatters, setGlobalSplatters] = useState<Splatter[]>([]);

  const categories = useMemo(() => {
    const levels = ["All", ...new Set(skills.map((s) => s.level))];
    return levels;
  }, []);

  const filteredSkills = useMemo(() => {
    if (filter === "All") return skillState;
    return skillState.filter((s) => s.level === filter);
  }, [filter, skillState]);

  const handleGraffiti = useCallback((e: React.MouseEvent, skillName: string) => {
    if (shouldReduceMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSplatter: Splatter = {
      id: Date.now() + Math.random(),
      x: x - 50,
      y: y - 50,
      color: splatterColors[Math.floor(Math.random() * splatterColors.length)],
      size: 80 + Math.random() * 40,
      rotation: Math.random() * 360,
    };

    setSkillState((prev) =>
      prev.map((skill) => {
        if (skill.name === skillName) {
          return { 
            ...skill, 
            splatters: [...skill.splatters.slice(-5), newSplatter]
          };
        }
        return skill;
      })
    );

    setTimeout(() => {
      setSkillState((prev) =>
        prev.map((skill) => {
          if (skill.name === skillName) {
            return {
              ...skill,
              splatters: skill.splatters.filter((s) => s.id !== newSplatter.id),
            };
          }
          return skill;
        })
      );
    }, 1000);
  }, [shouldReduceMotion]);

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden"
    >
      <div className="section-container">
        <Reveal inView y={30} duration={0.6} className="text-center mb-16">
          <span className="badge badge-primary mb-4">Technical Expertise</span>
          <h2 className="section-title text-vintage-cream mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive toolkit for building modern, scalable web applications
          </p>
        </Reveal>

        <Reveal inView y={20} duration={0.6} className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === category
                  ? "bg-vintage-burgundy text-vintage-cream"
                  : "bg-vintage-slate/30 text-vintage-cream/60 hover:bg-vintage-slate/50 hover:text-vintage-cream"
              }`}
            >
              {category}
            </button>
          ))}
        </Reveal>

        <Reveal
          inView
          y={20}
          duration={0.6}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
            {filteredSkills.map((skill) => (
              <div
                key={skill.name}
                onClick={(e) => handleGraffiti(e, skill.name)}
                className={`relative group cursor-pointer overflow-visible transition-transform duration-300 active:scale-95 ${
                  shouldReduceMotion ? "" : "hover:scale-105 hover:-translate-y-1"
                }`}
              >
                {skill.splatters.map((splatter) => (
                  <GraffitiSplatter key={splatter.id} splatter={splatter} />
                ))}
                
                <div className="vintage-card rounded-xl p-4 h-full flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-vintage-burgundy/30 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-lg bg-gradient-to-r ${
                      levelColors[skill.level]
                    } p-0.5`}
                  >
                    <div className="w-full h-full rounded-lg bg-vintage-navy flex items-center justify-center">
                      <Icon icon={skill.icon} className="text-2xl" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-vintage-cream/90 mb-1">
                      {skill.name}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md border ${
                        levelBadgeColors[skill.level]
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>

                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-vintage-burgundy/0 via-vintage-burgundy/0 to-vintage-cream/0 group-hover:from-vintage-burgundy/10 group-hover:via-vintage-burgundy/5 group-hover:to-vintage-cream/10 transition-all duration-300 pointer-events-none" />
                </div>
              </div>
            ))}
        </Reveal>
      </div>
    </section>
  );
}