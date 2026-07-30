"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.out" });
    }, el);
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div key={pathname} ref={ref}>
      {children}
    </div>
  );
}
