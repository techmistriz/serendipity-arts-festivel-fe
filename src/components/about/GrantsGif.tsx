"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import g1 from "@/public/images/about/brij-cnap.jpg";
import g2 from "@/public/images/about/eyes-shall-deceive.jpg";
import g3 from "@/public/images/about/food-matters.jpg";
import g4 from "@/public/images/about/futures-in-formation.jpg";
import g5 from "@/public/images/about/london-puppet.jpg";
import g6 from "@/public/images/about/music-grant.jpg";
import g7 from "@/public/images/about/residency-2026.jpg";
import g8 from "@/public/images/about/theatre-grant.jpg";
import g9 from "@/public/images/about/wac-writing.jpg";

const GRANTS = [g1, g2, g3, g4, g5, g6, g7, g8, g9];



export default function GrantsGif() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % GRANTS.length);
    }, 900);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black bg-black">
      {GRANTS.map((image, i) => (
        <Image
          key={i}
          src={image}
          alt=""
          fill
          className={`absolute object-contain transition-opacity duration-200 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}