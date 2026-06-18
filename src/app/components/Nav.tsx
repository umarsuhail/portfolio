"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/about",    label: "About",    icon: "solar:user-bold-duotone" },
  { href: "#projects", label: "Projects", icon: "solar:code-bold-duotone" },
  { href: "#skills",   label: "Skills",   icon: "solar:star-bold-duotone" },
  { href: "#contact",  label: "Contact",  icon: "solar:chat-round-dots-bold-duotone" },
];

export default function Nav() {
  const [isOpen, setIsOpen]               = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const pathname = usePathname();
  const isLight  = pathname === "/";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        const sections = ["projects", "skills", "contact"];
        for (const s of sections) {
          const el = document.getElementById(s);
          if (el) {
            const r = el.getBoundingClientRect();
            if (r.top <= 150 && r.bottom >= 150) {
              setActiveSection(`#${s}`);
              ticking = false;
              return;
            }
          }
        }
        setActiveSection("");
        ticking = false;
      });
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
        scrolled ? "py-3" : "py-5"
      } ${
        !isLight && scrolled
          ? "bg-vintage-navy/80 backdrop-blur-xl border-b border-vintage-cream/10"
          : ""
      }`}
      style={isLight ? {
        background:           scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.84)",
        backdropFilter:       "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        borderBottom:         "1px solid rgba(15,23,42,0.09)",
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              {isLight ? (
                <>
                  <div
                    className="absolute inset-0 rounded-lg blur-md opacity-40 group-hover:opacity-65 transition-opacity"
                    style={{ background: "linear-gradient(135deg, rgba(138,106,26,0.5), rgba(71,85,105,0.4))" }}
                  />
                  <div
                    className="relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                    style={{ background: "linear-gradient(135deg, #8A6A1A 0%, #475569 100%)", color: "#fff" }}
                  >
                    U
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-vintage-burgundy to-vintage-slate rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-vintage-burgundy to-vintage-slate rounded-lg flex items-center justify-center">
                    <span className="text-vintage-cream font-bold text-lg">U</span>
                  </div>
                </>
              )}
            </div>
            <div className="hidden sm:block">
              {isLight ? (
                <>
                  <span
                    className="font-semibold text-lg block"
                    style={{ color: "#0F172A" }}
                  >
                    Umar Suhail
                  </span>
                  <span className="block text-xs" style={{ color: "#64748B" }}>
                    Lead Frontend Engineer
                  </span>
                </>
              ) : (
                <>
                  <span className="text-vintage-cream font-semibold text-lg group-hover:text-vintage-burgundy transition-colors">
                    Umar Suhail
                  </span>
                  <span className="block text-xs text-vintage-cream/50">Lead Frontend Engineer</span>
                </>
              )}
            </div>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isLight
                      ? ""
                      : isActive
                        ? "text-vintage-cream"
                        : "text-vintage-cream/60 hover:text-vintage-cream"
                  }`}
                  style={isLight ? { color: isActive ? "#0F172A" : "#475569" } : {}}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg"
                      style={isLight ? {
                        background: "rgba(200,168,75,0.08)",
                        border:     "1px solid rgba(200,168,75,0.28)",
                      } : {
                        background: "rgba(71,85,105,0.5)",
                        border:     "1px solid rgba(255,255,255,0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon
                      icon={link.icon}
                      className="text-lg"
                      style={isLight ? { color: isActive ? "#8A6A1A" : "#64748B" } : {}}
                    />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop action buttons ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {isLight ? (
              <>
                <LightNavBtn href="/resume-builder" icon="solar:document-text-bold-duotone" isLink>
                  Resume Builder
                </LightNavBtn>
                <LightNavBtn href="/umar-suhail-resume-2026.pdf" download="Umar-Suhail-Resume.pdf" icon="solar:file-download-bold-duotone">
                  Download CV
                </LightNavBtn>
                <a
                  href="https://wa.me/971568323258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #8A6A1A 0%, #5F4A10 100%)",
                    color:      "#ffffff",
                    boxShadow:  "0 4px 14px rgba(138,106,26,0.30)",
                  }}
                >
                  Let&apos;s Talk
                  <Icon icon="solar:arrow-right-linear" className="text-base" />
                </a>
              </>
            ) : (
              <>
                <Link href="/resume-builder" className="btn-secondary text-sm px-4 py-2">
                  <Icon icon="solar:document-text-bold-duotone" className="text-lg" />
                  <span>Resume Builder</span>
                </Link>
                <a href="/umar-suhail-resume-2026.pdf" download="Umar-Suhail-Resume.pdf" className="btn-secondary text-sm px-4 py-2">
                  <Icon icon="solar:file-download-bold-duotone" className="text-lg" />
                  <span>Download CV</span>
                </a>
                <a href="https://wa.me/971568323258" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-4 py-2">
                  <span>Let&apos;s Talk</span>
                  <Icon icon="solar:arrow-right-linear" />
                </a>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                className={`block h-0.5 rounded-full origin-center ${isLight ? "bg-[#334155]" : "bg-vintage-cream"}`}
              />
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                className={`block h-0.5 rounded-full ${isLight ? "bg-[#334155]" : "bg-vintage-cream"}`}
              />
              <motion.span
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                className={`block h-0.5 rounded-full origin-center ${isLight ? "bg-[#334155]" : "bg-vintage-cream"}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden ${
              isLight ? "" : "bg-vintage-navy/95 backdrop-blur-xl border-t border-vintage-cream/10"
            }`}
            style={isLight ? {
              background:           "rgba(255,255,255,0.98)",
              backdropFilter:       "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop:            "1px solid rgba(15,23,42,0.09)",
            } : {}}
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  {isLight ? (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm"
                      style={{ color: "#334155" }}
                    >
                      <Icon icon={link.icon} className="text-xl" style={{ color: "#8A6A1A" }} />
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-vintage-cream/80 hover:text-vintage-cream hover:bg-vintage-slate/30 rounded-lg transition-all"
                    >
                      <Icon icon={link.icon} className="text-xl text-vintage-burgundy" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {isLight ? (
                  <>
                    <LightNavBtn href="/resume-builder" icon="solar:document-text-bold-duotone" isLink fullWidth>
                      Resume Builder
                    </LightNavBtn>
                    <LightNavBtn href="/umar-suhail-resume-2026.pdf" download="Umar-Suhail-Resume.pdf" icon="solar:file-download-bold-duotone" fullWidth>
                      Download CV
                    </LightNavBtn>
                    <a
                      href="https://wa.me/971568323258"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #8A6A1A 0%, #5F4A10 100%)",
                        color:      "#ffffff",
                        boxShadow:  "0 4px 14px rgba(138,106,26,0.30)",
                      }}
                    >
                      Let&apos;s Talk
                      <Icon icon="solar:arrow-right-linear" className="text-base" />
                    </a>
                  </>
                ) : (
                  <>
                    <Link href="/resume-builder" onClick={() => setIsOpen(false)} className="btn-secondary justify-center">
                      <Icon icon="solar:document-text-bold-duotone" />
                      Resume Builder
                    </Link>
                    <a href="/umar-suhail-resume-2026.pdf" download="Umar-Suhail-Resume.pdf" className="btn-secondary justify-center">
                      <Icon icon="solar:file-download-bold-duotone" />
                      Download CV
                    </a>
                    <a href="https://wa.me/971568323258" target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                      Let&apos;s Talk <Icon icon="solar:arrow-right-linear" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ── Light-theme secondary button ─────────────────────────────────────────
function LightNavBtn({
  href, icon, children, isLink, download, fullWidth,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  isLink?: boolean;
  download?: string;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            "8px",
    padding:        "8px 16px",
    borderRadius:   "12px",
    fontSize:       "14px",
    fontWeight:     600,
    color:          "#334155",
    background:     hovered ? "#EEF0F6" : "#FFFFFF",
    border:         hovered ? "1px solid rgba(15,23,42,0.22)" : "1px solid rgba(15,23,42,0.13)",
    boxShadow:      "0 1px 3px rgba(15,23,42,0.07)",
    transition:     "all 0.18s",
    textDecoration: "none",
    cursor:         "pointer",
    ...(fullWidth ? { justifyContent: "center", width: "100%" } : {}),
  };

  const inner = (
    <>
      <Icon icon={icon} style={{ fontSize: "17px", color: "#64748B", flexShrink: 0 }} />
      <span>{children}</span>
    </>
  );

  const events = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (isLink) {
    return <Link href={href} style={style} {...events}>{inner}</Link>;
  }
  return (
    <a href={href} {...(download ? { download } : {})} style={style} {...events}>
      {inner}
    </a>
  );
}
