"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import profile from "../../public/images/me-s.jpg";
import { texts } from "@/utils/constants";

const stats = [
  { value: "6+", label: "Years Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "99%", label: "Client Satisfaction" },
];

const socialLinks = [
  { icon: "mdi:linkedin", href: "https://www.linkedin.com/in/umar-suhail/", label: "LinkedIn" },
  { icon: "mdi:github", href: "https://github.com/umarsuhail", label: "GitHub" },
  { icon: "mdi:twitter", href: "https://twitter.com/umarsuhail", label: "Twitter" },
];

export default function Card() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-vintage-burgundy/10 border border-vintage-burgundy/30 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vintage-burgundy opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-vintage-burgundy" />
              </span>
              <span className="text-sm text-vintage-cream">Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Hi, I&apos;m{" "}
              <span className="gradient-text">Umar Suhail</span>
              <br />
              <span className="text-vintage-cream/90">Software Architect</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-vintage-cream/70 leading-relaxed mb-8 max-w-xl"
            >
              {texts.about}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <a href="#contact" className="btn-primary">
                <Icon icon="solar:chat-round-dots-bold" className="text-lg" />
                Get In Touch
              </a>
              <a href="#projects" className="btn-secondary">
                <Icon icon="solar:eye-bold" className="text-lg" />
                View Projects
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-vintage-cream/50">Connect with me</span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-vintage-slate/50 border border-vintage-cream/20 flex items-center justify-center hover:bg-vintage-burgundy/20 hover:border-vintage-burgundy/40 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon icon={social.icon} className="text-lg text-vintage-cream/70 hover:text-vintage-cream" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-vintage-burgundy to-vintage-slate rounded-full blur-2xl opacity-30 animate-pulse-slow" />
              <div className="absolute -inset-1 bg-gradient-to-r from-vintage-burgundy to-vintage-slate rounded-full opacity-50" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-vintage-cream/20">
                <Image
                  src={profile}
                  alt="Umar Suhail"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top' }}
                  priority
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -right-4 vintage-card rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/70 flex items-center justify-center">
                    <Icon icon="solar:verified-check-bold" className="text-2xl text-vintage-cream" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-vintage-cream">6+ Years</p>
                    <p className="text-xs text-vintage-cream/50">Experience</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -left-4 vintage-card rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-vintage-slate to-vintage-navy flex items-center justify-center">
                    <Icon icon="solar:star-bold" className="text-2xl text-vintage-cream" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-vintage-cream">Top Rated</p>
                    <p className="text-xs text-vintage-cream/50">Developer</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="vintage-card rounded-xl p-6 text-center card-hover"
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-vintage-cream/50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
