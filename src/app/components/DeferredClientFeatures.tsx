"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BackgroundEffects = dynamic(() => import("./BackgroundEffects"), { ssr: false });
const ChatBot = dynamic(() => import("../chatbot/ChatBot"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const ScrollController = dynamic(() => import("./ScrollController"), { ssr: false });
const ScrollProgress = dynamic(() => import("./ScrollProgress"), { ssr: false });
const SpiderWebClick = dynamic(() => import("./SpiderWebClick"), { ssr: false });
const UISound = dynamic(() => import("./UISound"), { ssr: false });

export default function DeferredClientFeatures() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const load = () => {
      setReady(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("pointermove", load);
      window.removeEventListener("scroll", load);
      window.removeEventListener("keydown", load);
    };

    window.addEventListener("pointerdown", load, { passive: true });
    window.addEventListener("pointermove", load, { passive: true });
    window.addEventListener("scroll", load, { passive: true });
    window.addEventListener("keydown", load);

    return cleanup;
  }, []);

  if (!ready) return null;

  return (
    <>
      <CustomCursor />
      <SpiderWebClick />
      <BackgroundEffects />
      <ScrollProgress />
      <ScrollController />
      <UISound />
      <ChatBot />
    </>
  );
}
