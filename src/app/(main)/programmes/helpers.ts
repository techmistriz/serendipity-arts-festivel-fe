import type { UIProgramme, ProgrammeFilters } from "@/types/programme";

// Filter programmes based on filters
export function filterProgrammes(
  programmes: UIProgramme[],
  filters: ProgrammeFilters,
): UIProgramme[] {
  if (!programmes || !Array.isArray(programmes)) {
    return [];
  }

  const query = filters.query.trim().toLowerCase();

  return programmes
    .filter((programme) => {
      // Category filter
      if (filters.category !== "All" && programme.category !== filters.category) {
        return false;
      }

      // Day filter
      if (filters.day !== null) {
        const hasSlotOnDay = programme.slots?.some((slot) => slot.day === filters.day);
        if (!hasSlotOnDay) {
          return false;
        }
      }

      // Venue filter
      if (filters.venue !== "All" && programme.venue !== filters.venue) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) =>
          programme.tags?.some((programmeTag) => programmeTag.name === tag),
        );
        if (!hasAllTags) {
          return false;
        }
      }

      // Search query
      if (query !== "") {
        const searchableText = [
          programme.title,
          programme.blurb,
          programme.curator,
          programme.venue,
          programme.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    })
    .sort((first, second) => first.title.localeCompare(second.title));
}

// Get paginated items
export function getPageItems<T>(items: T[], page: number, pageSize: number): T[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// Extract unique venues from programmes
export function getUniqueVenues(programmes: UIProgramme[]): string[] {
  if (!programmes || !Array.isArray(programmes)) {
    return [];
  }

  const venues = new Set<string>();
  programmes.forEach((p) => {
    if (p.venue) {
      venues.add(p.venue);
    }
  });

  return Array.from(venues).sort();
}

// Extract unique tags from programmes
export function getUniqueTags(programmes: UIProgramme[]): string[] {
  if (!programmes || !Array.isArray(programmes)) {
    return [];
  }

  const tags = new Set<string>();
  programmes.forEach((p) => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach((tag) => tags.add(tag.name));
    }
  });

  return Array.from(tags).sort();
}

// Extract unique categories from programmes
export function getUniqueCategories(programmes: UIProgramme[]): string[] {
  if (!programmes || !Array.isArray(programmes)) {
    return [];
  }

  const categories = new Set<string>();
  programmes.forEach((p) => {
    if (p.category) {
      categories.add(p.category);
    }
  });

  return Array.from(categories).sort();
}
