"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dashMotif from "@/public/images/home/dash-motif.png";
import prog1 from "@/public/images/prog-1.jpg";
import prog2 from "@/public/images/prog-2.jpg";
import prog3 from "@/public/images/prog-3.jpg";
import venue1 from "@/public/images/venue-1.jpg";
import venue2 from "@/public/images/venue-2.jpg";
import whiteLogo from "@/public/images/home/saf-logo-white-2026.png";
import { useAppSelector } from "@/src/store/hooks";

import { GlitchBorder } from "../components/common/GlitchBorder";
import { GlitchLines } from "../components/common/GlitchLines";
import { RecommendModal } from "../components/common/RecommendModal";
import { TESTIMONIALS } from "../lib/testimonials";
import Image from "next/image";
import { useSponsors } from "../hooks/useSponsors";
import Loader from "../components/common/Loader";
import { ScrollGlitchRain } from "../components/common/ScrollGlitchRain";
import collageHero from "@/public/collage-hero-hd.jpg"
import recommendBg from "@/public/recommend-bg-v2.png"
import curatorsBox from "@/public/curators-box.jpg"
import venuesBox from "@/public/venues-box.png"
import testimonialsBox from "@/public/testimonials-box.png"
import pressBox from "@/public/press-box.png"
import { ApiCurator, getCurators } from "../services/curators";
import { ApiVenue, getVenues } from "../services/venues";


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


// Shared torn-paper outline so the hero and the section boxes read as one family.
const TORN_CLIP =
  "polygon(1.5% 3%, 22% 0.6%, 47% 2.4%, 71% 0%, 92% 2.8%, 100% 12%, 98.4% 38%, 100% 63%, 97.6% 88%, 88% 100%, 63% 97.4%, 39% 100%, 15% 97.8%, 2.4% 92%, 0% 66%, 1.8% 41%, 0.4% 18%)";
const tornStyle = { clipPath: TORN_CLIP, WebkitClipPath: TORN_CLIP } as const;


