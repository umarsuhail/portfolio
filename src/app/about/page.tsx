import { Icon } from '@iconify/react/dist/iconify.js';
import {texts} from '../../utils/constants';

export default function page() {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-20">
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
    {/* Mobile Menu Button */}
    <div className="flex justify-end md:hidden">
      <button className="text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    {/* Main Content */}
    <div className="mt-12 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight animate-fadeInUp mb-4">Get to Know Me</h1>
      <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
        {texts.about}
      </p>
      
    </div>
    <div className='flex items-center justify-center w-full bg-white shadow-xl md:h-36 p-2 rounded-md'>
    <h1 className='text-xl font-semibold text-gray-900 m-2'>Hobbies</h1>
    <div className='w-full flex m-3 p-2 items-center border-2 border-gray-200 rounded-md'>
    <Icon icon="noto-v1:cricket-game" fontSize={50} className=''/>
    <span className='text-gray-900 mx-2'>Cricket</span>
    </div>
    <div className='w-full flex m-3 p-2 items-center border-2 border-gray-200 rounded-md'>
    <Icon icon="noto-v1:musical-score" fontSize={50} className=''/>
    <span className='text-gray-900 mx-2'>Music</span>
    </div>
    <div className='w-full flex m-3 p-2 items-center border-2 border-gray-200 rounded-md'>
    <Icon icon="logos:google-photos" fontSize={50} className=''/>
    <span className='text-gray-900 mx-2'>Photography</span>
    </div>
    </div>
    
  </div>
</div>

    
  )
}
