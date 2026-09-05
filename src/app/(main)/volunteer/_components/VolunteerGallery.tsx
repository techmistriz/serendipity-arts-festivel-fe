"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { GlitchBorder } from "@/components/common/GlitchBorder";
import { images } from "@/config/images";

const frames = [images.volunteer[3], images.volunteer[0], images.volunteer[2], images.volunteer[1]];

export function VolunteerGallery() {
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFrame((currentFrame) => (currentFrame + 1) % frames.length);
    }, 900);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <GlitchBorder
      seed={frames.length + 9}
      thickness={1}
      hoverBoost={14}
      delayMs={200}
      className="overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full bg-black">
        {frames.map((image, index) => (
          <Image
            key={image.src}
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            aria-hidden={index !== activeFrame}
            className={`object-cover transition-opacity duration-300 ${
              index === activeFrame ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </GlitchBorder>
  );
}
