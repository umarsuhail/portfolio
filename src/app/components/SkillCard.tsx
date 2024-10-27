import { skillCard } from "@/utils/types";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function SkillCard({ icon, name, level }: skillCard) {
  return (
    <div className="flex bg-white m-2 p-2 rounded-md flex-col text-center w-44 hover:cursor-pointer py-4 transition ease-in-out delay-150 hover:bg-purple-200 hover:text-violet-500 hover:-translate-y-1 hover:scale-110">
      <div className="border border-white rounded p-2 mx-auto text-blue-950 hover:text-violet-500 ">
        <Icon icon={icon} className="mx-auto" />
        <p className="w-full">{name}</p>
      </div>

      <p className="text-xs font-thin text-blue-950">{level}</p>
    </div>
  );
}
