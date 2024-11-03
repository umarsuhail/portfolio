"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Tooltip from "./ToolTip";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-slate-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="transition ease-in-out delay-150 text-violet-700 hover:-translate-y-1 hover:scale-125 hover:shadow-md  shadow	 font-extrabold hover:text-fuchsia-600 duration-300">
            <a
              href="/about"
              className="w-full animate-pulse ease-in delay-200 duration-300"
            >
              Umar Suhail P M
            </a>
          </div>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=umarsuhail112@gmail.com"
            target="_blank"
            className="cursor-pointer hover:text-yellow-300 text-xs font-extralight mx-2 text-white opacity-75"
          >
            umarsuhail112@gmail.com
          </a>

          <nav className="hidden md:flex space-x-10">
            <Tooltip text="About Me">
              <a
                href="/about"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 text-center"
              >
                <Icon
                  icon="cib:about-me"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
            <Tooltip text="Projects">
              <a
                href="#projects"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <Icon
                  icon="material-symbols-light:developer-mode"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
            <Tooltip text="Skills">
              <a
                href="#skills"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <Icon
                  icon="game-icons:skills"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
            <Tooltip text="Contact me">
              <a
                href="https://wa.me/9497656243"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <Icon
                  icon="mdi:contact"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <Icon icon="eva:close-outline" className="h-6 w-6" />
              ) : (
                <Icon icon="eva:menu-outline" className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="flex justify-around space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <Tooltip text="About Me">
              <a
                href="/"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 text-center"
              >
                <Icon
                  icon="cib:about-me"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
            <Tooltip text="Projects">
              <a
                href="#projects"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <Icon
                  icon="material-symbols-light:developer-mode"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
            <Tooltip text="Skills">
              <a
                href="#skills"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <Icon
                  icon="game-icons:skills"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
            <Tooltip text="Contact me">
              <a
                href="https://wa.me/9497656243"
                className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <Icon
                  icon="mdi:contact"
                  className="text-xl hover:text-blue-700"
                />
              </a>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
