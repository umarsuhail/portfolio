"use client";

import { useEffect } from "react";

/**
 * Plays UI sounds via event delegation on the document, so every current and
 * future clickable element is covered without per-component wiring:
 *   - click / tap  → pop.mp3   (all devices, incl. phones — a tap is a gesture)
 *   - hover        → hover.wav (desktop pointers only; touch devices can't hover)
 */
const CLICKABLE_SELECTOR =
  'a[href], button, [role="button"], [role="tab"], [role="menuitem"], ' +
  'input:not([type="hidden"]), select, textarea, label[for], summary, ' +
  '[onclick], [data-hover-sound], .cursor-pointer';

export default function UISound() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const clickSound = new Audio("/sounds/pop.mp3");
    clickSound.preload = "auto";
    const hoverSound = new Audio("/sounds/hover.wav");
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

    // ── Click / tap — works on every device (the tap itself is the gesture) ──
    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(CLICKABLE_SELECTOR);
      if (!target || isDisabled(target)) return;
      play(clickSound, 0.45);
    };
    document.addEventListener("click", onClick);

    // ── Hover — desktop (fine pointer) only ──
    let lastTarget: Element | null = null;
    let unlocked = false;
    const unlock = () => {
      unlocked = true;
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(CLICKABLE_SELECTOR);
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
      // Browsers block audio until the first gesture — unlock once for hover.
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
