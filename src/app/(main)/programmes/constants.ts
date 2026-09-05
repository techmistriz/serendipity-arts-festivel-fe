export const CATEGORY_SLUGS: Record<string, string> = {
  exhibition: "Exhibition",
  performance: "Performance",
  workshop: "Workshop",
  talk: "Talk",
  "film-screening": "Film Screening",
};

export const CATEGORY_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([slug, category]) => [category, slug]),
);

// Static categories (these should match the API categories)
export const PROGRAMME_CATEGORIES = [
  "All",
  "Exhibition",
  "Performance",
  "Workshop",
  "Talk",
  "Film Screening",
] as const;

// Static days (these should match the festival dates)
export const PROGRAMME_DAYS = [13, 14, 15, 16, 17, 18, 19, 20];

// These will be populated dynamically from API data
export const PROGRAMME_VENUES: string[] = [];
export const PROGRAMME_TAGS: string[] = [];

export const PROGRAMMES_PER_PAGE = 12;

// Helper to get page numbers for pagination
export const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible = 5,
): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) {
    end = maxVisible;
  } else if (currentPage > totalPages - half) {
    start = totalPages - maxVisible + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
