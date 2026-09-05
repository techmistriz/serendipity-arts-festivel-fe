import { imagePaths } from "@/config/images";
import type {
  Programme as ApiProgramme,
  Programme,
  ProgrammePerson,
  ProgramTag,
  UIProgramme,
} from "@/types/programme";

// Map API programme to UI programme format

export function mapApiProgrammeToUi(
  apiProgramme: ApiProgramme,
  curators: ProgrammePerson[] = [],
  programTags?: ProgramTag[],
): UIProgramme {
  const firstDetail = apiProgramme.program_details?.[0];

  const slots = (apiProgramme.program_details ?? []).flatMap((detail) => {
    const day = extractDayFromDate(detail.event_date);

    return day === null
      ? []
      : [
          {
            detailId: detail.id,
            day,
            fromTime: formatTime(detail.from_time),
            toTime: formatTime(detail.to_time),
          },
        ];
  });

  const category = apiProgramme.category?.name || "Uncategorized";

  const venue = firstDetail?.venue?.title || firstDetail?.venue?.name || "Venue TBA";

  const curator = curators.length > 0 ? curators.map((item) => item.name).join(", ") : "TBA";

  const price = apiProgramme.amount ? parseFloat(apiProgramme.amount) : 0;

  const descriptionHtml = apiProgramme.description || apiProgramme.short_description || "";

  const longBlurb = stripHtml(descriptionHtml) ? descriptionHtml : "";

  const blurb = stripHtml(apiProgramme.short_description || "") || stripHtml(longBlurb);

  // Preserve CMS disclaimer HTML; it is sanitized when rendered in the booking UI.
  const disclaimer = apiProgramme.disclaimer || "";

  return {
    id: apiProgramme.id,
    title: apiProgramme.name || "Untitled",
    slug: apiProgramme.slug || "",
    category,
    curator,
    discipline: apiProgramme.discipline
      ? {
          name: apiProgramme.discipline.name,
          font_color: apiProgramme.discipline.font_color,
          background_color: apiProgramme.discipline.background_color,
        }
      : undefined,
    curators,
    slots,
    venue,
    price,
    img: apiProgramme.program_image || imagePaths.programmeFallback,
    blurb,
    longBlurb,
    disclaimer: disclaimer || undefined,

    // USE the passed programTags parameter instead of apiProgramme.program_tags
    tags: (programTags ?? apiProgramme.program_tags ?? []).filter(
      (tag) => Boolean(tag.name) && Boolean(tag.background_color) && Boolean(tag.font_color),
    ),

    isBookingAllowed: String(apiProgramme.is_booking_allowed) === "1" && slots.length > 0,
    newlyAdded: false,
  };
}

// Map multiple API programmes to UI format

export function mapApiProgrammesToUi(
  apiProgrammes: Programme[],
  curators?: ProgrammePerson[],
): UIProgramme[] {
  return apiProgrammes.map((programme) => mapApiProgrammeToUi(programme, curators));
}

// Extract day from date string (DD-MM-YYYY / DD-MM-YYYY)

function extractDayFromDate(dateStr: string): number | null {
  const localDate = /^(\d{1,2})[-/]\d{1,2}[-/]\d{4}$/.exec(dateStr);

  if (localDate) {
    return Number(localDate[1]);
  }

  const isoDate = /^\d{4}-\d{1,2}-(\d{1,2})$/.exec(dateStr);

  return isoDate ? Number(isoDate[1]) : null;
}

// Format time from HH:MM:SS to HH:MM

function formatTime(timeStr: string): string {
  if (!timeStr) return "";

  return timeStr.substring(0, 5);
}

// Strip HTML tags from string

function stripHtml(html: string): string {
  if (!html) return "";

  if (typeof window === "undefined") {
    // Server-side: use a simple regex
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const tmp = document.createElement("div");

  tmp.innerHTML = html;

  return tmp.textContent || tmp.innerText || "";
}
