"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import { skills } from "@/utils/constants";
import useIsMobile from "./useIsMobile";

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
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ 
        scale: [0, 1.5, 1.2],
        opacity: [1, 0.8, 0],
      }}
      transition={{ 
        duration: 0.8,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        left: splatter.x,
        top: splatter.y,
        transform: `rotate(${splatter.rotation}deg)`,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <svg
        width={splatter.size}
        height={splatter.size}
        viewBox="0 0 100 100"
        className="overflow-visible"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill={splatter.color}
          initial={{ r: 0 }}
          animate={{ r: [0, 25, 20] }}
          transition={{ duration: 0.3 }}
        />
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const distance = 25 + Math.random() * 15;
          const cx = 50 + Math.cos(angle) * distance;
          const cy = 50 + Math.sin(angle) * distance;
          const r = 3 + Math.random() * 8;
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={splatter.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ delay: 0.1 + i * 0.02, duration: 0.2 }}
            />
          );
        })}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const distance = 35 + Math.random() * 20;
          const cx = 50 + Math.cos(angle) * distance;
          const cy = 50 + Math.sin(angle) * distance;
          const r = 1 + Math.random() * 4;
          return (
            <motion.circle
              key={`outer-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={splatter.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 0.15 + i * 0.015, duration: 0.25 }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
};

export default function SkillsUniverse() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = isMobile || prefersReducedMotion;
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4">Technical Expertise</span>
          <h2 className="section-title text-vintage-cream mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive toolkit for building modern, scalable web applications
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
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
        </motion.div>

        <motion.div
          layout={!shouldReduceMotion}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                layout={!shouldReduceMotion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleGraffiti(e, skill.name)}
                className="relative group cursor-pointer overflow-visible"
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {!shouldReduceMotion && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-vintage-cream/40 text-sm mt-8"
          >
            🎨 Click on skills to spray paint them!
          </motion.p>
        )}
      </div>
    </section>
  );
}