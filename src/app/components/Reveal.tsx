'use client';

import { useEffect, useRef, useState } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** initial Y offset (px) */
  y?: number;
  /** initial X offset (px) */
  x?: number;
  /** initial scale */
  scale?: number;
  /** delay before the tween (seconds) */
  delay?: number;
  /** tween duration (seconds) */
  duration?: number;
  /** animate when scrolled into view instead of on mount */
  inView?: boolean;
  /** portion of element visible before an inView reveal fires (0–1) */
  amount?: number;
};

export default function Reveal({
  children,
  y = 24,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 0.7,
  inView = true,
  amount = 0.3,
  style,
  ...rest
}: Props) {
  const [isVisible, setIsVisible] = useState(!inView);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!inView || isVisible) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, amount, isVisible]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: "opacity, transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
