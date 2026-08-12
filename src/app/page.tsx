"use client";

import { useState } from "react";
import Link from "next/link";
import dashMotif from "@/public/images/home/dash-motif.png";
import prog1 from "@/public/images/prog-1.jpg";
import prog2 from "@/public/images/prog-2.jpg";
import prog3 from "@/public/images/prog-3.jpg";
import venue1 from "@/public/images/venue-1.jpg";
import venue2 from "@/public/images/venue-2.jpg";
import whiteLogo from "@/public/images/home/saf-logo-white-2026.png";
import artParkImg from "@/public/images/home/art-park-v2.jpg";
import sambaImg from "@/public/images/home/samba-square-2026.jpg";
import gmcImg from "@/public/images/home/old-gmc-v2.jpg";
import promenadeImg from "@/public/images/home/promenade-v2.jpg";
import { useCart } from "@/src/lib/cart";
// import { GlitchBorder } from "@/components/site/GlitchBorder";
// import { GlitchLines } from "@/components/site/GlitchLines";
// import { RecommendModal } from "@/components/site/RecommendModal";
// import { TESTIMONIALS } from "@/lib/testimonials";
// import { PARTNERS } from "@/lib/partners";
import { CURATORS } from "../data/curators";
import { GlitchBorder } from "../components/common/GlitchBorder";
import { GlitchLines } from "../components/common/GlitchLines";
import { RecommendModal } from "../components/common/RecommendModal";
import { TESTIMONIALS } from "../lib/testimonials";
import { PARTNERS } from "../lib/partners";
import Image from "next/image";
import { useSponsors } from "../hooks/useSponsors";
import Loader from "../components/common/Loader";

const PROGRAMMES = [
  { img: prog1, title: "Bodies in Translation", date: "14 Dec", venue: "Kala Academy", category: "Performance" },
  { img: prog2, title: "The Weight of Silence", date: "13–20 Dec", venue: "Adil Shah Palace", category: "Exhibition" },
  { img: prog3, title: "Hands That Remember", date: "16 Dec", venue: "PWD Complex", category: "Workshop" },
  { img: venue1, title: "A River, Rehearsed", date: "17 Dec", venue: "Mandovi Promenade", category: "Performance" },
  { img: prog2, title: "Ground Plans", date: "13–20 Dec", venue: "PWD Complex", category: "Exhibition" },
  { img: venue2, title: "Salt & Signal", date: "15 Dec", venue: "Old GMC Building", category: "Film Screening" },
  { img: prog3, title: "Kitchen as Studio", date: "16 Dec", venue: "Casa dos Anjos", category: "Workshop" },
  { img: prog1, title: "River Songs", date: "19 Dec", venue: "Mandovi Promenade", category: "Performance" },
];

