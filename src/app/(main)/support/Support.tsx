"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { images } from "@/config/images";

import { useProgrammes } from "@/hooks/useProgrammes";
import { useVenues } from "@/hooks/useVenues";
import { mapApiProgrammesToUi } from "@/lib/programme-adapter";
import type { UIProgramme } from "@/types/programme";
import DonateForm from "./DonateForm";
import { EnquiryForm } from "./SupportForms";
import { getPageNumbers } from "../programmes/constants";

const TIERS = [
  {
    name: "Title Sponsor / Presenting Partner",
    note: "Lead the festival or co-present a discipline across its most visible stages.",
    image: images.support.title_presenting,
  },
  {
    name: "Custom Title",
    note: "Choose a title that fits your brand, from Official Mobility Partner to Night Partner.",
    image: images.support.customTitle,
  },
  {
    name: "Programme IP",
    note: "Adopt one programme and make its story your own.",
    image: images.support.program_ip,
  },
];

export default function Support() {
  const [tier, setTier] = useState(TIERS[0].name);
  const [prog, setProg] = useState<string | null>(null);

  // Fetch programmes from API
  const { programmes: apiProgrammes, loading, error } = useProgrammes({ limit: 1000 });

  // Fetch venues
  const { venues } = useVenues();

  // Convert API programmes into UI format
  const programmes = useMemo<UIProgramme[]>(() => {
    if (!apiProgrammes?.length) return [];

    return mapApiProgrammesToUi(apiProgrammes, undefined, venues);
  }, [apiProgrammes, venues]);

  // Pagination
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(programmes.length / ITEMS_PER_PAGE);

  // Keep the current page within valid bounds
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedProgrammes = programmes.slice(
    (validCurrentPage - 1) * ITEMS_PER_PAGE,
    validCurrentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div>
          <h1 className="display uppercase text-[13vw] md:text-[6vw] leading-[0.9]">
            Keep the arts in circulation
          </h1>
          <p className="mt-6 text-lg max-w-xl">
            Serendipity Arts Festival keeps eight days of art open to anyone who walks in.
            Exhibitions stay free because some choose not to stand outside it as audiences, but
            inside it as supporters.
          </p>
          <p className="mt-4 text-lg max-w-xl">
            Give once, adopt a programme, or partner with us through CSR.
          </p>
          <nav className="mt-8 flex flex-wrap gap-2">
            {[
              ["Donate", "#donate"],
              ["Sponsorships", "#sponsor"],
              ["Adopt a programme", "#adopt"],
              ["CSR", "#csr"],
              ["Past partners", "#archive"],
            ].map(([l, h]) => (
              <a
                key={h}
                href={h}
                className="label notch border border-foreground rounded-full px-4 py-2 hover:bg-foreground hover:text-background"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div id="donate" className="scroll-mt-24">
          <DonateForm />
        </div>
      </div>

      <section id="sponsor" className="mt-24 scroll-mt-24">
        <h2 className="display uppercase text-3xl md:text-5xl rule-b pb-4">Sponsorships</h2>
        <div className="mt-8 grid md:grid-cols-3 border-l border-t border-foreground">
          {TIERS.map((t) => (
            <button
              key={t.name}
              onClick={() => setTier(t.name)}
              className={`group text-left border-r border-b border-foreground flex flex-col ${tier === t.name ? "bg-foreground text-background" : "bg-background"}`}
            >
              <Image
                src={t.image}
                alt={t.name}
                width={800}
                height={600}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="w-full aspect-[4/3] object-cover"
              />
              <span className="p-5 md:p-6 flex flex-col justify-between flex-1 min-h-44">
                <span className="display uppercase text-2xl md:text-3xl leading-none">
                  {t.name}
                </span>
                <span className="text-sm mt-5">{t.note}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-6 border border-foreground p-6">
          <p className="label mb-4">Enquire: {tier}</p>
          <EnquiryForm key={tier} enquiryType="Sponsorship" forEnquiry={tier} />
        </div>
      </section>

      <section id="adopt" className="mt-24 scroll-mt-24">
        <h2 className="display uppercase text-3xl md:text-5xl rule-b pb-4">Adopt a programme</h2>

        <p className="mt-4 max-w-2xl">
          Every project is a different story. Pick the one that sounds like your brand and make it
          your own IP for 2026.
        </p>

        <div className="mt-8">
          {/* Loading */}
          {loading && <p className="py-10 text-center">Loading programmes...</p>}

          {/* Error */}
          {!loading && error && (
            <p className="py-10 text-center text-red-500">
              Unable to load programmes. Please try again later.
            </p>
          )}

          {/* Empty state */}
          {!loading && !error && programmes.length === 0 && (
            <p className="py-10 text-center">No programmes available.</p>
          )}

          {/* Programme cards */}
          {!loading && !error && programmes.length > 0 && (
            <>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {paginatedProgrammes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProg(p.title)}
                    className={`text-left border border-foreground ${
                      prog === p.title ? "ring-4 ring-accent" : ""
                    }`}
                  >
                    <Image
                      src={p.img}
                      width={800}
                      height={600}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      alt={p.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover"
                    />

                    <div className="p-3">
                      <p className="label text-muted-foreground">{p.category}</p>

                      <p className="headline font-semibold text-sm mt-1">{p.title}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination - right aligned */}
              {totalPages > 1 &&
                (() => {
                  const visiblePages = getPageNumbers(validCurrentPage, totalPages);
                  const firstVisiblePage = visiblePages[0];
                  const lastVisiblePage = visiblePages.at(-1);

                  return (
                    <nav
                      className="mt-8 flex flex-wrap items-center justify-end gap-2"
                      aria-label="Pagination"
                    >
                      {/* Previous */}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(validCurrentPage - 1)}
                        disabled={validCurrentPage === 1}
                        aria-label="Go to previous page"
                        className="headline border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
                      >
                        ← Prev
                      </button>

                      {/* Mobile page indicator */}
                      <span className="sm:hidden headline text-xs tracking-[0.06em] uppercase px-2 py-2">
                        {validCurrentPage} / {totalPages}
                      </span>

                      {/* Desktop page numbers */}
                      <div className="hidden sm:flex items-center gap-2">
                        {firstVisiblePage > 1 && (
                          <button
                            type="button"
                            onClick={() => setCurrentPage(1)}
                            className="headline min-w-[40px] border border-foreground px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background"
                          >
                            1
                          </button>
                        )}

                        {firstVisiblePage > 2 && (
                          <span className="px-1 text-sm text-muted-foreground">…</span>
                        )}

                        {visiblePages.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            aria-current={page === validCurrentPage ? "page" : undefined}
                            className={`headline min-w-[40px] border px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors ${
                              page === validCurrentPage
                                ? "border-foreground bg-foreground text-background"
                                : "border-foreground hover:bg-foreground hover:text-background"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {lastVisiblePage !== undefined && lastVisiblePage < totalPages - 1 && (
                          <span className="px-1 text-sm text-muted-foreground">…</span>
                        )}

                        {lastVisiblePage !== undefined && lastVisiblePage < totalPages && (
                          <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            className="headline min-w-[40px] border border-foreground px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background"
                          >
                            {totalPages}
                          </button>
                        )}
                      </div>

                      {/* Next */}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(validCurrentPage + 1)}
                        disabled={validCurrentPage === totalPages}
                        aria-label="Go to next page"
                        className="headline border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </nav>
                  );
                })()}
            </>
          )}
        </div>

        {/* Programme enquiry form */}
        {prog && (
          <div className="mt-6 border border-foreground p-6">
            <p className="label mb-4">Support: {prog}</p>

            <EnquiryForm key={prog} enquiryType="Programme" forEnquiry={prog} />
          </div>
        )}
      </section>

      <section
        id="csr"
        className="mt-24 scroll-mt-24 grid md:grid-cols-2 gap-8 border border-foreground p-6 md:p-10"
      >
        <div>
          <h2 className="display uppercase text-3xl md:text-5xl">CSR partnerships</h2>
          <p className="mt-4">
            Arts, culture and heritage are eligible CSR activities under Schedule VII of the
            Companies Act, 2013. We work with your CSR team on public art, accessibility, education
            and craft programmes, with full utilisation and impact reporting.
          </p>
        </div>
        <EnquiryForm enquiryType="CSR" forEnquiry="partnerships" />
      </section>
    </div>
  );
}
