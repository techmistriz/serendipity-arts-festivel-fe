import { stripHtml } from "@/utils/html";
import type { CuratorDetailData, CuratorListItem } from "@/types/curator";

const BASE_URL = "https://www.serendipityartsfestival.com";

const ORGANIZER = {
  "@type": "Organization",
  name: "Serendipity Arts Festival",
  url: `${BASE_URL}/`,
};

/**
 * Converts API date into ISO 8601 date format.
 *
 * API date: 13-12-2026
 * Output: 2026-12-13
 */
function createEventDate(eventDate: string | null): string | undefined {
  if (!eventDate) return undefined;

  const dateMatch = eventDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);

  if (!dateMatch) return undefined;

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

  return `${year}-${month}-${day}`;
}

type CuratorDetailSchemaInput = {
  data: CuratorDetailData;
  slug: string;
  description: string;
};

export function generateCuratorDetailSchema({ data, slug, description }: CuratorDetailSchemaInput) {
  const curator = data.curator;

  const pageUrl = `${BASE_URL}/curators/${encodeURIComponent(slug)}`;
  const personId = `${pageUrl}#person`;
  const programmesId = `${pageUrl}#programmes`;

  // Create one Event for every valid programme event date.
  const programmeItems = (data.programs ?? []).flatMap((program) => {
    // Remove duplicate dates within the same programme.
    const dates = [
      ...new Set(
        (program.program_details ?? [])
          .map((detail) => detail.event_date)
          .filter((date): date is string => Boolean(date)),
      ),
    ];

    return dates
      .map((eventDate) => createEventDate(eventDate))
      .filter((date): date is string => Boolean(date))
      .map((startDate) => ({
        "@type": "ListItem",
        item: {
          "@type": "Event",
          name: program.name,
          url: `${BASE_URL}/programmes?p=${program.id}`,
          startDate,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          organizer: ORGANIZER,
        },
      }));
  });

  return {
    "@context": "https://schema.org",

    "@graph": [
      // 1. Curator detail webpage
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: curator.meta_title || curator.name,
        description,
        inLanguage: "en",

        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },

        mainEntity: {
          "@id": personId,
        },

        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },

      // 2. Curator information
      {
        "@type": "Person",
        "@id": personId,
        name: curator.name,
        url: pageUrl,
        jobTitle: "Curator",

        ...(curator.short_description && {
          description: curator.short_description,
        }),

        ...(curator.curator_image && {
          image: {
            "@type": "ImageObject",
            url: curator.curator_image,
          },
        }),

        ...(curator.discipline?.name && {
          knowsAbout: curator.discipline.name,
        }),

        ...(curator.bio && {
          disambiguatingDescription: stripHtml(curator.bio),
        }),

        ...(curator.instagram_link && {
          sameAs: [curator.instagram_link],
        }),

        subjectOf: {
          "@id": programmesId,
        },
      },

      // 3. Programmes curated by this person
      {
        "@type": "ItemList",
        "@id": programmesId,
        name: `Programmes curated by ${curator.name}`,
        description: `Programmes curated by ${curator.name} at Serendipity Arts Festival 2026.`,
        numberOfItems: programmeItems.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: programmeItems.map((item, index) => ({
          ...item,
          position: index + 1,
        })),
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
            name: "Curators",
            item: `${BASE_URL}/curators`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: curator.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function generateCuratorListSchema(curators: CuratorListItem[]) {
  const pageUrl = `${BASE_URL}/curators`;

  return {
    "@context": "https://schema.org",

    "@graph": [
      // 1. Curator listing webpage
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Festival Curators | Serendipity Arts Festival 2026",
        description:
          "Meet the curators of Serendipity Arts Festival 2026 and explore the disciplines they represent.",
        inLanguage: "en",

        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },

        mainEntity: {
          "@id": `${pageUrl}#curator-list`,
        },

        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },

      // 2. Curator list
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#curator-list`,
        name: "Curators of Serendipity Arts Festival 2026",
        numberOfItems: curators.length,
        itemListOrder: "https://schema.org/ItemListUnordered",

        itemListElement: curators.map((curator, index) => {
          const curatorUrl = `${BASE_URL}/curators/${encodeURIComponent(curator.slug)}`;

          return {
            "@type": "ListItem",
            position: index + 1,

            item: {
              "@type": "Person",
              "@id": `${curatorUrl}#person`,
              name: curator.name,
              url: curatorUrl,
              jobTitle: "Curator",

              ...(curator.short_description && {
                description: curator.short_description,
              }),

              ...(curator.curator_image && {
                image: {
                  "@type": "ImageObject",
                  url: curator.curator_image,
                },
              }),

              ...(curator.discipline?.name && {
                knowsAbout: curator.discipline.name,
              }),
            },
          };
        }),
      },

      // 3. Breadcrumbs
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
            name: "Curators",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
