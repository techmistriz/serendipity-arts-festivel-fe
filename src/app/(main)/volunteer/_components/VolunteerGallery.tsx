"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { GlitchBorder } from "@/components/common/GlitchBorder";
import vol14 from "@public/images/volunteer/vol-14.jpg";
import vol15 from "@public/images/volunteer/vol-15.jpg";
import vol16 from "@public/images/volunteer/vol-16.jpg";
import vol17 from "@public/images/volunteer/vol-17.jpg";

const frames = [vol17, vol14, vol16, vol15];

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
