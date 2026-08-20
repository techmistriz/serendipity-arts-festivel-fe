"use client";

import { useMemo } from "react";
import { GLITCH_PALETTE } from "@/config/constants";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Variant = "scroll" | "vibrate" | "bulge";

type GlitchBarProps = {
  seed?: number;
  direction?: "h" | "v";
  reverse?: boolean;
  variant?: Variant;
  className?: string;
  count?: number;
  speed?: number;
};

export default function GlitchBar({
  seed = 5,
  direction = "h",
  reverse = false,
  variant = "scroll",
  className = "",
  count = 80,
  speed = 6,
}: GlitchBarProps) {
  const segments = useMemo(() => {
    const rand = mulberry32(seed);

    return Array.from({ length: count }, () => ({
      pos: rand() * 100,
      len: 1 + rand() * 6,
      color: GLITCH_PALETTE[Math.floor(rand() * GLITCH_PALETTE.length)],
    }));
  }, [seed, count]);

  const isHorizontal = direction === "h";

  let animationName = isHorizontal ? "glitch-x" : "glitch-y";

  if (variant === "scroll" && reverse) {
    animationName = isHorizontal ? "glitch-x-rev" : "glitch-y-rev";
  }

  if (variant === "vibrate") {
    animationName = "glitch-vibrate";
  }

  if (variant === "bulge") {
    animationName = isHorizontal ? "glitch-bulge" : "glitch-bulge-x";
  }

  const animationTiming =
    variant === "vibrate"
      ? `${speed}s steps(5) infinite`
      : variant === "bulge"
        ? `${speed}s ease-in-out infinite`
        : `${speed}s linear infinite`;

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0 flex"
        style={{
          animation: `${animationName} ${animationTiming}`,
          flexDirection: isHorizontal ? "row" : "column",
          transformOrigin: variant === "bulge" ? "center center" : undefined,
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="relative shrink-0"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  background: segment.color,
                  ...(isHorizontal
                    ? {
                        left: `${segment.pos}%`,
                        top: 0,
                        bottom: 0,
                        width: `${segment.len}%`,
                      }
                    : {
                        top: `${segment.pos}%`,
                        left: 0,
                        right: 0,
                        height: `${segment.len}%`,
                      }),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
