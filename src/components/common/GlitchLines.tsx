"use client";

import { GLITCH_PALETTE } from "@/config/constants";
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
  parallax?: boolean; // columns drift independently with the pointer
  strength?: number; // max drift in viewBox units
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
        segs.push({ y, h, c: GLITCH_PALETTE[Math.floor(rand() * GLITCH_PALETTE.length)] });
      }
      y += h + rand() * 4;
    }
    // depth factor per column: some lines react more than others
    const depth = 0.25 + rand() * 1.25;
    const dir = rand() < 0.5 ? -1 : 1;
    return { i, segs, depth, dir };
  });
  const w = 100 / columns;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const groupsRef = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (!parallax) return;
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollCur = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      // An SVG may briefly have no layout while its parent is animating or
      // hidden. Avoid dividing by zero, which would otherwise make every
      // subsequent SVG group receive `translate(NaN NaN)`.
      if (!Number.isFinite(r.width) || !Number.isFinite(r.height) || r.width <= 0 || r.height <= 0)
        return;

      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      target = {
        x,
        y,
      };
    };

    const onScroll = () => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // -1 (banner below viewport) .. 1 (scrolled past)
      const p =
        (window.innerHeight / 2 - (r.top + r.height / 2)) / (window.innerHeight / 2 + r.height / 2);
      scrollTarget = Number.isFinite(p) ? Math.max(-1, Math.min(1, p)) : 0;
    };

    const tick = () => {
      // Keep an invalid value from a transient browser layout measurement from
      // persisting through the animation loop.
      if (!Number.isFinite(cur.x)) cur.x = 0;
      if (!Number.isFinite(cur.y)) cur.y = 0;
      if (!Number.isFinite(target.x)) target.x = 0;
      if (!Number.isFinite(target.y)) target.y = 0;
      if (!Number.isFinite(scrollCur)) scrollCur = 0;
      if (!Number.isFinite(scrollTarget)) scrollTarget = 0;

      cur.x += (target.x - cur.x) * 0.07;
      cur.y += (target.y - cur.y) * 0.07;
      scrollCur += (scrollTarget - scrollCur) * 0.09;
      groupsRef.current.forEach((g, i) => {
        if (!g) return;
        const c = cols[i];
        if (!c) return;
        const tx = -cur.x * strength * c.depth;
        const ty =
          -cur.y * strength * c.depth * c.dir * 1.6 + scrollCur * strength * 3.5 * c.depth * c.dir;
        g.setAttribute(
          "transform",
          Number.isFinite(tx) && Number.isFinite(ty)
            ? `translate(${tx.toFixed(3)} ${ty.toFixed(3)})`
            : "translate(0 0)",
        );
      });
      raf = requestAnimationFrame(tick);
    };

    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
