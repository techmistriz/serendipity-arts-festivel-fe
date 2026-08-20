"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GRANT_IMAGES } from "@/config/images";

const ROTATION_INTERVAL = 900;

function useReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function GrantsGif() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: "160px",
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % GRANT_IMAGES.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, [isVisible, prefersReducedMotion]);

  const activeImage = GRANT_IMAGES[activeIndex];

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black bg-black"
    >
      <Image
        key={activeImage.src}
        src={activeImage}
        alt=""
        fill
        sizes="(min-width: 768px) 42vw, 100vw"
        className="object-contain motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200"
      />
    </div>
  );
}
