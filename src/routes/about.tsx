import { createFileRoute } from "@tanstack/react-router";

import g1 from "@/assets/grants/brij-cnap.jpg.asset.json";
import g2 from "@/assets/grants/eyes-shall-deceive.jpg.asset.json";
import g3 from "@/assets/grants/food-matters.jpg.asset.json";
import g4 from "@/assets/grants/futures-in-formation.jpg.asset.json";
import g5 from "@/assets/grants/london-puppet.jpg.asset.json";
import g6 from "@/assets/grants/music-grant.jpg.asset.json";
import g7 from "@/assets/grants/residency-2026.jpg.asset.json";
import g8 from "@/assets/grants/theatre-grant.jpg.asset.json";
import g9 from "@/assets/grants/wac-writing.jpg.asset.json";
import { useEffect, useState } from "react";

const GRANTS = [g1, g2, g3, g4, g5, g6, g7, g8, g9];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Serendipity Arts Festival 2026" },
      {
        name: "description",
        content:
          "Serendipity Arts began with a simple thought: what if India's many traditions, creative voices and stories could find space to speak to each other, open to all.",
      },
    ],
  }),
  component: About,
});

function GrantsGif() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % GRANTS.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative aspect-[4/5] w-full border-2 border-black bg-black overflow-hidden">
      {GRANTS.map((g, idx) => (
        <img
          key={idx}
          src={g.url}
          alt=""
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}

function About() {
  return (
    <div className="container-editorial pt-12 md:pt-24 pb-32">
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">
        About us
      </h1>

      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7 space-y-6 text-base md:text-lg leading-relaxed max-w-prose">
          <p className="display text-xl md:text-3xl leading-[1.1] tracking-[-0.02em]">
            Serendipity Arts began with a simple thought:
          </p>
          <p>
            What if India's many traditions, creative voices, and stories could find space to speak to each other, and be open to all? In a world where the arts often tend to feel distant or overwhelming, we set out to create a space where they felt close, not closed off. A place where anyone could feel welcome.
          </p>
          <p>
            To start this conversation, we launched art residencies, cross-border grants, and writing programs that bring artists, curators, and audiences together.
          </p>
          <p>
            To help artists keep going, we support heritage crafts, explore practices that care for both people and the planet, document fading folk traditions, and build future leaders through fellowships.
          </p>
        </div>

        <aside className="md:col-span-5">
          <GrantsGif />
          <p className="mt-3 label text-muted-foreground">Grants & Initiatives, 2026</p>
        </aside>
      </div>

      <div className="mt-24 md:mt-32 rule-t pt-14 md:pt-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5">
          <h2 className="display uppercase text-4xl md:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.02em]">
            What the Festival means
          </h2>
        </div>
        <div className="md:col-span-7 space-y-6 text-base md:text-lg leading-relaxed max-w-prose">
          <p>
            Every December, the Serendipity Arts Festival transforms Panjim, Goa into one of the world's largest, most inclusive celebrations of the arts.
          </p>
          <p>
            Across riverfronts, heritage buildings, and hidden corners of the city, the festival brings together craft, culinary arts, theatre, music, dance, visual arts, photography, performance, accessibility, and programming for children.
          </p>
          <p>
            Curated by leading voices from across disciplines and loved by audiences from around the world, it's a space where culture feels alive, nuanced, and always within everyone's reach.
          </p>
        </div>
      </div>

      {/* Past launch films */}
      <div className="mt-24 md:mt-32 rule-t pt-14 md:pt-20">
        <h2 className="display uppercase text-4xl md:text-6xl leading-[0.92] tracking-[-0.02em]">
          Launch films
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { yr: "2026", id: "eJ6lC1NebL0" },
            { yr: "2025", id: "AT2y5gz1TRg" },
            { yr: "2024", id: "tsXESfH50d8" },
            { yr: "2023", id: "XWaVJd1Dfes" },
            { yr: "2022", id: "Jh4PXH7deB0" },
            { yr: "2021", id: "CAvNfVoKZZY" },
            { yr: "2020", id: "CAvNfVoKZZY" },
            { yr: "2019", id: "i_KfH24yWZY" },
          ].map(({ yr, id }) => (
            <figure key={yr} className="border-2 border-black bg-black">

              <div className="relative w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={`Serendipity Arts Festival ${yr} — Launch Film`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <figcaption className="bg-black text-white label px-3 py-2">
                Launch Film — {yr}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

    </div>
  );
}
