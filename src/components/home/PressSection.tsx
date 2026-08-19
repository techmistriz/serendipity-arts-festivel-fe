"use client";

import { useState } from "react";

import pressBox from "@public/press-box.png";

import { HomePromoPanel } from "./HomePromoPanel";
import { HomeSectionHeader } from "./HomeSectionHeader";

const PRESS_COVERAGES = [
  { publication: "Times Now", videoId: "8XsdMdyEoDs", date: "20 Dec 2025" },
  { publication: "NDTV", videoId: "OrwGAGUZddg", date: "19 Dec 2025" },
  { publication: "The Hindu", videoId: "Eiy18AN4Ib8", isShort: true, date: "18 Dec 2025" },
  { publication: "Frontline Magazine", videoId: "sNTw2zI--G0", date: "17 Dec 2025" },
  { publication: "Prudent Media Goa", videoId: "foKlZHsDtb0", date: "16 Dec 2025" },
];

const PRESS_ARTICLES = [
  {
    publication: "Firstpost",
    date: "12 May 2026",
    title:
      "Serendipity Arts Festival announces dates for its 11th edition and a curator-led vision for 2026",
    url: "https://www.firstpost.com/entertainment/serendipity-arts-festival-announces-dates-for-its-11th-edition-and-a-curator-led-vision-for-2026-14009352.html",
  },
  {
    publication: "t2 Online",
    date: "13 May 2026",
    title: "Serendipity Arts Festival gears up for its 11th edition — announces curators",
    url: "https://t2online.in/events/events-1/serendipity-arts-festival-gears-up-for-its-11th-edition--announces-curators/2005066",
  },
  {
    publication: "TNA Mag",
    date: "14 May 2026",
    title: "Serendipity Arts Festival 2026 — meet the curators",
    url: "https://tnamag.xyz/art-news/serendipity-arts-festival-2026-curators/",
  },
  {
    publication: "The Tribune",
    date: "15 May 2026",
    title: "Serendipity Arts Festival to return for 11th edition",
    url: "https://www.tribuneindia.com/news/arts/serendipity-arts-festival-to-return-for-11th-edition/",
  },
  {
    publication: "The Navhind Times",
    date: "14 May 2026",
    title: "Serendipity Arts Festival announces curators for 11th edition",
    url: "https://navhindtimes.in/zest/serendipity-arts-festival-announces-curators-for-11th-edition/",
  },
  {
    publication: "Hindustan Times",
    date: "12 May 2026",
    title: "11th Serendipity Arts Festival to take place from December 13–20",
    url: "https://www.hindustantimes.com/lifestyle/art-culture/11th-serendipity-arts-festival-to-take-place-from-december-1320-101778580075113.html",
  },
];

export function PressSection() {
  const [isCoverageOpen, setIsCoverageOpen] = useState(false);

  return (
    <section className="container-editorial mt-20 md:mt-32">
      <HomeSectionHeader title="Press">
        <HomePromoPanel image={pressBox} imageClassName="scale-[1.7] object-[30%_85%]">
          <p className="notch text-xl leading-[1] font-semibold tracking-[-0.01em] text-white uppercase md:text-2xl">
            Watch the coverages
          </p>
          <p className="headline mt-2 max-w-lg text-xs text-white/85 md:text-sm">
            Broadcast stories on the festival, gathered in one place.
          </p>
          <button
            type="button"
            onClick={() => setIsCoverageOpen((isOpen) => !isOpen)}
            className="label notch mt-4 border border-white px-4 py-2.5 text-white transition-colors hover:bg-white hover:text-foreground"
          >
            {isCoverageOpen ? "Hide coverages" : "Watch coverages →"}
          </button>
        </HomePromoPanel>
      </HomeSectionHeader>

      {isCoverageOpen && (
        <div className="mb-10 divide-y divide-foreground border border-foreground md:mb-14">
          {PRESS_COVERAGES.map((coverage) => (
            <details key={coverage.videoId} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:text-accent md:px-7 md:py-5">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="headline text-base leading-tight font-semibold md:text-xl">
                    {coverage.publication}
                  </span>
                  <span className="label text-muted-foreground">{coverage.date}</span>
                </span>
                <span className="label shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 md:px-7 md:pb-7">
                <div
                  className={`relative w-full ${
                    coverage.isShort ? "max-w-[360px] aspect-[9/16]" : "aspect-video"
                  }`}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${coverage.videoId}`}
                    title={`${coverage.publication} coverage of Serendipity Arts Festival`}
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
        {PRESS_ARTICLES.map((article) => (
          <li key={article.url} className="rule-b">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-12 items-baseline gap-3 py-5 transition-colors hover:text-accent md:gap-6 md:py-7"
            >
              <p className="label col-span-12 text-muted-foreground group-hover:text-accent md:col-span-3">
                {article.publication} <span className="opacity-70">&middot; {article.date}</span>
              </p>
              <p className="headline col-span-11 text-lg leading-tight font-semibold tracking-[-0.01em] md:col-span-8 md:text-2xl">
                {article.title}
              </p>
              <p className="label col-span-1 text-right">↗</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
