'use client';

import { useState, useMemo, useEffect } from "react";
import { skills } from "@/utils/constants"; 
import SkillPlanet from "./SkillPlanet";

export default function SkillsUniverse() {
  const [skillState, setSkillState] = useState(
    skills.map(s => ({ ...s, count: 0 }))
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const winningSkill = useMemo(() => {
    return skillState.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
  }, [skillState]);

  const handleVote = (name: string) => {
    const audio = new Audio('/sounds/pop.mp3'); 
    audio.volume = 0.3;
    audio.play().catch(() => {});

    setSkillState(prev => prev.map(skill => {
      if (skill.name === name) {
        return { ...skill, count: skill.count + 1 };
      }
      return skill;
    }));
  };

  const RADIUS_X = 300; 
  const RADIUS_Y = 180; 

  return (
    <section 
      id="skills" 
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#09090b] py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#09090b] to-black" />
      
      <div 
        className="absolute rounded-[100%] border border-white/5"
        style={{ width: RADIUS_X * 2, height: RADIUS_Y * 2 }} 
      />
      <div 
        className="absolute rounded-[100%] border border-white/5 rotate-12"
        style={{ width: RADIUS_X * 2.2, height: RADIUS_Y * 2.2 }} 
      />

      <div className="z-10 mb-8 text-center pointer-events-none">
        <h1 className="text-3xl font-bold text-white/90">Skill Universe</h1>
        <p className="text-sm text-gray-500">Tap a planet to power it up!</p>
      </div>

      <div className="relative h-[600px] w-full max-w-[800px] flex items-center justify-center">
        
        {mounted && skillState.map((skill) => {
          const isWinner = skill.name === winningSkill.name;
          const nonWinners = skillState.filter(s => s.name !== winningSkill.name);
          const orbitalIndex = nonWinners.findIndex(s => s.name === skill.name);
          const angleStep = (2 * Math.PI) / nonWinners.length;
          const angle = orbitalIndex * angleStep;

          return (
            <SkillPlanet
              key={skill.name}
              {...skill}
              isWinner={isWinner}
              handleClick={() => handleVote(skill.name)}
              angle={angle}
              radiusX={RADIUS_X}
              radiusY={RADIUS_Y}
              totalItems={skillState.length}
            />
          );
        })}

      </div>
    </section>
  );
}
