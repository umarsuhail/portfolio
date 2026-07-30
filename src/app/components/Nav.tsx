"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CriticalIcon, { type CriticalIconName } from "./CriticalIcon";
import DownloadCVMenu from "./DownloadCVMenu";
import ContactModal from "./ContactModal";
import LoginModal from "./LoginModal";

const navLinks = [
  { href: "/about", label: "About", icon: "user" },
  { href: "#projects", label: "Projects", icon: "code" },
  { href: "#skills", label: "Skills", icon: "star" },
  { href: "#contact", label: "Contact", icon: "chat" },
] as const;

export default function Nav() {
  const [isOpen, setIsOpen]               = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isContactOpen, setContactOpen]   = useState(false);
  const [isLoginOpen, setLoginOpen]       = useState(false);
  const [session, setSession]             = useState<{ email: string } | null>(null);

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

  useEffect(() => {
    if (!isContactOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isContactOpen]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        if (!response.ok) {
          setSession(null);
          return;
        }

        const data = await response.json();
        setSession(data.user ?? null);
      } catch (error) {
        setSession(null);
      }
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setSession(null);
  };

  const handleSectionNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#") || pathname !== "/") return;

    event.preventDefault();
    const section = document.getElementById(href.slice(1));
    if (!section) return;

    const headerOffset = 104;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    window.history.replaceState(null, "", href);
    setIsOpen(false);
  };

  const handleHomeNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
    setActiveSection("");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-3 transition-all duration-500 sm:px-5 ${
        scrolled ? "py-2" : "py-4"
      } ${
        !isLight && scrolled
          ? "bg-vintage-navy/80 backdrop-blur-xl border-b border-vintage-cream/10"
          : ""
      }`}
      style={isLight ? {
        background: "transparent",
      } : {}}
    >
      <div
        className="nav-3d-shell mx-auto max-w-7xl rounded-2xl border px-3 transition-all duration-500 sm:px-5"
        style={isLight ? {
          background: scrolled ? "rgba(11,16,38,0.9)" : "rgba(11,16,38,0.66)",
          borderColor: scrolled ? "rgba(43,108,232,0.42)" : "rgba(244,233,232,0.13)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: scrolled ? "0 14px 42px rgba(0,0,0,0.34), inset 0 1px 0 rgba(244,233,232,0.08)" : "inset 0 1px 0 rgba(244,233,232,0.06)",
        } : {}}
      >
        <div className="flex justify-between items-center">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link href="/" onClick={handleHomeNavigation} className="group flex items-center gap-3 py-2">
            <div className="nav-3d-mark relative">
              {isLight ? (
                <>
                  <div
                    className="absolute inset-0 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"
                    style={{ background: "linear-gradient(135deg, rgba(43,108,232,0.6), rgba(230,36,41,0.45))" }}
                  />
                  <div
                    className="relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                    style={{ background: "linear-gradient(135deg, #2B6CE8 0%, #0B1026 100%)", color: "#F4E9E8" }}
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
                    style={{ color: "#F4E9E8" }}
                  >
                    Umar Suhail
                  </span>
                  <span className="block text-xs" style={{ color: "rgba(244,233,232,0.55)" }}>
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
          <nav className="nav-3d-links hidden lg:flex items-center gap-1 rounded-xl border border-white/10 bg-black/15 p-1" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const resolvedHref = !isLight && link.href.startsWith("#") ? `/${link.href}` : link.href;
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.href}
                  href={resolvedHref}
                  onClick={(event) => handleSectionNavigation(event, link.href)}
                  className={`nav-3d-link relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                    isLight
                      ? ""
                      : isActive
                        ? "text-vintage-cream"
                        : "text-vintage-cream/60 hover:text-vintage-cream"
                  }`}
                  style={isLight ? { color: isActive ? "#F4E9E8" : "rgba(244,233,232,0.6)" } : {}}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-lg shadow-[0_0_18px_rgba(43,108,232,0.18)]"
                      style={isLight ? {
                        background: "rgba(43,108,232,0.14)",
                        border:     "1px solid rgba(43,108,232,0.35)",
                      } : {
                        background: "rgba(71,85,105,0.5)",
                        border:     "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <CriticalIcon
                      name={link.icon}
                      className="h-[18px] w-[18px]"
                      style={isLight ? { color: isActive ? "#2B6CE8" : "rgba(244,233,232,0.5)" } : {}}
                    />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop action buttons ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 py-2">
            {isLight ? (
              <>
                <LightNavBtn href="/resume-builder" icon="file" isLink>
                  Resume Builder
                </LightNavBtn>
                <DownloadCVMenu variant="dark" />
                {session ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={{
                      background: "rgba(110, 231, 183, 0.12)",
                      color: "#E0F2FE",
                      border: "1px solid rgba(56, 189, 248, 0.35)",
                    }}
                  >
                    Logout
                    <CriticalIcon name="logout" className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #E62429 0%, #B11313 100%)",
                      color:      "#F4E9E8",
                      boxShadow:  "0 4px 14px rgba(230,36,41,0.35)",
                    }}
                  >
                    Login
                    <CriticalIcon name="arrow-right" className="h-4 w-4" />
                  </button>
                )}
              </>
            ) : (
              <>
                <Link href="/resume-builder" className="btn-secondary text-sm px-4 py-2">
                  <CriticalIcon name="file" className="h-[18px] w-[18px]" />
                  <span>Resume Builder</span>
                </Link>
                <DownloadCVMenu variant="dark" />
                <button type="button" onClick={() => setContactOpen(true)} className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2">
                  <span>Let&apos;s Talk</span>
                  <CriticalIcon name="arrow-right" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 rounded-full origin-center transition-transform duration-200 ${isLight ? "bg-[#F4E9E8]" : "bg-vintage-cream"}`}
                style={{ transform: isOpen ? "translateY(8px) rotate(45deg)" : "none" }}
              />
              <span
                className={`block h-0.5 rounded-full transition-all duration-200 ${isLight ? "bg-[#F4E9E8]" : "bg-vintage-cream"}`}
                style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? "scaleX(0)" : "scaleX(1)" }}
              />
              <span
                className={`block h-0.5 rounded-full origin-center transition-transform duration-200 ${isLight ? "bg-[#F4E9E8]" : "bg-vintage-cream"}`}
                style={{ transform: isOpen ? "translateY(-8px) rotate(-45deg)" : "none" }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      <div
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen && !isLight
            ? "bg-vintage-navy/95 backdrop-blur-xl border-t border-vintage-cream/10"
            : ""
        }`}
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          ...(isOpen && isLight
            ? {
                background: "rgba(11,16,38,0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(43,108,232,0.2)",
              }
            : {}),
        }}
      >
        <div className="overflow-hidden">
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {isLight ? (
                    <Link
                      href={link.href}
                      onClick={(event) => handleSectionNavigation(event, link.href)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm"
                      style={{ color: "#F4E9E8" }}
                    >
                      <CriticalIcon name={link.icon} className="h-5 w-5" style={{ color: "#2B6CE8" }} />
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-vintage-cream/80 hover:text-vintage-cream hover:bg-vintage-slate/30 rounded-lg transition-all"
                    >
                      <CriticalIcon name={link.icon} className="h-5 w-5 text-vintage-burgundy" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {isLight ? (
                  <>
                    <LightNavBtn href="/resume-builder" icon="file" isLink fullWidth>
                      Resume Builder
                    </LightNavBtn>
                    <DownloadCVMenu variant="dark" fullWidth />
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setLoginOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #E62429 0%, #B11313 100%)",
                        color:      "#F4E9E8",
                        boxShadow:  "0 4px 14px rgba(230,36,41,0.35)",
                      }}
                    >
                      Login
                      <CriticalIcon name="arrow-right" className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/resume-builder" onClick={() => setIsOpen(false)} className="btn-secondary justify-center">
                      <CriticalIcon name="file" className="h-4 w-4" />
                      Resume Builder
                    </Link>
                    <DownloadCVMenu variant="dark" fullWidth />
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setLoginOpen(true);
                      }}
                      className="btn-primary justify-center"
                    >
                      Login <CriticalIcon name="arrow-right" className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
        </div>
      </div>
      <ContactModal open={isContactOpen} onClose={() => setContactOpen(false)} />
      <LoginModal
        open={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={(user) => {
          setSession(user);
          setLoginOpen(false);
        }}
      />
    </header>
  );
}

// ── Light-theme secondary button ─────────────────────────────────────────
function LightNavBtn({
  href, icon, children, isLink, download, fullWidth,
}: {
  href: string;
  icon: CriticalIconName;
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
    color:          "#F4E9E8",
    background:     hovered ? "rgba(43,108,232,0.18)" : "rgba(11,16,38,0.6)",
    border:         hovered ? "1px solid rgba(43,108,232,0.55)" : "1px solid rgba(43,108,232,0.25)",
    boxShadow:      "0 1px 3px rgba(0,0,0,0.4)",
    transition:     "all 0.18s",
    textDecoration: "none",
    cursor:         "pointer",
    ...(fullWidth ? { justifyContent: "center", width: "100%" } : {}),
  };

  const inner = (
    <>
      <CriticalIcon name={icon} className="h-[17px] w-[17px] shrink-0" style={{ color: "#2B6CE8" }} />
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
