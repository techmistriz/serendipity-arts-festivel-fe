// Serendipity "listen · gather · move" glitch-lines motif.
// Vertical strips using the brand palette. Deterministic per seed so it
// doesn't jitter on re-render.
// import { PALETTE } from "@/lib/glitch-palette";

import { PALETTE } from "@/src/lib/glitch-palette";

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
  columns?: number;
  className?: string;
  density?: number; // 0..1 – how filled each column is
};

export function GlitchLines({ seed = 7, columns = 60, className = "", density = 0.75 }: Props) {
  const rand = mulberry32(seed);
  const cols = Array.from({ length: columns }, (_, i) => {
    const segs: { y: number; h: number; c: string }[] = [];
    let y = 0;
    while (y < 100) {
      const h = 3 + rand() * 22;
      if (rand() < density) {
        segs.push({ y, h, c: PALETTE[Math.floor(rand() * PALETTE.length)] });
      }
      y += h + rand() * 4;
    }
    return { i, segs };
  });
  const w = 100 / columns;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={`block ${className}`}
    >
      {cols.map((c) =>
        c.segs.map((s, j) => (
          <rect
            key={`${c.i}-${j}`}
            x={c.i * w}
            y={s.y}
            width={w * 0.85}
            height={s.h}
            fill={s.c}
          />
        )),
      )}
    </svg>
  );
}
