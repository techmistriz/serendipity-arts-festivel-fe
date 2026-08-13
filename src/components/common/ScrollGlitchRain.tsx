// Scroll-driven "glitch rain": short coloured bars fall in the empty page
// gutters (left/right of the max-width content column) while the user scrolls.
// They move with the scroll direction and vanish instantly on scroll stop.
// Never overlaps text, boxes, logos or borders — gutters only.
import { useEffect, useRef, useState } from "react";
import { PALETTE } from "@/src/lib/glitch-palette";

const MAX_CONTENT = 1600;
const GUTTER_MIN = 34; // need real negative space before we draw anything

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Drop = { x: number; y: number; h: number; w: number; c: string; k: number };

function makeDrops(seed: number, count: number): Drop[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: rand() * 100,
    y: rand() * 100,
    h: 12 + rand() * 70,
    w: 2 + Math.floor(rand() * 3),
    c: PALETTE[Math.floor(rand() * PALETTE.length)],
    k: 0.45 + rand() * 1.4,
  }));
}

export function ScrollGlitchRain() {
  const [gutter, setGutter] = useState(0);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const lastY = useRef(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      // page padding of .container-editorial + any overflow beyond max width
      const pad = vw >= 1280 ? 64 : vw >= 768 ? 40 : 20;
      setGutter(Math.max(0, (vw - MAX_CONTENT) / 2) + pad);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (gutter < GUTTER_MIN) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lastY.current = window.scrollY;

    const setVisible = (v: boolean) => {
      for (const el of [leftRef.current, rightRef.current]) {
        if (el) el.style.opacity = v ? "1" : "0";
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      offset.current += dy * 1.6;
      const t = `translate3d(0, ${offset.current % 400}px, 0)`;
      if (leftRef.current) leftRef.current.style.transform = t;
      if (rightRef.current)
        rightRef.current.style.transform = `translate3d(0, ${(-offset.current) % 400}px, 0)`;
      setVisible(true);
      if (stopTimer.current) clearTimeout(stopTimer.current);
      // instant disappear (no fade) shortly after scrolling stops
      stopTimer.current = setTimeout(() => setVisible(false), 90);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, [gutter]);

  if (gutter < GUTTER_MIN) return null;

  const inset = 6;
  const w = Math.max(10, Math.min(gutter - inset * 2, 120));
  const left = makeDrops(11, 26);
  const right = makeDrops(29, 26);

  const column = (drops: Drop[]) => (
    <div className="relative h-[300%] w-full">
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.w,
            height: d.h,
            background: d.c,
          }}
        />
      ))}
      {drops.map((d, i) => (
        <span
          key={`b-${i}`}
          className="absolute"
          style={{
            left: `${d.x}%`,
            top: `${d.y + 33.3}%`,
            width: d.w,
            height: d.h,
            background: d.c,
          }}
        />
      ))}
    </div>
  );

  const shell =
    "fixed top-0 h-screen overflow-hidden pointer-events-none z-[5] opacity-0";

  return (
    <div aria-hidden>
      <div className={shell} style={{ left: inset, width: w }}>
        <div ref={leftRef} className="h-full will-change-transform">
          {column(left)}
        </div>
      </div>
      <div className={shell} style={{ right: inset, width: w }}>
        <div ref={rightRef} className="h-full will-change-transform">
          {column(right)}
        </div>
      </div>
    </div>
  );
}
