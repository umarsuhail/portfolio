"use client";

import { useEffect } from "react";

/**
 * UI sounds via event delegation (mounted once globally):
 *   - click / tap on any clickable element → pop.mp3   (all devices)
 *   - hover on opt-in [data-hover-sound]   → pop.mp3    (desktop pointers only)
 */
const CLICKABLE_SELECTOR =
  'a[href], button, [role="button"], [role="tab"], [role="menuitem"], ' +
  'input:not([type="hidden"]), select, textarea, label[for], summary, ' +
  '[onclick], .cursor-pointer';
const HOVER_OPT_IN = "[data-hover-sound]";

export default function UISound() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const clickSound = new Audio("/sounds/pop.mp3");
    clickSound.preload = "auto";
    const hoverSound = new Audio("/sounds/pop.mp3");
    hoverSound.preload = "auto";

    // Clone per play so rapid interactions don't cut each other off.
    const play = (base: HTMLAudioElement, volume: number) => {
      const node = base.cloneNode() as HTMLAudioElement;
      node.volume = volume;
      node.play().catch(() => {});
    };

    const isDisabled = (el: Element) =>
      (el as HTMLButtonElement).disabled === true ||
      el.getAttribute("aria-disabled") === "true";

    // ── Click / tap — any clickable element, all devices (the tap is the gesture) ──
    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(CLICKABLE_SELECTOR);
      if (!target || isDisabled(target)) return;
      play(clickSound, 0.45);
    };
    document.addEventListener("click", onClick);

    // ── Hover — opt-in elements only, desktop pointers only ──
    let lastTarget: Element | null = null;
    let unlocked = false;
    const unlock = () => {
      unlocked = true;
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(HOVER_OPT_IN);
      if (!target || target === lastTarget || isDisabled(target)) return;
      lastTarget = target;
      if (unlocked) play(hoverSound, 0.3);
    };
    const onOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Element | null;
      if (lastTarget && (!related || !lastTarget.contains(related))) {
        lastTarget = null;
      }
    };

    if (canHover) {
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
    }

    return () => {
      document.removeEventListener("click", onClick);
      if (canHover) {
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      }
    };
  }, []);

  return null;
}
