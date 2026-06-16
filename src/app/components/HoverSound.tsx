"use client";

import { useEffect } from "react";

/**
 * Plays a short sound whenever the pointer enters any clickable element.
 * Uses event delegation on the document so it covers every current and
 * future clickable element without per-component wiring.
 */
const CLICKABLE_SELECTOR =
  'a[href], button, [role="button"], [role="tab"], [role="menuitem"], ' +
  'input:not([type="hidden"]), select, textarea, label[for], summary, ' +
  '[onclick], [data-hover-sound], .cursor-pointer';

export default function HoverSound() {
  useEffect(() => {
    // Pointer-based hover doesn't make sense on touch devices.
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const base = new Audio("/sounds/hover.wav");
    base.preload = "auto";
    base.volume = 0.35;

    let lastTarget: Element | null = null;
    let unlocked = false;

    // Browsers block audio until the first user gesture — unlock once.
    const unlock = () => {
      unlocked = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    const play = () => {
      if (!unlocked) return;
      const node = base.cloneNode() as HTMLAudioElement;
      node.volume = base.volume;
      node.play().catch(() => {});
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(CLICKABLE_SELECTOR);
      if (!target || target === lastTarget) return;
      if ((target as HTMLButtonElement).disabled) return;
      lastTarget = target;
      play();
    };

    const onOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Element | null;
      // Reset only when the pointer truly leaves the tracked clickable.
      if (lastTarget && (!related || !lastTarget.contains(related))) {
        lastTarget = null;
      }
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return null;
}
