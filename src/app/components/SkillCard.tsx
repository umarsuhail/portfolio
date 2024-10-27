import { skillCard } from "@/utils/types";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function SkillCard({ icon, name, level }: skillCard) {
  return (
    <div className="flex bg-slate-950 m-2 p-2 rounded-md flex-col text-center w-44 hover:cursor-pointer py-4 transition ease-in-out delay-150 hover:bg-blue-950 hover:text-violet-500 hover:-translate-y-1 hover:scale-110">
      <div className="border border-white rounded p-2 mx-auto text-slate-100 hover:text-violet-500 ">
        <Icon icon={icon} className="mx-auto" />
        <p className="w-full text-slate-100">{name}</p>
      </div>

      <p className="text-xs font-thin  text-slate-100">{level}</p>
    </div>
  );
}
