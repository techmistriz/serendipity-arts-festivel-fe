// src/lib/seo/venue-schema.ts

import { stripHtml } from "@/utils/html";
import type { VenueDetail, VenueListItem } from "@/types/venue";

const BASE_URL = "https://www.serendipityartsfestival.com";

const ORGANIZER = {
  "@type": "Organization",
  name: "Serendipity Arts Festival",
  url: `${BASE_URL}/`,
};

/**
 * Converts API date and time into ISO 8601 format.
 *
 * API date: 13-12-2026
 * API time: 19:00:00
 *
 * Output: 2026-12-13T19:00:00+05:30
 */
function createEventDateTime(
  eventDate: string | null,
  eventTime: string | null,
): string | undefined {
  if (!eventDate || !eventTime) return undefined;

  const dateMatch = eventDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const timeMatch = eventTime.match(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);

  if (!dateMatch || !timeMatch) return undefined;

  const [, day, month, year] = dateMatch;

  // Validate that the date is a real calendar date.
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }

  return `${year}-${month}-${day}T${eventTime}+05:30`;
}

type VenueDetailSchemaInput = {
  venue: VenueDetail;
  slug: string;
  description: string;
};

export function generateVenueDetailSchema({ venue, slug, description }: VenueDetailSchemaInput) {
  const pageUrl = `${BASE_URL}/venues/${encodeURIComponent(slug)}`;
  const placeId = `${pageUrl}#place`;
  const programmesId = `${pageUrl}#programmes`;

  const programmes = venue.program_details ?? [];

  const programmeItems = programmes.map((item, index) => {
    const programme = item.program;

    const startDate = createEventDateTime(item.event_date, item.from_time);

    const endDate = createEventDateTime(item.event_date, item.to_time);

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: programme.name,
        url: `${BASE_URL}/programmes/${encodeURIComponent(programme.slug)}`,

        ...(startDate && { startDate }),
        ...(endDate && { endDate }),

        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",

        eventStatus: "https://schema.org/EventScheduled",

        location: {
          "@id": placeId,
        },

        organizer: ORGANIZER,
      },
    };
  });

  return {
    "@context": "https://schema.org",

    "@graph": [
      // 1. Venue detail webpage
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: venue.meta_title || venue.title,
        description,
        inLanguage: "en",

        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },

        mainEntity: {
          "@id": placeId,
        },

        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },

      // 2. Venue information
      {
        "@type": "Place",
        "@id": placeId,
        name: venue.title,
        description: stripHtml(venue.description || ""),
        url: pageUrl,

        ...(venue.featured_image && {
          image: {
            "@type": "ImageObject",
            url: venue.featured_image,
          },
        }),

        ...(venue.google_map_url && {
          hasMap: venue.google_map_url,
        }),

        subjectOf: {
          "@id": programmesId,
        },
      },

      // 3. Programmes / Events at this venue
      {
        "@type": "ItemList",
        "@id": programmesId,
        name: `Programmes at ${venue.title}`,
        description: `Programmes scheduled at ${venue.title} during Serendipity Arts Festival 2026.`,
        numberOfItems: programmeItems.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: programmeItems,
      },

      // 4. Breadcrumbs
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Venues",
            item: `${BASE_URL}/venues`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: venue.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function generateVenueListSchema(venues: VenueListItem[]) {
  const pageUrl = `${BASE_URL}/venues`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Festival Venues | Serendipity Arts Festival 2026",
        description: "Explore the venues of Serendipity Arts Festival across Panjim, Goa.",
        inLanguage: "en",
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
        mainEntity: {
          "@id": `${pageUrl}#venue-list`,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#venue-list`,
        name: "Venues of Serendipity Arts Festival 2026",
        numberOfItems: venues.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: venues.map((venue, index) => {
          const venueUrl = `${BASE_URL}/venues/${encodeURIComponent(venue.slug)}`;

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Place",
              "@id": `${venueUrl}#place`,
              name: venue.title,
              url: venueUrl,
              ...(venue.description && {
                description: stripHtml(venue.description),
              }),
            },
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Venues",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
