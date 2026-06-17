"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import profile from "../../../public/images/me-s.jpeg";
import { texts } from "@/utils/constants";

const stats = [
  { value: "7+",  label: "Years Experience" },
  { value: "6+",  label: "Projects Delivered" },
  { value: "1M+", label: "Transactions Monitored" },
  { value: "50+", label: "Tenant Configurations" },
];

const socialLinks = [
  { icon: "mdi:linkedin", href: "https://www.linkedin.com/in/umar-suhail/", label: "LinkedIn" },
  { icon: "mdi:github",   href: "https://github.com/umarsuhail",            label: "GitHub" },
  { icon: "mdi:twitter",  href: "https://twitter.com/umarsuhail",           label: "Twitter" },
];

// Gold + steel premium palette
const GOLD_RICH  = "#C8A84B";
const GOLD_DEEP  = "#8A6A1A";
const GOLD_DARK  = "#5F4A10";
const NAVY       = "#0F172A";
const STEEL      = "#475569";
const TEXT_1     = "#0F172A";
const TEXT_2     = "#334155";
const TEXT_3     = "#64748B";

export default function Card() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">

      {/* Gradient background — gold shimmer left, steel right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `radial-gradient(ellipse 70% 55% at 15% 35%, rgba(200,168,75,0.10) 0%, transparent 65%),` +
            `radial-gradient(ellipse 55% 45% at 85% 65%, rgba(71,85,105,0.07) 0%, transparent 60%)`,
        }}
      />

      <div className="section-container relative z-10 w-full">

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-2 lg:order-1 flex flex-col gap-8"
          >
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full"
              style={{
                border: `1px solid rgba(200,168,75,0.35)`,
                background: `rgba(200,168,75,0.08)`,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: GOLD_DEEP }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: GOLD_DEEP }}
                />
              </span>
              <span className="text-sm font-medium" style={{ color: GOLD_DEEP }}>
                Available for opportunities
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p
                className="text-sm font-semibold tracking-[0.18em] uppercase mb-3"
                style={{ color: GOLD_DEEP }}
              >
                Lead Frontend Engineer
              </p>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
                style={{ color: TEXT_1 }}
              >
                Hi, I&apos;m{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${GOLD_RICH} 0%, ${NAVY} 100%)`,
                  }}
                >
                  Umar Suhail
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg leading-[1.8] max-w-lg"
              style={{ color: TEXT_2 }}
            >
              {texts.about}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-3 items-center"
            >
              {/* Primary — gold gradient + shimmer */}
              <motion.a
                href="#contact"
                data-hover-sound
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white landing-btn-primary"
                style={{
                  background: `linear-gradient(135deg, ${GOLD_DEEP} 0%, ${GOLD_DARK} 100%)`,
                  boxShadow: `0 4px 14px rgba(138,106,26,0.35), 0 1px 3px rgba(138,106,26,0.2)`,
                }}
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: "0 10px 28px rgba(138,106,26,0.50), 0 3px 8px rgba(138,106,26,0.28)",
                  transition: { duration: 0.16, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
              >
                <Icon icon="solar:chat-round-dots-bold" className="text-base" />
                Get In Touch
              </motion.a>

              {/* Secondary — white + steel border + shimmer */}
              <motion.a
                href="#projects"
                data-hover-sound
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm landing-btn-secondary"
                style={{
                  color: NAVY,
                  background: "#FFFFFF",
                  border: `1px solid rgba(15,23,42,0.14)`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)",
                }}
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: "0 8px 24px rgba(15,23,42,0.11), 0 2px 6px rgba(15,23,42,0.06)",
                  transition: { duration: 0.16, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
              >
                <Icon icon="solar:eye-bold" className="text-base" />
                View Projects
              </motion.a>

              <motion.a
                href="/umar-suhail-resume-2026.pdf"
                download="Umar-Suhail-Resume.pdf"
                data-hover-sound
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm landing-btn-secondary"
                style={{
                  color: NAVY,
                  background: "#FFFFFF",
                  border: `1px solid rgba(15,23,42,0.14)`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)",
                }}
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: "0 8px 24px rgba(15,23,42,0.11), 0 2px 6px rgba(15,23,42,0.06)",
                  transition: { duration: 0.16, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
              >
                <Icon icon="solar:file-download-bold" className="text-base" />
                Download CV
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-4 pt-1"
            >
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: TEXT_3 }}
              >
                Connect
              </span>
              <div className="h-px w-8" style={{ background: "#CBD2E0" }} />
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E6EF",
                      color: STEEL,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = GOLD_DEEP;
                      (e.currentTarget as HTMLElement).style.borderColor = `rgba(200,168,75,0.4)`;
                      (e.currentTarget as HTMLElement).style.background = `rgba(200,168,75,0.06)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = STEEL;
                      (e.currentTarget as HTMLElement).style.borderColor = "#E2E6EF";
                      (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                    }}
                  >
                    <Icon icon={social.icon} className="text-base" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — portrait */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">

              {/* Decorative ring — gold + steel */}
              <div
                className="absolute -inset-3 rounded-full opacity-50"
                style={{
                  background: `conic-gradient(from 0deg, ${GOLD_RICH}, ${STEEL}, ${NAVY}, ${GOLD_RICH})`,
                  padding: "1.5px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              {/* Portrait */}
              <div
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-white"
                style={{
                  boxShadow:
                    "0 0 0 4px #fff, 0 0 0 6px #E2E6EF, 0 20px 60px rgba(15,23,42,0.14), 0 4px 12px rgba(15,23,42,0.07)",
                }}
              >
                <Image
                  src={profile}
                  alt="Umar Suhail"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "top" }}
                  priority
                />
              </div>

              {/* Badge — Experience */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 landing-badge"
                style={{
                  boxShadow: "0 4px 24px rgba(15,23,42,0.12), 0 1px 4px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${GOLD_DEEP} 0%, ${GOLD_DARK} 100%)` }}
                >
                  <Icon icon="solar:verified-check-bold" className="text-xl" style={{ color: "#ffffff" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: TEXT_1 }}>7+ Years</p>
                  <p className="text-xs" style={{ color: TEXT_3 }}>Experience</p>
                </div>
              </motion.div>

              {/* Badge — Top rated */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 }}
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 landing-badge"
                style={{
                  boxShadow: "0 4px 24px rgba(15,23,42,0.12), 0 1px 4px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${STEEL} 0%, ${NAVY} 100%)` }}
                >
                  <Icon icon="solar:star-bold" className="text-xl" style={{ color: "#ffffff" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: TEXT_1 }}>Top Rated</p>
                  <p className="text-xs" style={{ color: TEXT_3 }}>Developer</p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + index * 0.08 }}
              className="bg-white rounded-2xl px-6 py-5 text-center group hover:-translate-y-1 transition-transform duration-300"
              style={{
                boxShadow: "0 1px 3px rgba(15,23,42,0.07), 0 4px 16px rgba(15,23,42,0.05)",
                border: "1px solid rgba(15,23,42,0.06)",
              }}
            >
              <p
                className="text-3xl md:text-4xl font-bold mb-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${GOLD_RICH} 0%, ${NAVY} 100%)`,
                }}
              >
                {stat.value}
              </p>
              <p className="text-sm font-medium" style={{ color: TEXT_3 }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
