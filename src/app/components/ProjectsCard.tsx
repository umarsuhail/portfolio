import Image from 'next/image'
import Typography from './TruncatedText';

type projects={
    name:string,
    about:string,
    image:any
}
export default function ProjectsCard({name,about,image}:projects) {
  return (
    <div className=" items-center rounded-md bg-slate-950 p-4 m-2 max-w-xs  h-96 ">
        <div className='flex items-start justify-around text-left'>
        <Image className='rounded-md border-2 border-slate-300 mx-2' src={image} height={150} alt="web" width={150}></Image>
        <h1 className="font-bold text-xl mt-3">{name}</h1>

        </div>
    <p className="w-full mt-3">
    <Typography 
        text={about} 
        width="w-full" 
        charLimit={120}
        height="h-52" // Adjust character limit if needed
      />
    </p>
  </div>
  )
}
