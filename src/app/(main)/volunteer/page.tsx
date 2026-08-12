"use client"

import { useEffect, useState } from "react";
import vol14 from "@/public/images/volunteer/vol-14.jpg";
import vol15 from "@/public/images/volunteer/vol-15.jpg";
import vol16 from "@/public/images/volunteer/vol-16.jpg";
import vol17 from "@/public/images/volunteer/vol-17.jpg";
import { GlitchBorder } from "@/src/components/common/GlitchBorder";
import Image, { type StaticImageData } from "next/image";

const VOL_FRAMES = [vol17, vol14, vol16, vol15];

function VolunteerGif({ frames, interval = 900, className = "" }: { frames: StaticImageData[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % frames.length), interval);
    return () => clearInterval(t);
  }, [frames.length, interval]);
  return (
    <GlitchBorder seed={frames.length + 9} thickness={1} hoverBoost={14} delayMs={200} className={`overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[4/3] bg-black">
        {frames.map((src, n) => (
          <Image
            key={src.src}
            src={src}
            alt=""
            aria-hidden={n !== i}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${n === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </GlitchBorder>
  );
}

export default function Volunteer() {
  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[12vw] md:text-[9vw] leading-[0.9] mt-2">Volunteer</h1>

      <div className="mt-8 md:mt-12 max-w-3xl">
        <VolunteerGif frames={VOL_FRAMES} interval={900} />
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <aside className="md:col-span-6 space-y-8 headline text-base md:text-lg text-muted-foreground max-w-prose">
          <p>
            We're back in Panjim this December with the <span className="text-foreground">11th edition of Serendipity Arts Festival</span> — our biggest celebration yet! Over eight days, the city will come alive with visual arts, dance, theatre, music, culinary experiences, films, workshops, and countless moments of discovery.
          </p>
          <p>
            The magic of Serendipity has always been powered by its people. For over a decade, our incredible volunteers have been the heart of the Festival — welcoming audiences, supporting artists, and making sure every story finds its stage.
          </p>
          <p className="text-foreground">
            No matter what your age is, your presence is a contribution — there is always a way to
            be part of Serendipity.
          </p>
          <p className="text-foreground">Now it's your turn to step behind the scenes and be part of it all!</p>
        </aside>

        <div className="md:col-span-6 space-y-8">
          <Block title="Who can apply">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You must be <span className="text-foreground">18 years or older</span> as of 1st December 2026 (non-negotiable).</li>
              <li>You must have a valid <span className="text-foreground">PAN card and bank account</span> (for stipend purposes).</li>
              <li>You should share an updated CV so we can learn more about you.</li>
              <li>You should be able to arrange your own travel and accommodation in Goa.</li>
            </ul>
          </Block>

          <Block title="What we're looking for">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Interest in the arts is always welcome, though not mandatory.</li>
              <li>Comfort with English and Hindi is important; additional languages are a bonus.</li>
              <li>Energy, reliability, and enthusiasm — festival days are long and fast-paced.</li>
            </ul>
          </Block>

          <Block title="What you'll gain">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>A certificate of participation.</li>
              <li>A daily stipend of <span className="text-foreground">INR 1,000</span> plus tea, snacks and dinner.</li>
              <li>Hands-on experience across backstage, production, F&amp;B, art guiding, social media, and more.</li>
              <li>A place in a vibrant creative community.</li>
            </ul>
          </Block>

          <Block title="Application timeline">
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="text-foreground">Deadline:</span> 15 October 2026.</li>
              <li><span className="text-foreground">Interviews:</span> Shortlisted candidates contacted by 15 October (phone or in-person).</li>
              <li><span className="text-foreground">Final Confirmation:</span> Selected volunteers must share confirmed travel and accommodation details by 30 October.</li>
            </ul>
          </Block>

          <a
            href="mailto:volunteers@serendipityartsfestival.com?subject=Volunteer%20Application%20-%20SAF%202026"
            className="inline-block headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-10 py-5 hover:bg-accent transition-colors"
          >
            Apply now →
          </a>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rule-t pt-4">
      <p className="headline font-semibold uppercase text-lg md:text-xl leading-tight tracking-[-0.01em] text-foreground">{title}</p>
      <div className="mt-3 headline text-muted-foreground">{children}</div>
    </div>
  );
}
