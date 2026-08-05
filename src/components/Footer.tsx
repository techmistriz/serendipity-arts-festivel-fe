"use client";

import Link from "next/link";
import Image from "next/image";
import GlitchBar from "./common/GlitchBar";
import FESTIVAL_LOGO from "@/public/images/footer/Serendipity_Arts_Festival_Logos-01_1.webp"
import FOUNDATION_LOGO from "@/public/images/footer/Serendipity_Arts_Logo-2.png"


// const FOUNDATION_LOGO = "/logos/foundation-logo.png";
// const FESTIVAL_LOGO = "/logos/festival-logo.png";

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t">
      {/* Glitch Bars */}
      <GlitchBar
        seed={41}
        direction="h"
        speed={5}
        count={140}
        className="h-4 w-full"
      />

      <GlitchBar
        seed={73}
        direction="v"
        variant="bulge"
        speed={1.4}
        count={120}
        className="absolute right-0 top-4 bottom-0 hidden w-2 md:block"
      />

      <GlitchBar
        seed={58}
        direction="v"
        variant="vibrate"
        speed={0.32}
        count={120}
        className="absolute left-0 top-4 bottom-0 hidden w-2 md:block"
      />

      <div className="container-editorial py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left */}
          <div className="md:col-span-5">
            <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-8">
              <Image
                src={FOUNDATION_LOGO}
                alt="Serendipity Arts Foundation"
                width={220}
                height={60}
                className="h-9 md:h-12 w-auto object-contain"
              />

              <Image
                src={FESTIVAL_LOGO}
                alt="Serendipity Arts Festival"
                width={220}
                height={90}
                className="h-14 w-auto object-contain md:h-20"
              />
            </div>

            <p className="display mb-6 text-2xl uppercase leading-[1.05] md:text-3xl">
              Subscribe to The Serendipity Dispatch, our monthly newsletter.
            </p>

            <form className="flex max-w-md items-center gap-3 border-b border-foreground pb-2">
              <input
                type="email"
                placeholder="your@email"
                aria-label="Email address"
                className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground"
              />

              <button
                type="submit"
                className="label transition-colors hover:text-accent"
              >
                Subscribe →
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-8">
            <p className="label mb-4 text-muted-foreground">Navigate</p>

            <ul className="headline space-y-2 text-sm">
              <li><Link href="/programmes">Programmes</Link></li>
              <li><Link href="/curators">Curators</Link></li>
              <li><Link href="/venues">Venues</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/partners">Partners</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <p className="label mb-4 text-muted-foreground">Follow</p>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/serendipityartsfestival/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>

              <li>
                <a
                  href="https://www.youtube.com/@SerendipityArtsFestival"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>

              <li>
                <a
                  href="https://x.com/serendipityartf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X / Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <p className="label mb-4 text-muted-foreground">Legal</p>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>

              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t pt-6">
          <p className="label text-muted-foreground">
            © Serendipity Arts Festival. All rights reserved.
          </p>

      
        </div>
      </div>
    </footer>
  );
}