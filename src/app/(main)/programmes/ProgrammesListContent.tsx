"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import type { UIProgramme } from "@/types/programme";
import { useCart } from "@/hooks/use-cart";
import { useProgrammes } from "@/hooks/useProgrammes";
import { mapApiProgrammesToUi } from "@/lib/programme-adapter";
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

type Intent = "about" | "cart";

interface ProgrammesListContentProps {
  initialCategory?: string;
  initialProgrammeId?: string | null;
}

export function ProgrammesListContent({
  initialCategory = "All",
  initialProgrammeId = null,
}: ProgrammesListContentProps) {
  const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const { isVip } = useCart();
  const { programmes: apiProgrammes, loading, error } = useProgrammes({ limit: 1000 });

  // Filter state
  const [category, setCategory] = useState(initialCategory);
  const [day, setDay] = useState<number | null>(null);
  const [venue, setVenue] = useState("All");
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [pageState, setPageState] = useState({ filterKey: "", page: 1 });

  // Legacy modal state remains available for existing ?p=<id> links.
  const [activeProgramme, setActiveProgramme] = useState<UIProgramme | null>(null);
  const [activeIntent, setActiveIntent] = useState<Intent>("about");
  const [isOpening, setIsOpening] = useState(false);
  const hasInitializedRef = useRef(false);

  // Convert API programmes to UI format
  const programmes = useMemo<UIProgramme[]>(() => {
    if (!apiProgrammes?.length) return [];
    return mapApiProgrammesToUi(apiProgrammes);
  }, [apiProgrammes]);

  // Initialize from URL only on first load if programme ID is provided
  useEffect(() => {
    if (hasInitializedRef.current || !initialProgrammeId || programmes.length === 0) {
      return;
    }

    const found = programmes.find((item) => String(item.id) === String(initialProgrammeId));

    if (!found) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveProgramme(found);
      setActiveIntent("cart");
      hasInitializedRef.current = true;
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialProgrammeId, programmes]);

  // Filter programmes
  const filtered = useMemo(() => {
    if (!programmes.length) return [];
    return filterProgrammes(programmes, { category, day, venue, tags, query });
  }, [programmes, category, day, venue, tags, query]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PROGRAMMES_PER_PAGE));
  const filterKey = JSON.stringify({ category, day, venue, tags, query });
  const requestedPage = pageState.filterKey === filterKey ? pageState.page : 1;
  const currentPage = Math.min(requestedPage, totalPages);
  const paged = getPageItems(filtered, currentPage, PROGRAMMES_PER_PAGE);

  const isFilterApplied =
    category !== "All" ||
    day !== null ||
    venue !== "All" ||
    tags.length > 0 ||
    query.trim().length > 0;

  const isLoading = loading && !apiProgrammes?.length;
  const hasError = !loading && !!error;
  const isEmpty = !loading && !error && !programmes.length;
  const hasNoResults = !loading && !error && programmes.length > 0 && !filtered.length;

  // Handlers
  const goToPage = useCallback(
    (page: number) => {
      const nextPage = Math.min(totalPages, Math.max(1, page));
      setPageState({ filterKey, page: nextPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages, filterKey],
  );

  const onCategoryChange = useCallback(
    (next: string) => {
      setCategory(next);
      setPageState({ filterKey: "", page: 1 });

      if (next === "All") {
        router.push("/programmes");
        return;
      }

      const slug = CATEGORY_TO_SLUG[next];
      if (slug) router.push(`/programmes/${slug}`);
    },
    [router],
  );

  const clearFilters = useCallback(() => {
    setCategory("All");
    setDay(null);
    setVenue("All");
    setTags([]);
    setQuery("");
    setPageState({ filterKey: "", page: 1 });
    router.push("/programmes");
  }, [router]);

  // Open a legacy programme modal without changing the URL.
  const openProgramme = useCallback(
    (programme: UIProgramme, intent: Intent = "about") => {
      if (!programme?.id || isOpening) {
        console.warn("[ProgrammesList] Invalid programme or already opening:", programme);
        return;
      }

      // If already open, just update intent
      if (activeProgramme?.id === programme.id) {
        if (activeIntent !== intent) {
          setActiveIntent(intent);
        }
        return;
      }

      setIsOpening(true);

      try {
        setActiveIntent(intent);
        setActiveProgramme(programme);
      } catch (error) {
        console.error("[ProgrammesList] Error opening programme:", error);
      } finally {
        // Small delay to prevent rapid successive opens
        setTimeout(() => {
          setIsOpening(false);
        }, 200);
      }
    },
    [activeProgramme, activeIntent, isOpening],
  );

  const openProgrammePage = useCallback(
    (programme: UIProgramme, intent: Intent = "about") => {
      if (!programme.slug) {
        openProgramme(programme, intent);
        return;
      }

      const programmePath = `/programmes/${encodeURIComponent(programme.slug)}`;
      router.push(intent === "cart" ? `${programmePath}?intent=cart` : programmePath);
    },
    [openProgramme, router],
  );

  // Close programme WITHOUT changing URL
  const closeProgramme = useCallback(() => {
    if (!activeProgramme) return;

    try {
      setActiveProgramme(null);
      setActiveIntent("about");
    } catch (error) {
      console.error("[ProgrammesList] Error closing programme:", error);
    }
  }, [activeProgramme]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeProgramme) {
        closeProgramme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProgramme, closeProgramme]);

  // Handle browser back/forward - only if we want to close on navigation
  useEffect(() => {
    const handlePopState = () => {
      // Close modal when user navigates back/forward
      if (activeProgramme) {
        closeProgramme();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeProgramme, closeProgramme]);

  // Render loading state
  const renderLoading = () => (
    <>
      <p className="sr-only" role="status">
        Loading programmes
      </p>
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
  );

  // Render error state
  const renderError = () => (
    <div className="mt-8 border border-foreground p-6">
      <p className="headline text-sm text-red-500">Unable to load programmes.</p>
      <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 headline text-xs uppercase tracking-[0.06em] border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
      >
        Retry
      </button>
    </div>
  );

  // Render empty state
  const renderEmpty = () => (
    <div className="mt-16 text-center">
      <p className="headline text-lg">No programmes available at the moment.</p>
      <p className="mt-2 text-sm text-muted-foreground">Please check back later.</p>
    </div>
  );

  // Render results
  const renderResults = () => (
    <>
      <p className="mt-8 label text-muted-foreground">
        {filtered.length} programme{filtered.length === 1 ? "" : "s"} · Page {currentPage} of{" "}
        {totalPages}
        {filtered.length > 0 && ` · Total: ${filtered.length}`}
      </p>

      <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
        {paged.map((programme) => (
          <ProgrammeCard
            key={programme.id}
            programme={programme}
            onAbout={() => openProgrammePage(programme, "about")}
            onAdd={() => openProgrammePage(programme, "cart")}
          />
        ))}
      </div>

      {hasNoResults && (
        <p className="mt-16 label text-muted-foreground text-center">
          No programmes match these filters. Try adjusting your search or filters.
        </p>
      )}

      {filtered.length > 0 && (
        <ProgrammesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </>
  );

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
            onChange={(e) => setQuery(e.target.value)}
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
            options={["All", ...PROGRAMME_DAYS.map((d) => `${d} Dec`)]}
            onChange={(value) => setDay(value === "All" ? null : parseInt(value, 10))}
          />
          <FilterSelect
            label="Select Category"
            value={category}
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

        {isFilterApplied && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 label text-muted-foreground hover:text-accent transition-colors"
          >
            Clear all ×
          </button>
        )}
      </div>

      {/* CONTENT */}
      {isLoading && renderLoading()}
      {hasError && renderError()}
      {isEmpty && renderEmpty()}
      {!isLoading && !hasError && !isEmpty && renderResults()}

      {/* BOOKING SHEET - LOCAL STATE ONLY */}
      {activeProgramme && (
        <BookingSheet
          key={`${activeProgramme.id}-${activeIntent}`}
          programme={activeProgramme}
          intent={activeIntent}
          onClose={closeProgramme}
          onOpen={(programme) => openProgramme(programme, "about")}
          allProgrammes={programmes}
        />
      )}
    </div>
  );
}
