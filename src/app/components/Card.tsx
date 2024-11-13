import Image from "next/image";
import profile from "../../public/images/me.png";
import { texts } from "@/utils/constants";
import ParticlesBackground from "../components/ParticleBackgrounds";

export default function Card() {
  return (
    <div className="w-full" >
      <ParticlesBackground />
      <div
        className="relative text-white md:w-2/3 min-h-screen p-4 rounded-lg md:my-4 mx-auto md:backdrop-blur-md"
        style={{ backgroundColor: "rgba(142, 142, 142, 0.1)" }}
      >
        <div className="flex flex-col justify-center md:flex-row items-center mt-3 rounded-b-lg">
          <div className="inline-block mb-6 rounded-full bg-white w-48 h-48 overflow-hidden shadow-xl">
            <Image
              src={profile}
              width={200}
              height={200}
              alt="Picture of the author"
            />
          </div>

          <h1 className="text-4xl mx-3 md:w-6/12 font-extrabold tracking-wide break-words leading-10 text-white text-stroke-blue mb-4 animate-fadeInRight">
            Hi👋 i&apos;m{" "}
            <span className="text-yellow-400 md:text-6xl font-extrabold md:whitespace-nowrap">
              Umar Suhail
            </span>
            , and I craft web experiences.
          </h1>
        </div>

        <h2 className="md:text-center font-light leading-9 tracking-widest mx-10 text-white animate-fadeInDown">
          {texts.about}
        </h2>
      </div>
    </div>
  );
}
