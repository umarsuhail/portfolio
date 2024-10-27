import { skills } from "@/utils/constants";
import SkillCard from "./SkillCard";

export default function Skills() {
  return (
    <div id="skills" className=" flex flex-wrap justify-center bg-purple-700  h-full md:h-screen  w-full  items-center bg-gradient-to-r  from-[#9D50BB]  to-[#6E48AA]  ">
      <div className="w-full">
        <h1 className=" my-2 text-center font-bold text-xl mb-2">
          My Tech Stack
        </h1>
        <p className="text-xs text-center font-thin mb-2 ">
          Here are some tools that I have used so far...
        </p>
      </div>

      {skills.map((skills) => (
        <SkillCard
          key={skills.name}
          level={skills.level}
          icon={skills.icon}
          name={skills.name}
        ></SkillCard>
      ))}
    </div>
  );
}
