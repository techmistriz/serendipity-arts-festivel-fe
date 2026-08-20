import type { Programme } from "@/data/programmes-data";

export type ProgrammeFilters = {
  category: string;
  day: number | null;
  venue: string;
  tags: string[];
  query: string;
};

export function filterProgrammes(programmes: Programme[], filters: ProgrammeFilters): Programme[] {
  const query = filters.query.trim().toLowerCase();

  return programmes
    .filter(
      (programme) =>
        (filters.category === "All" || programme.category === filters.category) &&
        (filters.day === null || programme.slots.some((slot) => slot.day === filters.day)) &&
        (filters.venue === "All" || programme.venue === filters.venue) &&
        (filters.tags.length === 0 || filters.tags.every((tag) => programme.tags.includes(tag))) &&
        (query === "" ||
          programme.title.toLowerCase().includes(query) ||
          programme.blurb.toLowerCase().includes(query) ||
          programme.curator.toLowerCase().includes(query) ||
          programme.venue.toLowerCase().includes(query) ||
          programme.category.toLowerCase().includes(query)),
    )
    .sort((first, second) => first.title.localeCompare(second.title));
}

export function getPageItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;

  return items.slice(start, start + pageSize);
}
