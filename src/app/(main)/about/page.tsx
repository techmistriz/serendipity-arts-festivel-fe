"use client";

import GrantsGif from "@/components/about/GrantsGif";
import Image from "next/image";
import { useEffect, useState } from "react";

import collageAbout from "@public/images/about/collage-about.png";
import { getLaunchFilms, type LaunchFilm } from "@/services/launchFilms";
import Loader from "@/components/common/Loader";

export default function AboutPage() {
  const [launchFilms, setLaunchFilms] = useState<LaunchFilm[]>([]);
  const [loadingFilms, setLoadingFilms] = useState(true);
  const [filmsError, setFilmsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLaunchFilms = async () => {
      try {
        setLoadingFilms(true);
        setFilmsError(null);

        const data = await getLaunchFilms();

        setLaunchFilms(data);
      } catch (error) {
        console.error("Failed to fetch launch films:", error);
        setFilmsError("Unable to load launch films.");
      } finally {
        setLoadingFilms(false);
      }
    };

    fetchLaunchFilms();
  }, []);

  return (
    <div className="container-editorial pt-12 pb-32 md:pt-24">
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">About us</h1>

      <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-16">
        <div className="max-w-prose space-y-6 text-base leading-relaxed md:col-span-7 md:text-lg">
          <p className="display text-xl leading-[1.1] tracking-[-0.02em] md:text-3xl">
            Serendipity Arts began with a simple thought:
          </p>

          <p className="headline">
            What if India’s many traditions, creative voices, and stories could find space to speak
            to each other, and be open to all? In a world where the arts often tend to feel distant
            or overwhelming, we set out to create a space where they felt close, not closed off. A
            place where anyone could feel welcome.
          </p>

          <p>
            To start this conversation, we launched art residencies, cross-border grants, and
            writing programs that bring artists, curators, and audiences together.
          </p>

          <p>
            To help artists keep going, we support heritage crafts, explore practices that care for
            both people and the planet, document fading folk traditions, and build future leaders
            through fellowships.
          </p>
        </div>

        <aside className="md:col-span-5">
          <GrantsGif />

          <p className="label mt-3 text-muted-foreground">Grants & Initiatives, 2026</p>
        </aside>
      </div>

      <div className="rule-t mt-24 grid grid-cols-1 gap-10 pt-14 md:mt-32 md:grid-cols-12 md:gap-16 md:pt-20">
        <div className="md:col-span-5">
          <h2 className="display text-4xl uppercase leading-[0.92] tracking-[-0.02em] md:text-6xl lg:text-7xl">
            What the Festival means
          </h2>
        </div>

        <div className="max-w-prose space-y-6 text-base leading-relaxed md:col-span-7 md:text-lg">
          <p>
            Every December, the Serendipity Arts Festival transforms Panjim, Goa into one of the
            world’s largest, most inclusive celebrations of the arts.
          </p>

          <p>
            Across riverfronts, heritage buildings, and hidden corners of the city, the festival
            brings together craft, culinary arts, theatre, music, dance, visual arts, photography,
            performance, accessibility, and programming for children.
          </p>

          <p>
            Curated by leading voices from across disciplines and loved by audiences from around the
            world, it’s a space where culture feels alive, nuanced, and always within everyone’s
            reach.
          </p>
          <Image
            src={collageAbout}
            alt="Collage of festival graphics, print and colour"
            loading="lazy"
            className="w-full aspect-[16/9] object-cover border border-foreground"
          />
        </div>
      </div>

      <div className="rule-t mt-24 pt-14 md:mt-32 md:pt-20">
        <h2 className="display text-4xl uppercase leading-[0.92] md:text-6xl">Launch films</h2>

        {loadingFilms ? (
          <div className="mt-10">
            <Loader />
          </div>
        ) : filmsError ? (
          <p className="mt-10 text-gray-400">{filmsError}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {launchFilms.map((film) => (
              <figure key={film.id} className="border-2 border-black bg-black">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${film.youtube_video_id}`}
                    title={`Launch Film ${film.year}`}
                    className="absolute inset-0 h-full w-full"
                    allowFullScreen
                  />
                </div>

                <figcaption className="label bg-black px-3 py-2 text-white">
                  Launch Film — {film.year}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
