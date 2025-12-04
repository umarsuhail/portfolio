'use client';

import { useState } from "react";
import { skills } from "@/utils/constants";
import SkillCard from "./SkillCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Skills() {
  const [showFireworks, setShowFireworks] = useState(false);

  const playSound = () => {
    // Basic check to ensure we are in the browser
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/your-sound-file.mp3');
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Audio play failed (interaction required):", e));
    }

    setShowFireworks(true);
    setTimeout(() => {
      setShowFireworks(false);
    }, 2000); 
  };

  return (
    <section 
      id="skills" 
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0f0c29] py-20"
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#302b63] via-[#24243e] to-[#0f0c29] opacity-90" />
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/30 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />

      {/* Fireworks / Visual Feedback Overlay */}
      <AnimatePresence>
        {showFireworks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-sm"
          >
            <motion.h2 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1.5 }}
              className="text-4xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            >
              Great Skill! 🚀
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 container mx-auto px-6">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          >
            My Tech Stack
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm font-light text-gray-400"
          >
            Click a card to see what happens...
          </motion.p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.name}
              index={index}
              handleClick={playSound}
              level={skill.level}
              icon={skill.icon}
              name={skill.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
