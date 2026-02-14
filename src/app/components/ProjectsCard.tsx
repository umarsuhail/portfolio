import Image from 'next/image'
import Typography from './TruncatedText';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type projects={
    name:string,
    about:string,
    image:string | StaticImport
}
export default function ProjectsCard({ name, about, image }: projects) {
  return (
    <div className="md:mx-4 mx-auto items-center rounded-xl bg-gradient-to-br from-red-700 via-red-500 to-red-400 shadow-xl p-5 m-3 max-w-xs h-96 card-hover border border-white/10 backdrop-blur-md">
      <div className="flex items-start justify-around text-left">
        <Image className="rounded-lg border-2 border-white/30 shadow-md mx-2 object-cover" src={image} height={150} alt="web" width={150} />
      </div>
      <h1 className="text-center font-bold text-2xl mt-4 text-white drop-shadow-lg">{name}</h1>
      <Typography
        text={about}
        width="w-full"
        charLimit={120}
        height="h-52"
      />
    </div>
  );
}
