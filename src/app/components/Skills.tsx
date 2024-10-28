'use client';

import { useState } from "react"; // Import useState
import { skills } from "@/utils/constants";
import SkillCard from "./SkillCard";

export default function Skills() {
  const [showFireworks, setShowFireworks] = useState(false); // State for fireworks

  const playSound = () => {
    console.log(showFireworks);
    
    // Play the sound
    const audio = new Audio('/sounds/your-sound-file.mp3'); // Replace with your sound file path
    audio.play();

    // Show fireworks
    setShowFireworks(true);

    // Hide fireworks after a few seconds (adjust as necessary)
    setTimeout(() => {
      setShowFireworks(false);
    }, 3000); // Adjust the duration to how long you want the fireworks to display
  };

  return (
    <div id="skills" className="flex flex-wrap justify-center bg-purple-700 h-full md:h-screen w-full items-center bg-gradient-to-r from-[#9D50BB] to-[#6E48AA]">
      {/* {<Fireworks />} */}

      <div className="w-full">
        <h1 className="my-2 text-center font-bold text-xl mb-2">
          My Tech Stack
        </h1>
        <p className="text-xs text-center font-thin mb-2">
          Here are some tools that I have used so far...
        </p>
      </div>

      {skills.map((skill) => (
        <SkillCard
          handleClick={playSound} // Pass the playSound function to SkillCard
          key={skill.name}
          level={skill.level}
          icon={skill.icon}
          name={skill.name}
        />
      ))}
    </div>
  );
}
