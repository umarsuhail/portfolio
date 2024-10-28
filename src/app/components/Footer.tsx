import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';

export default function Footer() {
  return (
    <footer className=' bg-black text-white w-full p-4'>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold text-lg mb-2">About me</h3>
          <p className="text-sm text-gray-400">
          I create high-quality web experiences. Connect with me on social media for updates and new projects!
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        <div className='flex flex-col'>
        <h3 className="font-bold text-lg mb-2">Connect with me.</h3>

          <div className="flex space-x-4 w-full">
            <a href="https://www.linkedin.com/in/umar-suhail/" aria-label="LinkedIn" className="hover:text-gray-300 hover:bg-purple-400 rounded-md p-2"><Icon icon="logos:linkedin" className=''></Icon></a>
          </div>
          <div className="flex space-x-4 mt-3">
            <a href="https://www.linkedin.com/in/umar-suhail/" aria-label="LinkedIn" className="hover:text-gray-300  hover:bg-purple-400 rounded-md p-2"><Icon icon="logos:whatsapp"></Icon></a>
          </div>
          <div className="flex space-x-4 mt-3">
            <a href="https://www.linkedin.com/in/umar-suhail/" aria-label="LinkedIn" className="hover:text-gray-300  hover:bg-purple-400 rounded-md p-2"><Icon icon="logos:instagram"></Icon></a>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-700 pt-2 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Umar Suhail. All rights reserved.
      </div>
    </footer>
  );
}
