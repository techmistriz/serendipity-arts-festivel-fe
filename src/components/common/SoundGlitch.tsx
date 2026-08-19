"use client";

// A "sound mountain" — equalizer-style vertical bars in the brand glitch
// palette. Each bar breathes on its own delay so the strip reads as sound.
import { PALETTE as _P } from "@/data/glitch-palette";
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

type Props = {
  seed?: number;
  count?: number;
  className?: string;
};

export function SoundGlitch({ seed = 11, count = 48, className = "" }: Props) {
  const bars = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      base: 12 + rand() * 60, // % of container height
      amp: 20 + rand() * 55, // % amplitude
      dur: 0.7 + rand() * 1.6, // seconds
      delay: -rand() * 2, // seconds (negative = mid-animation)
    }));
  }, [seed, count]);

  return (
    <div
      className={`relative w-full overflow-hidden flex items-end gap-[3px] md:gap-[4px] ${className}`}
      aria-hidden
    >
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 origin-bottom min-w-[8px] md:min-w-[6px]"
          style={
            {
              background: b.color,
              height: `${b.base}%`,
              animation: `sound-bulge ${b.dur}s ease-in-out ${b.delay}s infinite alternate`,
              ["--amp" as never]: `${b.amp / 100 + 0.5}`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
