"use client";

import { useEffect, useRef, useState } from "react";
import CriticalIcon from "./CriticalIcon";

type Variant = "light" | "dark";

interface Props {
  variant?: Variant;
  fullWidth?: boolean;
}

const OPTIONS = [
  {
    label: "PDF",
    desc: "Standard PDF format",
    icon: "file",
    href: "/umar-suhail-resume-2026.pdf",
    download: "Umar-Suhail-Resume.pdf",
  },
  {
    label: "LaTeX",
    desc: "Source .tex file",
    icon: "code",
    href: "/resume.tex",
    download: "Umar-Suhail-Resume.tex",
  },
] as const;

export default function DownloadCVMenu({ variant = "light", fullWidth = false }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLight = variant === "light";

  const triggerStyle: React.CSSProperties | undefined = isLight
    ? {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#334155",
        background: "#FFFFFF",
        border: "1px solid rgba(15,23,42,0.13)",
        boxShadow: "0 1px 3px rgba(15,23,42,0.07)",
        cursor: "pointer",
        textDecoration: "none",
        ...(fullWidth ? { justifyContent: "center", width: "100%" } : {}),
      }
    : undefined;

  return (
    <div ref={ref} style={{ position: "relative", display: fullWidth ? "block" : "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={isLight ? "" : "btn-secondary text-sm px-4 py-2"}
        style={isLight ? triggerStyle : fullWidth ? { width: "100%" } : undefined}
      >
        <CriticalIcon name="download" className="h-[18px] w-[18px] shrink-0" style={isLight ? { color: "#64748B" } : undefined} />
        <span>Download CV</span>
        <CriticalIcon
          name={open ? "chevron-up" : "chevron-down"}
          className="h-3.5 w-3.5"
          style={isLight
            ? { color: "#94a3b8", marginLeft: "2px" }
            : { opacity: 0.6, marginLeft: "2px" }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 rounded-xl overflow-hidden"
          style={{
            ...(fullWidth ? { left: 0 } : { right: 0 }),
            minWidth: "180px",
            background: "linear-gradient(150deg, rgba(20,14,22,0.96) 0%, rgba(11,16,38,0.98) 100%)",
            border: "1px solid rgba(230,36,41,0.3)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          {OPTIONS.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              download={opt.download}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 transition-colors duration-150"
              style={{ textDecoration: "none", color: "rgba(244,233,232,0.85)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(230,36,41,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <CriticalIcon name={opt.icon} className="h-[18px] w-[18px] shrink-0" style={{ color: "#E62429" }} />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>{opt.label}</p>
                <p style={{ fontSize: "11px", color: "rgba(244,233,232,0.5)", lineHeight: 1.3 }}>{opt.desc}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
