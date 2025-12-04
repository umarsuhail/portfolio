'use client';
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { skillCard } from "@/utils/types"; // Keeping your import

interface SkillCardProps extends skillCard {
  handleClick: () => void;
  index: number; // Added index for staggered animation calculation
}

export default function SkillCard({ icon, name, level, handleClick, index }: SkillCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        rotateX: 5, 
        rotateY: 5,
        backgroundColor: "rgba(255, 255, 255, 0.15)" 
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="group relative flex h-48 w-40 flex-col items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md transition-colors hover:border-white/30 cursor-pointer"
    >
      {/* Glossy Gradient Overlay */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Icon Container */}
      <div className="relative mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] ring-1 ring-white/20 transition-all group-hover:bg-white/20 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.5)]">
        <Icon 
          icon={icon} 
          className="h-8 w-8 text-white/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" 
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold tracking-wide text-white drop-shadow-sm">
          {name}
        </h3>
        
        {/* Level Badge */}
        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-purple-200 ring-1 ring-purple-500/30">
          {level}
        </span>
      </div>
    </motion.div>
  );
}
