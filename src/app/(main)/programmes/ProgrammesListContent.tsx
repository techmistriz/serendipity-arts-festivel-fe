"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Programme as UiProgramme } from "@/data/programmes-data";
import { useCart } from "@/hooks/use-cart";
import { useProgrammes } from "@/hooks/useProgrammes";

import {
  CATEGORY_TO_SLUG,
  PROGRAMME_CATEGORIES,
  PROGRAMME_DAYS,
  PROGRAMME_TAGS,
  PROGRAMME_VENUES,
  PROGRAMMES_PER_PAGE,
} from "./constants";

import { filterProgrammes, getPageItems } from "./helpers";

import { FilterSelect } from "./_components/FilterSelect";
import { HowToAttendCTA } from "./_components/HowToAttendCTA";
import { ProgrammeCard } from "./_components/ProgrammeCard";
import { ProgrammesPagination } from "./_components/ProgrammesPagination";

import { BookingSheet } from "./BookingSheet";
import { mapApiProgrammeToUi } from "@/lib/programme-adapter";

export function ProgrammesListContent({
  initialCategory = "All",
  initialProgrammeId,
}: {
  initialCategory?: string;
  initialProgrammeId: string | null;
}) {
  const router = useRouter();
  const { isVip } = useCart();

  const [cat, setCat] = useState<string>(initialCategory);
  const [day, setDay] = useState<number | null>(null);
  const [venue, setVenue] = useState<string>("All");
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const [pageState, setPageState] = useState({
    filterKey: "",
    page: 1,
  });

  /**
   * API programmes
   *
   * The API hook is now the source of truth instead of PROGRAMMES.
   */
  const { programmes: apiProgrammes, loading, error } = useProgrammes(1);

  const programmes = useMemo<UiProgramme[]>(() => {
    return apiProgrammes.map(mapApiProgrammeToUi);
  }, [apiProgrammes]);

  const initialActiveProgramme = useMemo<UiProgramme | null>(() => {
    if (!initialProgrammeId || programmes.length === 0) {
      return null;
    }

    return programmes.find((item) => String(item.id) === String(initialProgrammeId)) ?? null;
  }, [initialProgrammeId, programmes]);

  const [active, setActive] = useState<UiProgramme | null>(null);
  const [activeIntent, setActiveIntent] = useState<"about" | "cart">("about");

  const displayedActiveProgramme = active ?? initialActiveProgramme;

  const anyFilter =
    cat !== "All" || day !== null || venue !== "All" || tags.length > 0 || query.trim().length > 0;

  /**
   * Filter the API-backed UI programmes.
   *
   * We keep your existing filtering helper so the rest
   * of the page does not need to change.
   */
  const filtered = useMemo(() => {
    return filterProgrammes(programmes, {
      category: cat,
      day,
      venue,
      tags,
      query,
    });
  }, [programmes, cat, day, venue, tags, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PROGRAMMES_PER_PAGE));

  const filterKey = JSON.stringify({
    cat,
    day,
    venue,
    tags,
    query,
  });

  const requestedPage = pageState.filterKey === filterKey ? pageState.page : 1;

  const currentPage = Math.min(requestedPage, totalPages);

  const paged = getPageItems(filtered, currentPage, PROGRAMMES_PER_PAGE);

  const goToPage = (page: number) => {
    const nextPage = Math.min(totalPages, Math.max(1, page));

    setPageState({
      filterKey,
      page: nextPage,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onCategoryChange = (next: string) => {
    setCat(next);

    setPageState({
      filterKey: "",
      page: 1,
    });

    if (next === "All") {
      router.push("/programmes");
      return;
    }

    const slug = CATEGORY_TO_SLUG[next];

    if (slug) {
      router.push(`/programmes/${slug}`);
    }
  };

  const clearFilters = () => {
    setCat("All");
    setDay(null);
    setVenue("All");
    setTags([]);
    setQuery("");

    setPageState({
      filterKey: "",
      page: 1,
    });

    router.push("/programmes");
  };

  const openProgramme = (programme: UiProgramme, intent: "about" | "cart" = "about") => {
    setActiveIntent(intent);
    setActive(programme);
  };

  return (
    <div className="container-editorial pt-10 md:pt-24 pb-32">
      {/* HEADER */}
      <h1 className="display uppercase text-[15vw] md:text-[12vw] leading-[0.9]">Programmes</h1>

      <p className="mt-6 max-w-2xl hand text-xl md:text-3xl leading-[1.15] headline">
        We keep on adding new programmes — book them before they get sold out.
      </p>

      <div className="mt-4 inline-grid gap-3 justify-items-stretch">
        <HowToAttendCTA className="w-full justify-center" />

        {isVip && (
          <span className="headline text-xs uppercase tracking-[0.06em] border border-accent text-accent px-3 py-2">
            Special guest — all programmes complimentary
          </span>
        )}
      </div>

      {/* SEARCH */}
      <div className="mt-10 md:mt-14">
        <p className="label mb-3">Search programmes</p>

        <div className="border border-foreground px-4 md:px-5 py-3 md:py-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events, descriptions…"
            className="w-full bg-transparent outline-none text-base md:text-lg headline"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-8">
        <p className="label mb-3">Filters</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <FilterSelect
            label="Select Date"
            value={day === null ? "All" : `${day} Dec`}
            options={["All", ...PROGRAMME_DAYS.map((programmeDay) => `${programmeDay} Dec`)]}
            onChange={(value) => setDay(value === "All" ? null : parseInt(value, 10))}
          />

          <FilterSelect
            label="Select Category"
            value={cat}
            options={PROGRAMME_CATEGORIES}
            onChange={onCategoryChange}
          />

          <FilterSelect
            label="Select Venue"
            value={venue}
            options={["All", ...PROGRAMME_VENUES]}
            onChange={setVenue}
          />

          <FilterSelect
            label="Select Tag"
            value={tags[0] ?? "All"}
            options={["All", ...PROGRAMME_TAGS]}
            onChange={(value) => setTags(value === "All" ? [] : [value])}
          />
        </div>

        {anyFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 label text-muted-foreground hover:text-accent transition-colors"
          >
            Clear all ×
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <>
          <p className="mt-8 label text-muted-foreground">Loading programmes…</p>

          <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
            {Array.from({ length: PROGRAMMES_PER_PAGE }).map((_, index) => (
              <div key={index}>
                <div className="w-full aspect-square bg-muted animate-pulse" />

                <div className="mt-3 space-y-2">
                  <div className="h-3 w-20 bg-muted animate-pulse" />
                  <div className="h-5 w-3/4 bg-muted animate-pulse" />
                  <div className="h-3 w-full bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="mt-8 border border-foreground p-6">
          <p className="headline text-sm">Unable to load programmes.</p>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* RESULTS */}
      {!loading && !error && (
        <>
          {/* RESULT COUNT */}
          <p className="mt-8 label text-muted-foreground">
            {filtered.length} programme
            {filtered.length === 1 ? "" : "s"} · Page {currentPage} of {totalPages}
          </p>

          {/* PROGRAMME GRID */}
          <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
            {paged.map((programme) => (
              <ProgrammeCard
                key={programme.id}
                programme={programme}
                onAbout={() => openProgramme(programme, "about")}
                onAdd={() => openProgramme(programme, "cart")}
              />
            ))}
          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <p className="mt-16 label text-muted-foreground">No programmes match these filters.</p>
          )}

          {/* PAGINATION */}
          <ProgrammesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}

      {/* BOOKING SHEET */}
      {displayedActiveProgramme && (
        <BookingSheet
          key={displayedActiveProgramme.id}
          programme={displayedActiveProgramme}
          intent={activeIntent}
          onClose={() => setActive(null)}
          onOpen={(programme) => openProgramme(programme, "about")}
        />
      )}
    </div>
  );
}
