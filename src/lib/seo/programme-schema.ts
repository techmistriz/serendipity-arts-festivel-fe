import { stripHtml } from "@/utils/html";
import type { Programme, ProgramDetail, ProgramTag } from "@/types/programme";

const BASE_URL = "https://www.serendipityartsfestival.com";

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Serendipity Arts",
  url: `${BASE_URL}/`,
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: `${BASE_URL}/`,
  name: "Serendipity Arts Festival",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "en",
};

function getProgrammeDescription(programme: Programme): string {
  return (
    stripHtml(programme.short_description || "") ||
    stripHtml(programme.description || "") ||
    `Discover ${programme.name} at Serendipity Arts Festival 2026.`
  );
}

function getProgrammeUrl(slug: string): string {
  return `${BASE_URL}/programmes/${encodeURIComponent(slug)}`;
}

function getPrice(amount: string | number | null): number | undefined {
  if (amount === null || String(amount).trim() === "") return undefined;

  const price = Number(amount);

  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

/**
 * API date: 14-12-2026
 * API time: 17:00:00
 * Output: 2026-12-14T17:00:00+05:30
 */
function createDateTime(
  eventDate: string | null | undefined,
  eventTime: string | null | undefined,
): string | undefined {
  if (!eventDate || !eventTime) return undefined;

  const dateMatch = eventDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const timeMatch = eventTime.match(/^(\d{2}):(\d{2}):(\d{2})$/);

  if (!dateMatch || !timeMatch) return undefined;

  const [, day, month, year] = dateMatch;
  const [, hours, minutes, seconds] = timeMatch;

  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }

  if (Number(hours) > 23 || Number(minutes) > 59 || Number(seconds) > 59) {
    return undefined;
  }

  return `${year}-${month}-${day}T${eventTime}+05:30`;
}

function getKeywords(tags: ProgramTag[] | undefined, programme: Programme): string[] {
  return [
    ...(tags ?? []).map((tag) => tag.name),
    programme.category?.name,
    programme.discipline?.name,
    "Serendipity Arts Festival",
  ].filter((value): value is string => Boolean(value));
}

type ProgrammeDetailData = {
  program: Programme;
  program_tags?: ProgramTag[];
  artists?: { id: number; name: string }[];
};

function createOffer(programme: Programme, pageUrl: string): Record<string, unknown> | undefined {
  const price = getPrice(programme.amount);

  if (price === undefined) return undefined;

  const availability = programme.is_sold
    ? "https://schema.org/SoldOut"
    : programme.is_booking_allowed === 1
      ? "https://schema.org/InStock"
      : undefined;

  return {
    "@type": "Offer",
    url: pageUrl,
    price: String(price),
    priceCurrency: "INR",
    ...(availability && { availability }),
  };
}

function createEvent(
  programme: Programme,
  detail: ProgramDetail | undefined,
  index: number,
  totalEvents: number,
  pageUrl: string,
  artists: { id: number; name: string }[],
  tags: ProgramTag[] | undefined,
) {
  const eventId =
    totalEvents === 1 ? `${pageUrl}#event` : `${pageUrl}#event-${detail?.id ?? index + 1}`;

  const startDate = createDateTime(detail?.event_date, detail?.from_time);

  const endDate = createDateTime(detail?.event_date, detail?.to_time);

  const venueName = detail?.sub_venue?.title || detail?.venue?.title || detail?.venue?.name;

  const price = getPrice(programme.amount);
  const offer = createOffer(programme, pageUrl);

  return {
    "@type": "Event",
    "@id": eventId,
    name: programme.name,
    description: getProgrammeDescription(programme),
    url: pageUrl,

    ...(programme.program_image && {
      image: [programme.program_image],
    }),

    ...(startDate && { startDate }),
    ...(endDate && { endDate }),

    ...(startDate && {
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    }),

    ...(price !== undefined && {
      isAccessibleForFree: price === 0,
    }),

    inLanguage: "en",
    keywords: getKeywords(tags, programme),

    ...(venueName && {
      location: {
        "@type": "Place",
        name: venueName,
      },
    }),

    organizer: {
      "@id": `${BASE_URL}/#organization`,
    },

    ...(artists.length > 0 && {
      performer: artists.map((artist) => ({
        "@type": "Person",
        name: artist.name,
      })),
    }),

    ...(offer && { offers: offer }),

    mainEntityOfPage: {
      "@id": `${pageUrl}#webpage`,
    },
  };
}

export function generateProgrammeDetailSchema(data: ProgrammeDetailData, slug: string) {
  const programme = data.program;
  const pageUrl = getProgrammeUrl(slug);
  const events = (programme.program_details ?? []).filter(
    (detail) => detail.status === 1 && !detail.deleted_at,
  );

  // Create one Event for every active programme session.
  const eventDetails = events.length > 0 ? events : [undefined];

  const eventSchemas = eventDetails.map((detail, index) =>
    createEvent(
      programme,
      detail,
      index,
      eventDetails.length,
      pageUrl,
      data.artists ?? [],
      data.program_tags ?? programme.program_tags,
    ),
  );

  const eventListId = `${pageUrl}#events`;
  const mainEntity =
    eventSchemas.length === 1 ? { "@id": eventSchemas[0]["@id"] } : { "@id": eventListId };

  return {
    "@context": "https://schema.org",

    "@graph": [
      ORGANIZATION,
      WEBSITE,

      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: programme.meta_title || programme.name,
        description: getProgrammeDescription(programme),
        inLanguage: "en",
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
        mainEntity,
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },

      ...eventSchemas,

      ...(eventSchemas.length > 1
        ? [
            {
              "@type": "ItemList",
              "@id": eventListId,
              name: `${programme.name} Sessions`,
              numberOfItems: eventSchemas.length,
              itemListOrder: "https://schema.org/ItemListUnordered",
              itemListElement: eventSchemas.map((event, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@id": event["@id"],
                },
              })),
            },
          ]
        : []),

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
            name: "Programmes",
            item: `${BASE_URL}/programmes`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: programme.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function generateProgrammeListSchema(programmes: Programme[]) {
  const pageUrl = `${BASE_URL}/programmes`;

  return {
    "@context": "https://schema.org",

    "@graph": [
      ORGANIZATION,
      WEBSITE,

      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Programmes | Serendipity Arts Festival",
        description:
          "Explore performances, exhibitions, workshops, talks and film screenings at Serendipity Arts Festival 2026 in Panjim, Goa.",
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
        about: {
          "@id": `${BASE_URL}/#organization`,
        },
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        inLanguage: "en",
        mainEntity: {
          "@id": `${pageUrl}#itemlist`,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },

      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Serendipity Arts Festival Programmes",
        description: "A collection of programmes and events featured at Serendipity Arts Festival.",
        numberOfItems: programmes.length,
        itemListOrder: "https://schema.org/ItemListUnordered",

        itemListElement: programmes.map((programme, index) => {
          const programmeUrl = getProgrammeUrl(programme.slug);

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Event",
              "@id": `${programmeUrl}#event`,
              name: programme.name,
              url: programmeUrl,
              description: getProgrammeDescription(programme),

              ...(programme.program_image && {
                image: programme.program_image,
              }),

              ...(programme.category?.name && {
                genre: programme.category.name,
              }),

              ...(programme.discipline?.name && {
                about: programme.discipline.name,
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
            name: "Programmes",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
