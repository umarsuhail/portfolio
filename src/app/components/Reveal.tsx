type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** initial Y offset (px) */
  y?: number;
  /** initial X offset (px) */
  x?: number;
  /** initial scale */
  scale?: number;
  /** delay before the tween (seconds) — ignored for inView */
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
  y: _y = 24,
  x: _x = 0,
  scale: _scale,
  delay: _delay = 0,
  duration: _duration = 0.7,
  inView: _inView = false,
  amount: _amount = 0.3,
  style,
  ...rest
}: Props) {
  return (
    <div style={style} {...rest}>
      {children}
    </div>
  );
}