export default function Home() {
  const [curators, setCurators] = useState<ApiCurator[]>([]);
  const [curatorsLoading, setCuratorsLoading] = useState(true);
  const [curatorsError, setCuratorsError] = useState<string | null>(null);

  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  const [gameGate, setGameGate] = useState(false);

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  useEffect(() => {
    let mounted = true;

    const fetchCurators = async () => {
      try {
        setCuratorsLoading(true);
        setCuratorsError(null);

        const data = await getCurators();

        if (mounted) {
          const featured = data
            .filter((curator) => curator.curator_image)
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 4);

          setCurators(featured);
        }
      } catch (error) {
        console.error("Failed to fetch curators:", error);

        if (mounted) {
          setCuratorsError("Unable to load curators.");
        }
      } finally {
        if (mounted) {
          setCuratorsLoading(false);
        }
      }
    };

    fetchCurators();

    return () => {
      mounted = false;
    };
  }, []);


  useEffect(() => {
    let mounted = true;

    const fetchVenues = async () => {
      try {
        setVenuesLoading(true);
        setVenuesError(null);

        const data = await getVenues();

        if (mounted) {
          const featured = data
            .filter(
              (venue) =>
                venue.featured_image &&
                venue.is_hide_on_frontend !== 1
            )
            .sort((a, b) => a.title.localeCompare(b.title))
            .slice(0, 4);

          setVenues(featured);
        }
      } catch (error) {
        console.error("Failed to fetch venues:", error);

        if (mounted) {
          setVenuesError("Unable to load venues.");
        }
      } finally {
        if (mounted) {
          setVenuesLoading(false);
        }
      }
    };

    fetchVenues();

    return () => {
      mounted = false;
    };
  }, []);


  const [recOpen, setRecOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [pressOpen, setPressOpen] = useState(false);
  const [ti, setTi] = useState(0);
  const t = TESTIMONIALS[ti];


  const {
    sponsors,
    loading,
    error,
  } = useSponsors(8);

  return (
    <div>
      <ScrollGlitchRain />
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
          parallax
          strength={4}
          className="absolute -inset-[6%] h-[112%] w-[112%] opacity-85 pointer-events-none md:hidden"
        />

        <GlitchLines
          seed={23}
          columns={70}
          density={0.22}
          parallax
          strength={3.5}
          className="absolute -inset-[6%] h-[112%] w-[112%] opacity-85 pointer-events-none hidden md:block"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />

        <div className="absolute inset-0 container-editorial flex flex-col justify-between py-6 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <Image
              src={whiteLogo}
              alt="Serendipity Arts Festival 2026"
              className="w-[42vw] max-w-[240px] md:w-[26vw] md:max-w-[400px] h-auto brightness-0 invert -mt-4 md:-mt-6"
            />
            {!isAuthenticated && (
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
      <section className="container-editorial mt-20 md:mt-32">
        <div className="md:hidden relative w-full min-h-[320px] overflow-hidden" style={tornStyle}>
          <Image
            src={collageHero}
            alt="Serendipity Arts Festival collage"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden />
          <div className="relative flex min-h-[320px] items-center justify-center px-6 py-14 text-center">
            <p className="display uppercase text-white text-[8vw] leading-[0.95] tracking-[-0.02em] max-w-[18ch]">
              8 days of exhibitions, performances, workshops and more never seen before.
            </p>
          </div>
        </div>
        <div
          className="hidden md:block relative w-full min-h-[420px] lg:min-h-[520px] overflow-hidden"
          style={tornStyle}
        >
          <Image
            src={collageHero}
            alt="Serendipity Arts Festival collage"
            className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top-left"
          />

          <div className="absolute inset-0 bg-black/40" aria-hidden />
          <div className="relative flex min-h-[420px] lg:min-h-[520px] items-center justify-center px-10 py-20 text-center">
            <p className="display uppercase text-white text-[4vw] leading-[0.95] tracking-[-0.02em] max-w-[18ch]">
              8 days of exhibitions, performances, workshops and more never seen before.
            </p>
          </div>
        </div>

      </section>

      {/* PROGRAMMES */}
      {/* <section className="container-editorial mt-20 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Programmes
          </h2>
          <div
            className="md:col-span-5 relative px-7 py-8 md:px-9 md:py-10 overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${recommendBg.src})`,
              ...tornStyle,
            }}
          >
            <div className="absolute inset-0 bg-foreground/55" aria-hidden />
            <div className="relative">
              <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
                Let us help you — recommend programmes
              </p>
              <button
                // onClick={() => setRecOpen(true)}
                className="mt-4 label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors cursor-pointer"
              >
                Coming soon →
              </button>
            </div>
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
      </section> */}

      {/* CURATORS */}
      <section className="container-editorial mt-20 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Curators
          </h2>
          <a
            href="https://serendipityarts.org/curator-overview/"
            target="_blank"
            rel="noreferrer"
            className="md:col-span-5 block relative px-7 py-8 md:px-9 md:py-10 overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${curatorsBox.src})`,
              ...tornStyle,
            }}
          >
            <div className="absolute inset-0 bg-foreground/55" aria-hidden />
            <div className="relative">
              <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
                Meet the festival curators over the years
              </p>
              <span className="mt-4 inline-block label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors">
                Curator overview →
              </span>
            </div>
          </a>
        </div>

        {curatorsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[4/5] bg-muted" />
                <div className="mt-3 h-5 bg-muted w-3/4" />
                <div className="mt-2 h-3 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        ) : curatorsError ? (
          <p className="headline text-sm text-muted-foreground">
            {curatorsError}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {curators.map((curator, i) => (
              <Link
                key={curator.id}
                href={`/curators/${curator.slug}`}
                className="group block"
              >
                <GlitchBorder
                  seed={i * 7 + 11}
                  thickness={1}
                  hoverBoost={14}
                  delayMs={200}
                  className="overflow-hidden"
                >
                  {curator.curator_image ? (
                    <Image
                      src={curator.curator_image}
                      alt={curator.name}
                      width={800}
                      height={1000}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-700 "
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-muted grid place-items-center">
                      <span className="display text-4xl">
                        {curator.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </GlitchBorder>

                <p className="headline font-semibold text-sm md:text-lg leading-tight mt-3 group-hover:text-accent transition-colors">
                  {curator.name}
                </p>

                <p
                  className="text-[11px] md:text-xs headline text-[#504c4d]"
                // style={{
                //   color: curator.discipline?.font_color || undefined,
                // }}
                >
                  {curator.discipline?.name || "Curator"}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <Link href="/curators" className="label hover:text-accent transition-colors">
            All curators &nbsp;→
          </Link>
        </div>
      </section>

      {/* VENUES — pulls the same imagery as /venues */}
      <section className="container-editorial mt-20 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Venues
          </h2>

          {/* SERENDIPITY DASH — the festival game */}
          <button
            type="button"
            onClick={() => setGameGate(true)}
            className="md:col-span-5 block relative px-7 py-8 md:px-9 md:py-10 overflow-hidden bg-cover cursor-pointer"
            style={{
              backgroundImage: `url(${venuesBox.src})`,
              backgroundPosition: "22% 78%",
              backgroundSize: "150%",
              ...tornStyle,
            }}
          >
            <div className="absolute inset-0 bg-foreground/55" aria-hidden />
            <div className="relative">
              <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
                Serendipity Dash
              </p>
              <p className="headline text-xs md:text-sm mt-2 max-w-lg text-white/85">
                Run the festival streets that cross our festival venues over the years, dodge the vans and collect points. Our little game, playable in your browser.
              </p>
              <span className="mt-4 inline-block label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors cursor-pointer">
                Play the game →
              </span>
            </div>
          </button>

          {gameGate && (
            <div
              className="fixed inset-0 z-[120] bg-foreground/70 flex items-center justify-center p-5"
              role="dialog"
              aria-modal="true"
            >
              <div className="relative w-full max-w-md bg-background border-[3px] border-foreground p-7 md:p-9">

                <button
                  type="button"
                  onClick={() => setGameGate(false)}
                  aria-label="Close"
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-foreground text-background notch text-lg leading-none"
                >
                  ✕
                </button>

                <p className="notch uppercase text-2xl leading-[1]">
                  Play Serendipity Dash
                </p>

                <p className="headline text-sm mt-3 text-muted-foreground">
                  {isAuthenticated
                    ? "You are all set. Start the game."
                    : "You need to log in or register before playing."}
                </p>

                <div className="mt-6 flex gap-3">

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        setGameGate(false);
                        window.open("/serendipity-dash", "_blank");
                      }}
                      className="label notch bg-foreground text-background px-5 py-3"
                    >
                      Start playing →
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        onClick={() => setGameGate(false)}
                        className="label notch bg-foreground text-background px-5 py-3"
                      >
                        Register
                      </Link>

                      <Link
                        href="/login"
                        onClick={() => setGameGate(false)}
                        className="label notch border-[3px] border-foreground px-5 py-3"
                      >
                        Log in
                      </Link>
                    </>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>

        {venuesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[4/5] bg-muted" />
                <div className="mt-3 h-5 bg-muted w-3/4" />
              </div>
            ))}
          </div>
        ) : venuesError ? (
          <p className="headline text-sm text-muted-foreground">
            {venuesError}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {venues.map((venue, i) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                className="group block"
              >
                <GlitchBorder
                  seed={i + 17}
                  thickness={1}
                  hoverBoost={14}
                  delayMs={200}
                  className="overflow-hidden"
                >
                  {venue.featured_image ? (
                    <Image
                      src={venue.featured_image}
                      alt={venue.title}
                      width={800}
                      height={1000}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-700 "
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-muted grid place-items-center">
                      <span className="display text-4xl">
                        {venue.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </GlitchBorder>

                <p className="headline font-semibold text-sm md:text-lg mt-3 group-hover:text-accent transition-colors">
                  {venue.title}
                </p>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-end">
          <Link href="/venues" className="label hover:text-accent transition-colors">
            All venues &nbsp;→
          </Link>
        </div>
      </section>

      {/* SERENDIPITY DASH — the festival game */}
      {/* <section className="container-editorial mt-20 md:mt-32">
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
      </section> */}

      {/* TESTIMONIALS */}
      <section className="container-editorial mt-20 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Testimonials
          </h2>
          <div
            className="md:col-span-5 relative px-7 py-8 md:px-9 md:py-10 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${testimonialsBox.src})`, ...tornStyle }}
          >
            <div className="absolute inset-0 bg-foreground/55" aria-hidden />
            <div className="relative">
              <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
                The first hand experience
              </p>
              <p className="headline text-xs md:text-sm mt-2 max-w-lg text-white/85">
                An actual account from festival goers, in their own words.
              </p>
              <button
                onClick={() => setFilmOpen((v) => !v)}
                className="mt-4 label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors"
              >
                {filmOpen ? "Hide the film" : "Watch the film →"}
              </button>
            </div>
          </div>
        </div>

        {filmOpen && (
          <div className="mb-10 md:mb-14 border border-foreground">
            <div className="relative w-full aspect-video">
              <iframe
                src="https://www.youtube.com/embed/xkVJHeiZL64?autoplay=1"
                title="Serendipity Arts Festival: a first hand experience"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}


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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Press
          </h2>
          <div
            className="md:col-span-5 relative px-7 py-8 md:px-9 md:py-10 overflow-hidden bg-cover"
            style={{ backgroundImage: `url(${pressBox.src})`, backgroundPosition: "30% 85%", backgroundSize: "170%", ...tornStyle }}
          >
            <div className="absolute inset-0 bg-foreground/55" aria-hidden />
            <div className="relative">
              <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
                Watch the coverages
              </p>
              <p className="headline text-xs md:text-sm mt-2 max-w-lg text-white/85">
                Broadcast stories on the festival, gathered in one place.
              </p>
              <button
                onClick={() => setPressOpen((v) => !v)}
                className="mt-4 label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors"
              >
                {pressOpen ? "Hide coverages" : "Watch coverages →"}
              </button>
            </div>
          </div>
        </div>

        {pressOpen && (
          <div className="mb-10 md:mb-14 border border-foreground divide-y divide-foreground">
            {[
              { pub: "Times Now", id: "8XsdMdyEoDs", date: "20 Dec 2025" },
              { pub: "NDTV", id: "OrwGAGUZddg", date: "19 Dec 2025" },
              { pub: "The Hindu", id: "Eiy18AN4Ib8", short: true, date: "18 Dec 2025" },
              { pub: "Frontline Magazine", id: "sNTw2zI--G0", date: "17 Dec 2025" },
              { pub: "Prudent Media Goa", id: "foKlZHsDtb0", date: "16 Dec 2025" },
            ].map((v) => (
              <details key={v.id} className="group">
                <summary className="cursor-pointer list-none px-5 py-4 md:px-7 md:py-5 flex items-center justify-between gap-4 hover:text-accent transition-colors">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="headline font-semibold text-base md:text-xl leading-tight">{v.pub}</span>
                    <span className="label text-muted-foreground">{v.date}</span>
                  </span>
                  <span className="label shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 md:px-7 md:pb-7">
                  <div className={`relative w-full ${v.short ? "max-w-[360px] aspect-[9/16]" : "aspect-video"}`}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={`${v.pub} coverage of Serendipity Arts Festival`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}


        <ul className="rule-t">
          {[
            { pub: "Firstpost", date: "12 May 2026", title: "Serendipity Arts Festival announces dates for its 11th edition and a curator-led vision for 2026", url: "https://www.firstpost.com/entertainment/serendipity-arts-festival-announces-dates-for-its-11th-edition-and-a-curator-led-vision-for-2026-14009352.html" },
            { pub: "t2 Online", date: "13 May 2026", title: "Serendipity Arts Festival gears up for its 11th edition — announces curators", url: "https://t2online.in/events/events-1/serendipity-arts-festival-gears-up-for-its-11th-edition--announces-curators/2005066" },
            { pub: "TNA Mag", date: "14 May 2026", title: "Serendipity Arts Festival 2026 — meet the curators", url: "https://tnamag.xyz/art-news/serendipity-arts-festival-2026-curators/" },
            { pub: "The Tribune", date: "15 May 2026", title: "Serendipity Arts Festival to return for 11th edition", url: "https://www.tribuneindia.com/news/arts/serendipity-arts-festival-to-return-for-11th-edition/" },
            { pub: "The Navhind Times", date: "14 May 2026", title: "Serendipity Arts Festival announces curators for 11th edition", url: "https://navhindtimes.in/zest/serendipity-arts-festival-announces-curators-for-11th-edition/" },
            { pub: "Hindustan Times", date: "12 May 2026", title: "11th Serendipity Arts Festival to take place from December 13–20", url: "https://www.hindustantimes.com/lifestyle/art-culture/11th-serendipity-arts-festival-to-take-place-from-december-1320-101778580075113.html" },
          ].map((a) => (
            <li key={a.url} className="rule-b">
              <a href={a.url} target="_blank" rel="noreferrer"
                className="group py-5 md:py-7 grid grid-cols-12 gap-3 md:gap-6 items-baseline hover:text-accent transition-colors">
                <p className="col-span-12 md:col-span-3 label text-muted-foreground group-hover:text-accent">{a.pub} <span className="opacity-70">&middot; {a.date}</span></p>
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