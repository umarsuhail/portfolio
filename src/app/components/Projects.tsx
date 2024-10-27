import { projects } from "@/utils/constants";
import ProjectsCard from "./ProjectsCard";

export default function Projects() {
  return (
    <div className="min-h-screen" id="projects">
      <div className="w-full my-6 mt-9">
        <h1 className=" my-2 text-center font-bold text-xl mb-2 ">My Works</h1>
        <p className="text-xs text-center font-thin mb-2 ">
          Here are some works that I have contributed so far...
        </p>
      </div>
      <div className="md:flex">
      {projects.map(items=>(
        <ProjectsCard name={items.name} key={items.name} about={items.about} image={items.image}/>
    ))}
      </div>
    
     
    </div>
  );
}
