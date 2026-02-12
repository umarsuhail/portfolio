"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

const footerLinks = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { icon: "mdi:linkedin", href: "https://www.linkedin.com/in/umar-suhail/", label: "LinkedIn" },
    { icon: "mdi:github", href: "https://github.com/umarsuhail", label: "GitHub" },
    { icon: "mdi:whatsapp", href: "https://wa.me/971568323258", label: "WhatsApp" },
    { icon: "mdi:instagram", href: "https://instagram.com/umarsuhail", label: "Instagram" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-vintage-cream/10 bg-vintage-navy/50 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-vintage-burgundy to-vintage-slate rounded-lg flex items-center justify-center">
                <span className="text-vintage-cream font-bold text-lg">U</span>
              </div>
              <div>
                <span className="text-vintage-cream font-semibold text-lg block">Umar Suhail</span>
                <span className="text-vintage-cream/50 text-xs">Software Architect</span>
              </div>
            </Link>
            <p className="text-vintage-cream/60 text-sm max-w-md mb-6">
              Crafting exceptional digital experiences with modern technologies. 
              Passionate about building user-centric applications that make a difference.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-vintage-slate/50 border border-vintage-cream/10 flex items-center justify-center hover:bg-vintage-burgundy/20 hover:border-vintage-burgundy/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} className="text-lg text-vintage-cream/70 hover:text-vintage-cream" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-vintage-cream font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-vintage-cream/60 hover:text-vintage-burgundy text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-vintage-cream font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:umarsuhail112@gmail.com"
                  className="flex items-center gap-2 text-vintage-cream/60 hover:text-vintage-burgundy text-sm transition-colors duration-300"
                >
                  <Icon icon="solar:letter-linear" />
                  umarsuhail112@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+971568323258"
                  className="flex items-center gap-2 text-vintage-cream/60 hover:text-vintage-burgundy text-sm transition-colors duration-300"
                >
                  <Icon icon="solar:phone-linear" />
                  +971 568 323 258
                </a>
              </li>
              <li className="flex items-center gap-2 text-vintage-cream/60 text-sm">
                <Icon icon="solar:map-point-linear" />
                United Arab Emirates
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-vintage-cream/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-vintage-cream/40 text-sm">
              © {currentYear} Umar Suhail. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <p className="text-vintage-cream/40 text-sm flex items-center gap-2">
                Made with
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Icon icon="solar:heart-bold" className="text-vintage-burgundy" />
                </motion.span>
                using Next.js
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-vintage-burgundy/50 to-transparent" />
    </footer>
  );
}
