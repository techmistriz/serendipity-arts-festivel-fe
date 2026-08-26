import { imagePaths } from "@/config/images";
import type { Programme as ApiProgramme, UIProgramme } from "@/types/programme";

// Map API programme to UI programme format

export function mapApiProgrammeToUi(apiProgramme: ApiProgramme): UIProgramme {
  // Get the first program detail
  const firstDetail = apiProgramme.program_details?.[0];

  // Generate slots from program_details
  const slots = (apiProgramme.program_details ?? []).flatMap((detail) => {
    const day = extractDayFromDate(detail.event_date);

    return day === null ? [] : [{ detailId: detail.id, day, time: formatTime(detail.from_time) }];
  });

  // Get category name
  const category = apiProgramme.category?.name || "Uncategorized";

  // Get venue name (from program_details or fallback)
  const venue = firstDetail?.venue?.title || firstDetail?.venue?.name || "Venue TBA";

  // Get curator (from curator_ids or fallback)
  const curator =
    apiProgramme.curator_ids && apiProgramme.curator_ids.length > 0
      ? `Curator ${apiProgramme.curator_ids.join(", ")}`
      : "TBA";

  // Parse price from amount
  const price = apiProgramme.amount ? parseFloat(apiProgramme.amount) : 0;

  // Get tags (you'll need to map tag IDs to names if you have a lookup)
  const tags = apiProgramme.program_tag_ids?.map((id) => `Tag ${id}`) || [];

  // Extract short description (blurb)
  const blurb = stripHtml(apiProgramme.short_description || "");

  // Extract long description (longBlurb)
  const longBlurb = stripHtml(apiProgramme.description || "") || blurb;

  return {
    id: apiProgramme.id,
    title: apiProgramme.name || "Untitled",
    slug: apiProgramme.slug || "",
    category: category,
    curator: curator,
    slots: slots,
    venue: venue,
    price: price,
    img: apiProgramme.program_image || imagePaths.programmeFallback,
    blurb: blurb,
    longBlurb: longBlurb,
    tags: tags,
    isBookingAllowed: String(apiProgramme.is_booking_allowed) === "1" && slots.length > 0,
    newlyAdded: false,
  };
}

// Map multiple API programmes to UI format

export function mapApiProgrammesToUi(apiProgrammes: ApiProgramme[]): UIProgramme[] {
  if (!apiProgrammes || !Array.isArray(apiProgrammes)) {
    console.warn("[Adapter] No programmes to map");
    return [];
  }

  return apiProgrammes.map(mapApiProgrammeToUi);
}

// Extract day from date string (DD-MM-YYYY)

function extractDayFromDate(dateStr: string): number | null {
  const localDate = /^(\d{1,2})[-/]\d{1,2}[-/]\d{4}$/.exec(dateStr);
  if (localDate) return Number(localDate[1]);

  const isoDate = /^\d{4}-\d{1,2}-(\d{1,2})$/.exec(dateStr);
  return isoDate ? Number(isoDate[1]) : null;
}

// Format time from HH:MM:SS to HH:MM

function formatTime(timeStr: string): string {
  if (!timeStr) return "10:00";
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
