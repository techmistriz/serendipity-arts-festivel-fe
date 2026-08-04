// A thin animated glitch-lines strip used as an "intervention" — modal headers,
// hover reveals, etc. Variants let the same strip scroll, vibrate, or bulge.
import { PALETTE as _P } from "@/lib/glitch-palette";
import { useMemo } from "react";

const PALETTE = _P;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Variant = "scroll" | "vibrate" | "bulge";

type Props = {
  seed?: number;
  direction?: "h" | "v";
  reverse?: boolean;
  variant?: Variant;
  className?: string;
  count?: number;
  speed?: number; // seconds for one loop
};

export function GlitchBar({
  seed = 5,
  direction = "h",
  reverse = false,
  variant = "scroll",
  className = "",
  count = 80,
  speed = 6,
}: Props) {
  const segs = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      pos: rand() * 100,
      len: 1 + rand() * 6,
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
    }));
  }, [seed, count]);

  const isH = direction === "h";

  let animationName = isH ? "glitch-x" : "glitch-y";
  if (variant === "scroll" && reverse) animationName = isH ? "glitch-x-rev" : "glitch-y-rev";
  if (variant === "vibrate") animationName = "glitch-vibrate";
  if (variant === "bulge") animationName = isH ? "glitch-bulge" : "glitch-bulge-x";

  const timing =
    variant === "vibrate"
      ? `${speed}s steps(5) infinite`
      : variant === "bulge"
        ? `${speed}s ease-in-out infinite`
        : `${speed}s linear infinite`;

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0 flex"
        style={{
          animation: `${animationName} ${timing}`,
          flexDirection: isH ? "row" : "column",
          transformOrigin: variant === "bulge" ? "center" : undefined,
        }}
      >
        {[0, 1].map((k) => (
          <div key={k} className="relative shrink-0" style={{ width: isH ? "100%" : "100%", height: isH ? "100%" : "100%" }}>
            {segs.map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  background: s.color,
                  ...(isH
                    ? { left: `${s.pos}%`, top: 0, bottom: 0, width: `${s.len}%` }
                    : { top: `${s.pos}%`, left: 0, right: 0, height: `${s.len}%` }),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
