"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { href: "/about", label: "About", icon: "solar:user-bold-duotone" },
  { href: "#projects", label: "Projects", icon: "solar:code-bold-duotone" },
  { href: "#skills", label: "Skills", icon: "solar:star-bold-duotone" },
  { href: "#contact", label: "Contact", icon: "solar:chat-round-dots-bold-duotone" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["projects", "skills", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(`#${section}`);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-vintage-navy/80 backdrop-blur-xl border-b border-vintage-cream/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-vintage-burgundy to-vintage-slate rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-vintage-burgundy to-vintage-slate rounded-lg flex items-center justify-center">
                <span className="text-vintage-cream font-bold text-lg">U</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-vintage-cream font-semibold text-lg group-hover:text-vintage-burgundy transition-colors">
                Umar Suhail
              </span>
              <span className="block text-xs text-vintage-cream/50">Software Architect</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                  activeSection === link.href
                    ? "text-vintage-cream"
                    : "text-vintage-cream/60 hover:text-vintage-cream"
                }`}
              >
                {activeSection === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-vintage-slate/50 rounded-lg border border-vintage-cream/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon icon={link.icon} className="text-lg" />
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/resume-builder" className="btn-secondary text-sm px-4 py-2">
              <Icon icon="solar:document-text-bold-duotone" className="text-lg" />
              <span>Resume Builder</span>
            </Link>
            <a
              href="mailto:umarsuhail112@gmail.com"
              className="btn-secondary text-sm px-4 py-2"
            >
              <Icon icon="solar:letter-bold-duotone" className="text-lg" />
              <span>Email Me</span>
            </a>
            <a
              href="https://wa.me/971568323258"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-4 py-2"
            >
              <span>Let&apos;s Talk</span>
              <Icon icon="solar:arrow-right-linear" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 8 : 0,
                }}
                className="block h-0.5 bg-vintage-cream rounded-full origin-center"
              />
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                className="block h-0.5 bg-vintage-cream rounded-full"
              />
              <motion.span
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -8 : 0,
                }}
                className="block h-0.5 bg-vintage-cream rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-vintage-navy/95 backdrop-blur-xl border-t border-vintage-cream/10"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-vintage-cream/80 hover:text-vintage-cream hover:bg-vintage-slate/30 rounded-lg transition-all"
                  >
                    <Icon icon={link.icon} className="text-xl text-vintage-burgundy" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/resume-builder"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary justify-center"
                >
                  <Icon icon="solar:document-text-bold-duotone" />
                  Resume Builder
                </Link>
                <a
                  href="mailto:umarsuhail112@gmail.com"
                  className="btn-secondary justify-center"
                >
                  <Icon icon="solar:letter-bold-duotone" />
                  Email Me
                </a>
                <a
                  href="https://wa.me/971568323258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center"
                >
                  Let&apos;s Talk
                  <Icon icon="solar:arrow-right-linear" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
