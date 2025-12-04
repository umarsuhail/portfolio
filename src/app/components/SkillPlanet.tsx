'use client';
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { skillCard } from "@/utils/types";

interface SkillPlanetProps extends skillCard {
  count: number;
  isWinner: boolean;
  angle: number;
  radiusX: number;
  radiusY: number;
  totalItems: number;
  handleClick: () => void;
}

export default function SkillPlanet({ 
  icon, 
  name, 
  count, 
  isWinner, 
  angle, 
  radiusX, 
  radiusY, 
  handleClick 
}: SkillPlanetProps) {
  
  const x = isWinner ? 0 : radiusX * Math.cos(angle);
  const y = isWinner ? 0 : radiusY * Math.sin(angle);

  return (
    <motion.div
      layout 
      initial={false}
      animate={{ x, y, zIndex: isWinner ? 10 : 1 }}
      transition={{ type: "spring", stiffness: 60, damping: 20 }}
      className={`absolute flex items-center justify-center`}
      style={{ 
        left: "50%", 
        top: "50%", 
        marginLeft: isWinner ? -64 : -40, 
        marginTop: isWinner ? -64 : -40, 
      }}
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative flex flex-col items-center justify-center rounded-full backdrop-blur-md shadow-xl transition-all duration-500
          ${isWinner 
            ? "h-32 w-32 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 border-2 border-yellow-300 shadow-[0_0_50px_rgba(255,200,0,0.4)]" 
            : "h-20 w-20 bg-white/10 border border-white/20 hover:bg-white/20"
          }
        `}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-2 left-4 h-3 w-8 -rotate-45 rounded-full bg-white/30 blur-sm pointer-events-none" />

        <Icon 
          icon={icon} 
          className={`transition-all duration-300 drop-shadow-lg
            ${isWinner ? "h-14 w-14 text-white" : "h-8 w-8 text-gray-200"}
          `} 
        />

        <span className={`absolute -bottom-8 text-xs font-bold tracking-widest text-white transition-opacity duration-300
          ${isWinner ? "opacity-100 text-sm" : "opacity-0 group-hover:opacity-100"}
        `}>
          {name}
        </span>

        <motion.div 
          key={count} 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full font-bold text-white shadow-lg border border-white/20
            ${isWinner ? "h-8 w-8 bg-red-500 text-sm" : "h-6 w-6 bg-blue-600 text-xs"}
          `}
        >
          {count}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
