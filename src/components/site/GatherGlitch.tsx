// Glitch lines stream in from the left and right edges and "gather" at the
// center, forming a dense rectangular block of stacked color bars. The whole
// group arrives together, holds visibly, then fades and repeats.
// Travel distances use `cqw` (container query width) so the animation works
// correctly inside narrow containers (e.g. mobile columns).
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

type Props = {
  seed?: number;
  count?: number;
  duration?: number;
  /** Width of the gathered rectangle at the center, in px. */
  rectWidth?: number;
  /** Height of each bar as a CSS value (default full height). */
  barHeight?: string;
  className?: string;
};

export function GatherGlitch({
  seed = 91,
  count = 140,
  duration = 4.5,
  rectWidth = 260,
  barHeight = "100%",
  className = "",
}: Props) {

  const bars = useMemo(() => {
    const rand = mulberry32(seed);
    const half = rectWidth / 2;
    return Array.from({ length: count }, (_, i) => {
      const side = rand() < 0.5 ? ("l" as const) : ("r" as const);
      const offset = Math.round((rand() * 2 - 1) * half);
      return {
        side,
        color: PALETTE[Math.floor(rand() * PALETTE.length)],
        widthPx: 4 + Math.floor(rand() * 6),
        offset,
        delay: -(rand() * duration * 0.25),
        dur: duration,
        key: i,
      };
    });
  }, [seed, count, duration, rectWidth]);

  return (
    <div className={`relative ${className}`} aria-hidden>
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden"
        style={{ height: barHeight, containerType: "inline-size" } as React.CSSProperties}
      >
        {bars.map((b) => {
          // Gather target inside a centered rectangle; expressed in cqw so
          // it scales with the container on mobile without clamping travel.
          const tx = b.side === "l"
            ? `calc(50cqw - ${b.widthPx / 2}px + ${b.offset}px)`
            : `calc(-50cqw + ${b.widthPx / 2}px + ${b.offset}px)`;

          return (
            <div
              key={b.key}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: `${b.widthPx}px`,
                background: b.color,
                left: b.side === "l" ? 0 : "auto",
                right: b.side === "r" ? 0 : "auto",
                ["--tx" as never]: tx,
                animation: `${b.side === "l" ? "gather-left" : "gather-right"} ${b.dur}s cubic-bezier(0.22,0.61,0.36,1) ${b.delay}s infinite`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </div>
  );

}
