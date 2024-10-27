import {texts} from '../../utils/constants';
import Card from '../components/Card';

export default function page() {
  return (
    <header className="bg-backgroundLight dark:bg-backgroundDark py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
         <Card/>
          <div className="md:hidden">
            <button className="text-backgroundLight dark:text-backgroundDark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
    
        <div className="mt-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 animate-fadeInUp">Get to Know Me</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
           {texts.about}
          </p>
          <div className="mt-8">
            <a href="#projects" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              View My Work
            </a>
          </div>
        </div>
      </div>
    </header>
    
  )
}
