import { about_me } from "../../utils/constants";
import SmallCard from "./SmallCard";

const hobbies = [
  { name: "Cricket", icon: "noto-v1:cricket-game", description:"I enjoy playing cricket, though I'm not a regular player; I just play occasionally for fun"},
  { name: "Music", icon: "noto-v1:musical-score",description:"I love listening to music." },
  { name: "Photography", icon: "logos:google-photos" ,description:"I capture moments occasionally and plan to pursue it full-time someday"},
];
export default function page() {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mt-12 text-center">
          <h1 className="md:text-5xl text-xl font-extrabold tracking-tight animate-fadeInUp mb-4">
            Get to Know Me...
          </h1>
          <p className="mt-4 text-xl font-medium text-gray-200 text-left mx-auto leading-relaxed">
            {about_me}.
          </p>
        </div>
        <h1 className="text-xl font-semibold text-slate-200 m-2 animate-bounce mt-4 text-center">Hobbies</h1>
        {hobbies.map((items, key) => (
          <div key={key} className="md:flex mx-auto md:mx-3 mb-2 justify-center items-center rounded-md shadow-lg bg-white flex-wrap">
          <SmallCard description={items.description}  name={items.name} icon={items.icon}></SmallCard>

            </div>
        ))}
      </div>
    </div>
  );
}
