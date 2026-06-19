"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import profile from "../../../public/images/me-s.jpeg";
import { texts } from "@/utils/constants";
import DownloadCVMenu from "./DownloadCVMenu";

const stats = [
  { value: "7+",  label: "Years Experience" },
  { value: "6+",  label: "Projects Delivered" },
  { value: "1M+", label: "Transactions Monitored" },
  { value: "50+", label: "Tenant Configurations" },
];

const socialLinks = [
  { icon: "mdi:linkedin", href: "https://www.linkedin.com/in/umar-suhail/", label: "LinkedIn" },
  { icon: "mdi:github",   href: "https://github.com/umarsuhail",            label: "GitHub" },
  { icon: "mdi:facebook",  href: "https://facebook.com/umar.suhail1",           label: "facebook" },
  { icon: "mdi:instagram",  href: "https://www.instagram.com/umar_suhail_/",           label: "Instagram" },
]
// Spider-Man palette
const GOLD_RICH  = "#E62429"; // spidey red (decorative / gradients)
const GOLD_DEEP  = "#E62429"; // spidey red (functional accent)
const GOLD_DARK  = "#B11313"; // crimson (button darken)
const NAVY       = "#2B6CE8"; // spidey blue (gradient end — visible on dark)
const STEEL      = "#2B6CE8"; // spidey blue
const TEXT_1     = "#F4E9E8"; // silk (max contrast on dark)
const TEXT_2     = "rgba(244,233,232,0.78)";
const TEXT_3     = "rgba(244,233,232,0.55)";

// Dark glass surface used for cards/badges on the grunge background
const CARD_BG     = "linear-gradient(150deg, rgba(20,14,22,0.9) 0%, rgba(11,16,38,0.92) 100%)";
const CARD_BORDER = "rgba(230,36,41,0.3)";
const CARD_SHADOW = "0 10px 30px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(244,233,232,0.06)";

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
                border: `1px solid rgba(230,36,41,0.4)`,
                background: `rgba(230,36,41,0.12)`,
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
                Lead Frontend Engineer &amp; Application Developer
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
              <p
                className="mt-2 text-sm font-medium italic"
                style={{ color: TEXT_3 }}
              >
                🕷️ Your Friendly Neighbourhood Developer
              </p>
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
                  color: TEXT_1,
                  background: CARD_BG,
                  border: `1px solid rgba(43,108,232,0.45)`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: "0 8px 24px rgba(43,108,232,0.3), 0 2px 6px rgba(43,108,232,0.18)",
                  transition: { duration: 0.16, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
              >
                <Icon icon="solar:eye-bold" className="text-base" />
                View Projects
              </motion.a>

              <DownloadCVMenu variant="dark" />
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
              <div className="h-px w-8" style={{ background: "rgba(244,233,232,0.2)" }} />
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
                      background: "rgba(11,16,38,0.6)",
                      border: "1px solid rgba(244,233,232,0.14)",
                      color: TEXT_2,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = GOLD_DEEP;
                      (e.currentTarget as HTMLElement).style.borderColor = `rgba(230,36,41,0.5)`;
                      (e.currentTarget as HTMLElement).style.background = `rgba(230,36,41,0.12)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = TEXT_2;
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(244,233,232,0.14)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(11,16,38,0.6)";
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
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-spidey-navy"
                style={{
                  boxShadow:
                    "0 0 0 4px rgba(11,16,38,0.9), 0 0 0 6px rgba(230,36,41,0.45), 0 20px 60px rgba(0,0,0,0.55), 0 0 40px rgba(230,36,41,0.25)",
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
                className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 flex items-center gap-3 landing-badge"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  boxShadow: CARD_SHADOW,
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
                className="absolute -top-4 -left-4 rounded-2xl px-4 py-3 flex items-center gap-3 landing-badge"
                style={{
                  background: CARD_BG,
                  border: `1px solid rgba(43,108,232,0.3)`,
                  boxShadow: CARD_SHADOW,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${STEEL} 0%, #1A3F9C 100%)` }}
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
              className="rounded-2xl px-6 py-5 text-center group hover:-translate-y-1 transition-transform duration-300"
              style={{
                background: CARD_BG,
                boxShadow: CARD_SHADOW,
                border: `1px solid ${CARD_BORDER}`,
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
