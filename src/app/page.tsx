import Card from "./components/Card";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { quickSand } from "./fonts/fonts";

export default function Home() {
  
  return (
    <div className={`min-h-screen md:flex md:flex-col items-center justify-center bg-gray-900 ${quickSand.className}`}>
         <Card />
        <Skills />
        <Projects />
        <Footer/>
  </div>
  );
}
