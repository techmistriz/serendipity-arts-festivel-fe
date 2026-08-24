import type { Programme as ApiProgramme } from "@/types/programme";
import type { Programme as UiProgramme } from "@/data/programmes-data";

function stripHtml(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .trim();
}

function parsePrice(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const price = Number(value);

  return Number.isFinite(price) ? price : 0;
}

function buildSlots(programme: ApiProgramme): UiProgramme["slots"] {
  // API does not always provide date/time.
  if (!programme.event_date || !programme.from_time) {
    return [];
  }

  const date = new Date(programme.event_date);

  if (Number.isNaN(date.getTime())) {
    return [];
  }

  return [
    {
      day: date.getDate(),
      time: programme.from_time.slice(0, 5),
    },
  ];
}

export function mapApiProgrammeToUi(programme: ApiProgramme): UiProgramme {
  const price = parsePrice(programme.amount);

  const category = programme.category?.name ?? programme.discipline?.name ?? "Programme";

  const venue = programme.program_city?.name ?? "";

  const blurb = stripHtml(programme.short_description);
  const longBlurb = stripHtml(programme.description);

  return {
    id: String(programme.id),
    title: programme.name,
    img: programme.program_image,

    price,

    category,
    venue,

    curator: "",

    tags: [],

    slots: buildSlots(programme),

    blurb,
    longBlurb: longBlurb || undefined,

    newlyAdded: false,

    addOns: [],
    includes: [],
  };
}

export function mapApiProgrammesToUi(programmes: ApiProgramme[]): UiProgramme[] {
  return programmes.map(mapApiProgrammeToUi);
}
