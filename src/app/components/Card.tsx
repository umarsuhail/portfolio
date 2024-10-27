import Image from 'next/image';
import profile from '../../public/images/me.png';
import {  texts } from '@/utils/constants';

export default function Card() {
  return (
    <div className="bg-gray-900 text-white w-full min-h-screen p-4 " id="home">
      <div className='flex flex-col justify-center md:flex-row items-center mt-3 rounded-b-lg'>
      <div className="inline-block mb-6 rounded-full bg-white w-48 h-48 overflow-hidden shadow-xl">
          <Image
            src={profile}
            width={200}
            height={200}
            alt="Picture of the author"
          />
        </div>
       
        <h1 className="text-4xl mx-3 md:w-6/12 font-extrabold tracking-wide break-words leading-10 text-white text-stroke-blue mb-4 animate-fadeInRight">
        Hi👋 i&apos;m <span className='text-yellow-400 md:text-6xl font-extrabold'>Umar Suhail</span>, and i craft web experiences.
        </h1>

      </div>
      
        <h2 className="md:text-center font-light leading-9 tracking-widest mx-10 text-white  animate-fadeInDown">
          {texts.about}
        </h2>

    </div>
  );
};

