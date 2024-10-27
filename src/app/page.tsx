import Card from "./components/Card";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { quickSand } from "./fonts/fonts";

export default function Home() {
  
  return (
    <div className={`min-h-screen md:flex md:flex-col items-center justify-center bg-gray-900 ${quickSand.className}`}>
         <Card/>
        <Skills/>
        <Projects/>
      {/* <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
        Welcome to My Portfolio
      </h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        I am a passionate React Developer with expertise in building modern web applications. Here are my skills:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill:any) => (
          <div key={skill.name} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800">{skill.name}</h2>
            <p className="text-gray-500">Level: {skill.level}</p>
          </div>
        ))}
      </div>

      <footer className="mt-8 text-center">
        <p className="text-gray-600">© {new Date().getFullYear()} My Name. All rights reserved.</p>
      </footer> */}
  </div>
  );
}
