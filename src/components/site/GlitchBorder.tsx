// Wraps a tile so that on hover the black border dissolves into moving
// glitch strips on all four edges. On hover the strips also *expand*
// (get thicker) and stretch a touch beyond the tile so the effect feels
// bolder and more alive.
import { GlitchBar } from "./GlitchBar";

type Props = {
  seed?: number;
  thickness?: number; // px, resting thickness
  hoverBoost?: number; // px, extra thickness on hover
  delayMs?: number;
  children: React.ReactNode;
  className?: string;
};

export function GlitchBorder({
  seed = 3,
  thickness = 1,
  hoverBoost = 10,
  delayMs = 200,
  children,
  className = "",
}: Props) {
  const t = `${thickness}px`;
  const boosted = `${thickness + hoverBoost}px`;
  const style = { transitionDelay: `${delayMs}ms` } as React.CSSProperties;

  return (
    <div
      className={`relative border-black bg-black group ${className}`}
      style={{ borderWidth: t }}
    >
      {children}
      {/* Animated glitch strips revealed on hover — thicker + longer than the resting border */}
      <div
        className="pointer-events-none absolute -inset-[10px] opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
        style={style}
        aria-hidden
      >
        {/* Top — scrolls left */}
        <div className="absolute inset-x-0 top-0" style={{ height: boosted }}>
          <GlitchBar seed={seed} direction="h" speed={2.2} count={160} className="w-full h-full" />
        </div>
        {/* Bottom — scrolls right (reverse) */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: boosted }}>
          <GlitchBar seed={seed + 7} direction="h" reverse speed={2.6} count={160} className="w-full h-full" />
        </div>
        {/* Left — scrolls up */}
        <div className="absolute inset-y-0 left-0" style={{ width: boosted }}>
          <GlitchBar seed={seed + 13} direction="v" reverse speed={2.4} count={150} className="w-full h-full" />
        </div>
        {/* Right — scrolls down */}
        <div className="absolute inset-y-0 right-0" style={{ width: boosted }}>
          <GlitchBar seed={seed + 21} direction="v" speed={2.8} count={150} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}