export default function Home() {
  const featuredCurators = [...CURATORS].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 4);
  const { isLoggedIn } = useCart();
  const [recOpen, setRecOpen] = useState(false);
  const [ti, setTi] = useState(0);
  const t = TESTIMONIALS[ti];


  const {
    sponsors,
    loading,
    error,
  } = useSponsors(8);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[72vh] min-h-[480px] w-full overflow-hidden bg-black text-white">
        <video
          src="/saf-aftermovie.mp4"
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <GlitchLines
          seed={23}
          columns={28}
          density={0.22}
          className="absolute inset-0 h-full w-full opacity-85 pointer-events-none md:hidden"
        />
        <GlitchLines
          seed={23}
          columns={70}
          density={0.22}
          className="absolute inset-0 h-full w-full opacity-85 pointer-events-none hidden md:block"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />

        <div className="absolute inset-0 container-editorial flex flex-col justify-between py-6 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <Image
              src={whiteLogo}
              alt="Serendipity Arts Festival 2026"
              className="w-[42vw] max-w-[240px] md:w-[26vw] md:max-w-[400px] h-auto brightness-0 invert -mt-4 md:-mt-6"
            />
            {!isLoggedIn && (
              <Link
                href="/register"
                className="label bg-white text-black rounded-full px-3.5 py-1.5 md:px-5 md:py-2 hover:bg-white/90 transition-colors shrink-0 whitespace-nowrap"
              >
                Register
              </Link>
            )}
          </div>

          <div />

          {/* Place + dates, bottom right — mirrors the key visual */}
          <div className="flex justify-end">
            <p className="display uppercase text-white text-right text-[6vw] md:text-[3.1vw] md:max-w-[46vw] leading-[1.05] tracking-[-0.02em] whitespace-nowrap">
              Panjim, Goa
              <br />
              13–20 December
            </p>
          </div>
        </div>
      </section>

      {/* HERO COPY */}
      <section className="container-editorial mt-12 md:mt-20">
        <p className="display uppercase text-[8.5vw] md:text-[5vw] leading-[0.95] tracking-[-0.02em] max-w-[16ch] md:max-w-[20ch]">
          8 days of exhibitions, performances, workshops and more never seen before.
        </p>
      </section>

      {/* PROGRAMMES */}
      <section className="container-editorial mt-20 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-6 mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Programmes
          </h2>
          <div className="md:col-span-5 border border-foreground p-5 md:p-6">
            <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em]">
              Let us help you — recommend programmes
            </p>
            <button
              onClick={() => setRecOpen(true)}
              className="mt-4 label notch border border-foreground px-4 py-2.5 hover:bg-foreground hover:text-background transition-colors"
            >
              Start →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14">
          {[...PROGRAMMES].sort((a, b) => a.title.localeCompare(b.title)).map((p, i) => (
            <Link key={i} href="/programmes" className="group block">
              <GlitchBorder seed={i + 5} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                <Image src={p.img} alt={p.title} loading="lazy"
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </GlitchBorder>
              <div className="mt-3">
                <p className="label text-muted-foreground">{p.category}</p>
                <h3 className="mt-1.5 headline font-semibold text-sm md:text-lg leading-tight tracking-[-0.01em] group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="mt-1 text-[11px] md:text-xs text-muted-foreground headline">{p.date} · {p.venue}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/programmes" className="label hover:text-accent transition-colors">
            All programmes &nbsp;→
          </Link>
        </div>
      </section>

      {/* CURATORS */}
      <section className="container-editorial mt-20 md:mt-32">
        <h2 className="display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-10 md:mb-14">
          Curators
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {featuredCurators.map((c, i) => (
            <Link key={c.name} href="/curators" className="group block">
              <GlitchBorder seed={i * 7 + 11} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                <Image src={c.img} alt={c.name} loading="lazy"
                  className="w-full aspect-[4/5] object-cover " />
              </GlitchBorder>
              <p className="headline font-semibold text-sm md:text-lg leading-tight mt-3 group-hover:text-accent transition-colors">{c.name}</p>
              <p className="text-[11px] md:text-xs text-muted-foreground headline">{c.discipline}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/curators" className="label hover:text-accent transition-colors">
            All curators &nbsp;→
          </Link>
        </div>
      </section>

      {/* VENUES — pulls the same imagery as /venues */}
      <section className="container-editorial mt-20 md:mt-32">
        <h2 className="display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-10 md:mb-14">
          Venues
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {[
            { img: gmcImg, name: "The Old GMC Complex" },
            { img: artParkImg, name: "Art Park" },
            { img: promenadeImg, name: "Promenade" },
            { img: sambaImg, name: "Samba Square" },
          ].sort((a, b) => a.name.localeCompare(b.name)).map((v) => (
            <Link key={v.name} href="/venues" className="group block">
              <GlitchBorder seed={v.name.length + 17} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                <Image src={v.img} alt={v.name} loading="lazy"
                  className="w-full aspect-[4/5] object-cover " />
              </GlitchBorder>
              <p className="headline font-semibold text-sm md:text-lg mt-3 group-hover:text-accent transition-colors">{v.name}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/venues" className="label hover:text-accent transition-colors">
            All venues &nbsp;→
          </Link>
        </div>
      </section>

      {/* SERENDIPITY DASH — the festival game */}
      <section className="container-editorial mt-20 md:mt-32">
        <a
          href="#"
          className="group grid grid-cols-[1fr_auto] items-center gap-4 md:gap-8 border border-foreground bg-background text-foreground p-4 md:p-7 max-w-xl md:max-w-3xl"
        >
          <div>
            <h2 className="display uppercase text-2xl sm:text-3xl md:text-5xl leading-[0.9]">
              Serendipity Dash
            </h2>
            <p className="headline text-xs md:text-sm mt-2 md:mt-3 max-w-md opacity-80">
              Run the festival streets, dodge the festival vans and collect points. Our little game, playable in your browser.
            </p>
            <span className="mt-4 md:mt-5 inline-block headline text-[10px] md:text-xs uppercase tracking-[0.08em] border border-foreground bg-background text-foreground px-4 py-2 group-hover:bg-foreground group-hover:text-background transition-colors">
              Play the game &nbsp;→
            </span>
          </div>
          <Image
            src={dashMotif}
            alt="Serendipity Dash character"
            loading="lazy"
            className="w-20 md:w-36 self-end justify-self-end object-contain border border-foreground"
          />
        </a>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-editorial mt-20 md:mt-32">
        <h2 className="display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 md:mb-12">
          Testimonials
        </h2>
        <div className="border border-foreground p-5 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            <div className="md:col-span-3">
              {t.img ? (
                <Image src={t.img} alt={t.name} loading="lazy" className="w-32 md:w-full md:max-w-[220px] aspect-square object-cover border border-foreground" />
              ) : (
                <div className="w-32 md:w-full md:max-w-[220px] aspect-square grid place-items-center border border-foreground display text-3xl">{t.initials}</div>
              )}
              <p className="mt-3 headline font-semibold text-lg md:text-xl leading-tight">{t.name}</p>
              <p className="headline text-xs md:text-sm text-muted-foreground">{t.role}</p>
            </div>
            <blockquote className="md:col-span-9 headline text-base md:text-2xl leading-[1.35]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
          </div>
          <div className="mt-8 flex items-center gap-4 flex-wrap">
            <button
              aria-label="Previous testimonial"
              onClick={() => setTi((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              ←
            </button>
            <button
              aria-label="Next testimonial"
              onClick={() => setTi((i) => (i + 1) % TESTIMONIALS.length)}
              className="label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              →
            </button>
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((x, i) => (
                <button
                  key={x.name}
                  aria-label={`Show testimonial from ${x.name}`}
                  onClick={() => setTi(i)}
                  className={`h-2.5 w-2.5 rounded-full border border-foreground ${i === ti ? "bg-foreground" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Serendipity Arts Festival 2026",
              review: TESTIMONIALS.map((x) => ({
                "@type": "Review",
                author: { "@type": "Person", name: x.name },
                reviewBody: x.quote,
              })),
            }),
          }}
        />
      </section>

      {/* PRESS COVERAGE — above About Us */}
      <section className="container-editorial mt-20 md:mt-32">
        <h2 className="display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 md:mb-12">
          Press
        </h2>
        <ul className="rule-t">
          {[
            { pub: "Firstpost", title: "Serendipity Arts Festival announces dates for its 11th edition and a curator-led vision for 2026", url: "https://www.firstpost.com/entertainment/serendipity-arts-festival-announces-dates-for-its-11th-edition-and-a-curator-led-vision-for-2026-14009352.html" },
            { pub: "t2 Online", title: "Serendipity Arts Festival gears up for its 11th edition — announces curators", url: "https://t2online.in/events/events-1/serendipity-arts-festival-gears-up-for-its-11th-edition--announces-curators/2005066" },
            { pub: "TNA Mag", title: "Serendipity Arts Festival 2026 — meet the curators", url: "https://tnamag.xyz/art-news/serendipity-arts-festival-2026-curators/" },
            { pub: "The Tribune", title: "Serendipity Arts Festival to return for 11th edition", url: "https://www.tribuneindia.com/news/arts/serendipity-arts-festival-to-return-for-11th-edition/" },
            { pub: "The Navhind Times", title: "Serendipity Arts Festival announces curators for 11th edition", url: "https://navhindtimes.in/zest/serendipity-arts-festival-announces-curators-for-11th-edition/" },
            { pub: "Hindustan Times", title: "11th Serendipity Arts Festival to take place from December 13–20", url: "https://www.hindustantimes.com/lifestyle/art-culture/11th-serendipity-arts-festival-to-take-place-from-december-1320-101778580075113.html" },
          ].map((a) => (
            <li key={a.url} className="rule-b">
              <a href={a.url} target="_blank" rel="noreferrer"
                className="group py-5 md:py-7 grid grid-cols-12 gap-3 md:gap-6 items-baseline hover:text-accent transition-colors">
                <p className="col-span-12 md:col-span-3 label text-muted-foreground group-hover:text-accent">{a.pub}</p>
                <p className="col-span-11 md:col-span-8 headline font-semibold text-lg md:text-2xl leading-tight tracking-[-0.01em]">{a.title}</p>
                <p className="col-span-1 label text-right">↗</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* SUPPORTED BY */}
      <section className="container-editorial mt-20 md:mt-32">
        <h2 className="display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 md:mb-12">
          Supported by
        </h2>
        {/* Mobile: horizontal swipe. Desktop: compact grid. */}
        {loading ? (
          <Loader />
        ) : (

          <div className="-mx-5 px-5 md:mx-0 md:px-0 flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
            {sponsors.map((p) => (
              <div key={p.name} className="shrink-0 w-[46vw] snap-start md:w-auto border border-foreground px-2 py-2 flex flex-col">
                <div className="grid place-items-center flex-1 h-[86px] md:h-[104px]">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={200}
                    height={100}
                    loading="lazy"
                    className="max-h-[82px] md:max-h-[100px] max-w-full w-auto object-contain"
                  />
                </div>
                <p className="mt-1.5 headline text-[10px] leading-tight text-muted-foreground">{p.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Link href="/partners" className="label hover:text-accent transition-colors">All partners &nbsp;&rarr;</Link>
        </div>
      </section>

      <div className="pb-24" />

      <RecommendModal open={recOpen} onClose={() => setRecOpen(false)} />
    </div>
  );
}