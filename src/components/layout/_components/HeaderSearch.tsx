"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { searchSiteApi, type SearchResponse } from "@/services/search";

type HeaderSearchProps = {
  onClose: () => void;
};

type SearchResult = {
  kind: "Programme" | "Curator" | "Venue" | "Vibe";
  title: string;
  subtitle?: string;
  href: string;
};

function toSearchResults(data: SearchResponse["data"]): SearchResult[] {
  return [
    ...data.programs.map((programme) => ({
      kind: "Programme" as const,
      title: programme.name,
      subtitle: "Programme",
      href: "/programmes",
    })),
    ...data.curators.map((curator) => ({
      kind: "Curator" as const,
      title: curator.name,
      subtitle: curator.discipline,
      href: "/curators",
    })),
    ...data.venues.map((venue) => ({
      kind: "Venue" as const,
      title: venue.name,
      subtitle: "Venue",
      href: "/venues",
    })),
    ...data.vibes.map((vibe) => ({
      kind: "Vibe" as const,
      title: vibe.name,
      subtitle: "Vibe",
      href: "/programmes",
    })),
  ];
}

export function HeaderSearch({ onClose }: HeaderSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    const keyword = query.trim();

    if (!keyword) return;

    let isCurrent = true;
    const timer = window.setTimeout(() => {
      void searchSiteApi(keyword)
        .then((data) => {
          if (isCurrent) setResults(toSearchResults(data));
        })
        .catch(() => {
          if (isCurrent) {
            setResults([]);
            setError("Search is unavailable right now. Please try again.");
          }
        })
        .finally(() => {
          if (isCurrent) setIsLoading(false);
        });

      setIsLoading(true);
      setError(null);
    }, 350);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setError(null);
      setIsLoading(false);
    }
  };

  const closeSearch = () => {
    clearSearch();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the festival"
      className="ed-fade fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md"
    >
      <div className="container-editorial pt-6 md:pt-10">
        <div className="rule-b flex items-center justify-between pb-4">
          <p className="label">Search the festival</p>
          <button type="button" onClick={closeSearch} className="label notch hover:text-accent">
            Close ×
          </button>
        </div>

        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="mt-8 flex items-center gap-3 border border-foreground px-4 py-3 md:px-5"
        >
          <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
          <input
            autoFocus
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search programmes, curators, venues…"
            className="headline flex-1 bg-transparent text-base outline-none md:text-xl"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="label text-muted-foreground hover:text-accent"
            >
              Clear ×
            </button>
          )}
        </form>

        <div className="mt-10 pb-16">
          <ul className="rule-t">
            {hasQuery && isLoading && (
              <li className="py-6 text-sm text-muted-foreground">Searching...</li>
            )}
            {hasQuery && !isLoading && error && (
              <li className="py-6 text-sm text-accent">{error}</li>
            )}
            {!hasQuery && (
              <li className="py-6 text-sm text-muted-foreground">
                Try “dance”, “Art Park”, “volunteer”…
              </li>
            )}
            {!isLoading && !error && hasQuery && results.length === 0 && (
              <li className="py-6 text-sm text-muted-foreground">Nothing matches that yet.</li>
            )}
            {hasQuery &&
              results.map((result, index) => (
                <li key={`${result.kind}-${result.title}-${index}`} className="rule-b">
                  <Link
                    href={result.href}
                    onClick={closeSearch}
                    className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4 text-left hover:text-accent"
                  >
                    <span className="headline text-base font-semibold md:text-xl">
                      {result.title}
                    </span>
                    <span className="label shrink-0 text-muted-foreground">
                      {result.kind}
                      {result.subtitle ? ` · ${result.subtitle}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
