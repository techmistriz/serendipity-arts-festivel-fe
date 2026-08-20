"use client";

// A dense matrix of vertical glitch lines, with a "traveling bulge" — a
// wave of vertical scale-up moves across the strip like a lens zooming
// past, giving the impression the whole matrix is in motion.
import { GLITCH_PALETTE } from "@/config/constants";
import { useMemo } from "react";

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
  duration?: number; // seconds for one wave sweep across the matrix
  className?: string;
};

export function MatrixBulge({ seed = 71, count = 90, duration = 3.6, className = "" }: Props) {
  const bars = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      color: GLITCH_PALETTE[Math.floor(rand() * GLITCH_PALETTE.length)],
    }));
  }, [seed, count]);

  return (
    <div
      className={`relative w-full overflow-hidden flex items-center gap-[3px] md:gap-[4px] ${className}`}
      aria-hidden
    >
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 origin-center min-w-[8px] md:min-w-[6px]"
          style={{
            background: b.color,
            height: "45%",
            animation: `bulge-wave ${duration}s linear ${-(i / count) * duration}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
