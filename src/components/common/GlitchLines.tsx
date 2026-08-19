// Serendipity "listen · gather · move" glitch-lines motif.
// Vertical strips using the brand palette.
// Deterministic per seed so it doesn't jitter on re-render.

import { PALETTE } from "@/src/lib/glitch-palette";
import { useEffect, useRef } from "react";

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
  parallax?: boolean; // Enable mouse + scroll animation
  strength?: number; // Maximum movement in viewBox units
};

export function GlitchLines({
  seed = 7,
  columns = 60,
  className = "",
  density = 0.75,
  parallax = false,
  strength = 3,
}: Props) {
  const rand = mulberry32(seed);

  const cols = Array.from({ length: columns }, (_, i) => {
    const segs: { y: number; h: number; c: string }[] = [];

    let y = 0;

    while (y < 100) {
      const h = 3 + rand() * 22;

      if (rand() < density) {
        segs.push({
          y,
          h,
          c: PALETTE[Math.floor(rand() * PALETTE.length)],
        });
      }

      y += h + rand() * 4;
    }

    // Different depth for each column
    // This creates the parallax effect.
    const depth = 0.25 + rand() * 1.25;

    // Different vertical direction for each column.
    const dir = rand() < 0.5 ? -1 : 1;

    return {
      i,
      segs,
      depth,
      dir,
    };
  });

  const w = 100 / columns;

  const svgRef = useRef<SVGSVGElement | null>(null);

  const groupsRef = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    // Don't run animation if parallax is disabled.
    if (!parallax) return;

    if (typeof window === "undefined") return;

    // Don't run mouse animation on touch devices.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let target = {
      x: 0,
      y: 0,
    };

    const cur = {
      x: 0,
      y: 0,
    };

    let scrollTarget = 0;
    let scrollCur = 0;

    let raf = 0;

    // --------------------------------
    // Mouse movement
    // --------------------------------
    const onMove = (e: PointerEvent) => {
      const el = svgRef.current;

      if (!el) return;

      const r = el.getBoundingClientRect();

      target = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
    };

    // --------------------------------
    // Scroll movement
    // --------------------------------
    const onScroll = () => {
      const el = svgRef.current;

      if (!el) return;

      const r = el.getBoundingClientRect();

      const p =
        (window.innerHeight / 2 - (r.top + r.height / 2)) /
        (window.innerHeight / 2 + r.height / 2);

      scrollTarget = Math.max(-1, Math.min(1, p));
    };

    // --------------------------------
    // Animation loop
    // --------------------------------
    const tick = () => {
      // Smooth mouse movement
      cur.x += (target.x - cur.x) * 0.07;

      cur.y += (target.y - cur.y) * 0.07;

      // Smooth scroll movement
      scrollCur += (scrollTarget - scrollCur) * 0.09;

      groupsRef.current.forEach((g, i) => {
        if (!g) return;

        const column = cols[i];

        if (!column) return;

        // Horizontal mouse movement
        const tx =
          -cur.x * strength * column.depth;

        // Vertical mouse + scroll movement
        const ty =
          -cur.y *
          strength *
          column.depth *
          column.dir *
          1.6 +
          scrollCur *
          strength *
          3.5 *
          column.depth *
          column.dir;

        g.setAttribute(
          "transform",
          `translate(${tx.toFixed(3)} ${ty.toFixed(3)})`,
        );
      });

      raf = requestAnimationFrame(tick);
    };

    // Mouse listener only for non-touch devices.
    if (!coarse) {
      window.addEventListener("pointermove", onMove, {
        passive: true,
      });
    }

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    // Calculate initial scroll position.
    onScroll();

    // Start animation.
    raf = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      window.removeEventListener("pointermove", onMove);

      window.removeEventListener("scroll", onScroll);

      window.removeEventListener("resize", onScroll);

      cancelAnimationFrame(raf);
    };
  }, [parallax, strength, columns, seed, density]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={`block ${className}`}
    >
      {cols.map((c) => (
        <g
          key={c.i}
          ref={(el) => {
            groupsRef.current[c.i] = el;
          }}
        >
          {c.segs.map((s, j) => (
            <rect
              key={`${c.i}-${j}`}
              x={c.i * w}
              y={s.y}
              width={w * 0.85}
              height={s.h}
              fill={s.c}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}