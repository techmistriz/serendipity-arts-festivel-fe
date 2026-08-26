// Shared programme data used by /programmes, /venues and /curators
// so the site can show "what’s on at this venue" and "what X is curating".
import { images } from "@/config/images";
import type { StaticImageData } from "next/image";

export type Slot = { day: number; time: string };
/** A sub-programme that is automatically part of a day pass / bundle booking. */
export type IncludedItem = {
  title: string;
  time: string;
  category: string;
  note?: string;
  refId?: string;
};
/** Optional extended / micro programming that can be added on at booking time. */
export type AddOn = {
  id: string;
  title: string;
  category: string;
  day: number;
  time: string;
  price: number;
  blurb?: string;
};
export type Programme = {
  id: string;
  /** Stable id override so bundles/add-ons can reference this programme. */
  slug?: string;
  title: string;
  curator: string;
  category: "Exhibition" | "Performance" | "Workshop" | "Talk" | "Film Screening";
  slots: Slot[];
  venue: string;
  price: number;
  img: string | StaticImageData;
  blurb: string;
  longBlurb?: string;
  tags: string[];
  newlyAdded?: boolean;
  includes?: IncludedItem[];
  addOns?: AddOn[];
};

const IMAGES = [...images.programmes.samples, ...images.curators.samples, ...images.venues.samples];

export const KAVAN_LONG = `In a rapidly changing India, young Bejul and those around him navigate their dreams, desires, and dilemmas while also negotiating the complex terrains of caste and class. Kavan is an operatic satire, written and performed entirely in poetry and song, capturing the young Ambedkarite experience.

Duration: 150 mins
Note: The end time is approximate and may vary slightly.

Disclaimer: Kindly arrive at least 15 minutes before the scheduled start time. Latecomers may be denied entry once the programme has begun.`;

const RAW: (Omit<Programme, "id" | "img"> & { img?: string })[] = [
  {
    title: "Kavan — An Ambedkarite Opera",
    newlyAdded: true,
    curator: "Abhishek Majumdar",
    category: "Performance",
    slots: [{ day: 14, time: "19:30" }],
    venue: "Arena at DB Ground",
    price: 499,
    blurb:
      "An operatic satire in poetry and song, capturing the young Ambedkarite experience in a rapidly changing India.",
    longBlurb: KAVAN_LONG,
    tags: ["18+", "INR 499", "Theatre", "Music"],
  },
  {
    title: "Bodies in Translation",
    curator: "Ashley Lobo",
    category: "Performance",
    slots: [
      { day: 13, time: "14:00" },
      { day: 13, time: "18:00" },
    ],
    venue: "Samba Square",
    price: 499,
    blurb:
      "A choreographic essay on migration and the moving archive — an evening of dance that treats the body as a shifting document.",
    tags: ["18+", "INR 499", "Dance"],
  },
  {
    title: "The Weight of Silence",
    curator: "Latika Gupta",
    category: "Exhibition",
    slots: [{ day: 13, time: "10:00" }],
    venue: "The Old GMC Complex",
    price: 0,
    blurb:
      "Twenty-eight artists on absence, redaction and the unsaid. An eight-day exhibition across three floors of the Old GMC.",
    tags: ["All Ages", "Free", "Visual Arts", "Accessibility"],
  },
  {
    title: "Hands That Remember",
    curator: "Sudhir Rajbhar",
    category: "Workshop",
    slots: [
      { day: 13, time: "11:00" },
      { day: 16, time: "11:00" },
      { day: 18, time: "11:00" },
    ],
    venue: "Directorate of Accounts",
    price: 499,
    blurb:
      "A recurring workshop in tactile memory with three master craftspeople — clay, cane and lac.",
    tags: ["All Ages", "INR 499", "Crafts"],
  },
  {
    title: "A River, Rehearsed",
    curator: "Aruna Sairam",
    category: "Performance",
    slots: [
      { day: 13, time: "18:00" },
      { day: 18, time: "17:00" },
      { day: 20, time: "21:00" },
    ],
    venue: "Promenade",
    price: 499,
    blurb: "An open-air concert reading the Mandovi as a musical score.",
    tags: ["All Ages", "INR 499", "Music"],
  },
  {
    title: "Ground Plans",
    curator: "Latika Gupta",
    category: "Exhibition",
    slots: [{ day: 13, time: "10:00" }],
    venue: "Directorate of Accounts",
    price: 0,
    blurb:
      "Site-specific installations across the disused administrative grounds — architecture as a set of unfinished sentences.",
    tags: ["All Ages", "Free", "Visual Arts"],
  },
  {
    title: "Notes on Return",
    curator: "Anuradha Kapur",
    category: "Talk",
    slots: [{ day: 18, time: "19:00" }],
    venue: "ESG Building",
    price: 99,
    blurb: "A conversation on diasporic longing and its rehearsed forgetting.",
    tags: ["18+", "INR 99", "Theatre"],
  },
  {
    title: "Salt & Signal",
    curator: "Mahesh Dattani",
    category: "Film Screening",
    slots: [{ day: 15, time: "17:00" }],
    venue: "ESG Building",
    price: 249,
    blurb: "A short-film programme on estuaries and edges, curated across five countries.",
    tags: ["All Ages", "INR 249", "Visual Arts"],
  },
  {
    title: "Kitchen as Studio",
    newlyAdded: true,
    curator: "Anisha Rachel Oommen",
    category: "Workshop",
    slots: [{ day: 16, time: "13:00" }],
    venue: "Art Park",
    price: 499,
    blurb: "A tasting-and-conversation on Goan foodways as artistic practice.",
    tags: ["18+", "INR 499", "Culinary Arts"],
  },
  {
    title: "Field Recordings",
    curator: "Ankur Tewari",
    category: "Performance",
    slots: [{ day: 15, time: "19:00" }],
    venue: "Samba Square",
    price: 499,
    blurb: "Vocal traditions of coastal Konkan, staged as an acoustic archive.",
    tags: ["All Ages", "INR 499", "Music"],
  },
  {
    title: "After the Frame",
    curator: "Sheba Chhachhi",
    category: "Exhibition",
    slots: [{ day: 13, time: "10:00" }],
    venue: "The Old GMC Complex",
    price: 0,
    blurb:
      "Photography that resists the photograph — a survey of contemporary Indian image-makers.",
    tags: ["All Ages", "Free", "Visual Arts", "Accessibility"],
  },
  {
    title: "Type as Argument",
    curator: "Latika Gupta",
    category: "Talk",
    slots: [{ day: 19, time: "16:00" }],
    venue: "Directorate of Accounts",
    price: 99,
    blurb: "A talk on Devanagari, dissent and the letterform.",
    tags: ["18+", "INR 99", "Visual Arts"],
  },
  {
    title: "The Long Rehearsal",
    curator: "Anuradha Kapur",
    category: "Performance",
    slots: [{ day: 20, time: "19:30" }],
    venue: "Arena at DB Ground",
    price: 499,
    blurb: "Closing night: an ensemble piece on endings that don’t end.",
    tags: ["18+", "INR 499", "Theatre"],
  },
  {
    title: "River Songs (Late Night)",
    curator: "Aruna Sairam",
    category: "Performance",
    slots: [{ day: 19, time: "22:00" }],
    venue: "Promenade",
    price: 499,
    blurb: "A candlelit set on the promenade with strings and voice.",
    tags: ["18+", "INR 499", "Music"],
  },
  {
    title: "Warp / Weft",
    curator: "Kshitij Jalori",
    category: "Exhibition",
    slots: [{ day: 13, time: "10:00" }],
    venue: "Art Park",
    price: 0,
    blurb: "Handloom as thinking. Fifteen weavers, one long conversation.",
    tags: ["All Ages", "Free", "Crafts"],
  },
  {
    title: "Cities That Listen",
    curator: "Salil Chaturvedi",
    category: "Talk",
    slots: [{ day: 14, time: "15:00" }],
    venue: "Directorate of Accounts",
    price: 99,
    blurb: "A conversation on cities designed as instruments of hearing.",
    tags: ["All Ages", "INR 99", "Accessibility"],
  },
  {
    title: "Street Sound Lab",
    curator: "Ankur Tewari",
    category: "Workshop",
    slots: [{ day: 17, time: "11:00" }],
    venue: "Promenade",
    price: 249,
    blurb: "Field-recording the city as compositional material.",
    tags: ["All Ages", "INR 249", "Music"],
  },
  {
    title: "Bread & Salt",
    curator: "Anisha Rachel Oommen",
    category: "Workshop",
    slots: [{ day: 18, time: "12:00" }],
    venue: "Art Park",
    price: 499,
    blurb: "A shared table on Goan hospitality as a curatorial gesture.",
    tags: ["All Ages", "INR 499", "Culinary Arts"],
  },
  {
    title: "Little Hands, Big Ideas",
    newlyAdded: true,
    curator: "Padmini Chettur",
    category: "Workshop",
    slots: [{ day: 20, time: "10:00" }],
    venue: "Art Park",
    price: 249,
    blurb: "A dance and movement workshop for children.",
    tags: ["All Ages", "INR 249", "Children’s Programmes", "Dance"],
  },
  {
    title:
      "The Flavour Playground: Whiskey, Gin and Everything Together — A Late-Night Tasting Journey with Sarif Alam and Friends",
    curator: "Anisha Rachel Oommen",
    category: "Workshop",
    slots: [{ day: 17, time: "21:00" }],
    venue: "Samba Square",
    price: 999,
    blurb:
      "A late-night guided tasting stretching the vocabulary of spirits, water, ice and conversation into an unhurried performance for the senses.",
    tags: ["18+", "INR 999", "Culinary Arts"],
  },
  {
    title:
      "Cartographies of the Interior: An Extended Meditation on Rooms, Corridors, Thresholds and the Small Architectures We Build to Hold a Life",
    curator: "Latika Gupta",
    category: "Exhibition",
    slots: [{ day: 13, time: "10:00" }],
    venue: "The Old GMC Complex",
    price: 0,
    blurb: "A room-by-room installation reading domestic space as a slow, autobiographical map.",
    tags: ["All Ages", "Free", "Visual Arts"],
  },
  {
    title:
      "How to Listen to a City That Refuses to Sit Still — A Walking Sound-Essay Across Panjim’s Backstreets, Balconies and Bridges",
    curator: "Ankur Tewari",
    category: "Workshop",
    slots: [{ day: 16, time: "07:00" }],
    venue: "Promenade",
    price: 249,
    blurb:
      "A guided dawn walk composed of stops, silences and field recordings gathered live along the way.",
    tags: ["All Ages", "INR 249", "Music", "Accessibility"],
  },
  {
    title:
      "Everything We Never Said Out Loud, Rehearsed for an Audience of Strangers on a Thursday Evening",
    curator: "Anuradha Kapur",
    category: "Performance",
    slots: [{ day: 17, time: "19:30" }],
    venue: "Arena at DB Ground",
    price: 499,
    blurb:
      "Twelve performers, one long confession, staged as an ensemble piece about the things withheld.",
    tags: ["18+", "INR 499", "Theatre"],
  },
  {
    title:
      "A Very Slow Cinema Programme: Seven Hours of Water, Weather and Waiting, Screened Without Intermission",
    curator: "Mahesh Dattani",
    category: "Film Screening",
    slots: [{ day: 19, time: "12:00" }],
    venue: "ESG Building",
    price: 249,
    blurb: "An endurance screening for viewers who want time to move differently.",
    tags: ["18+", "INR 249", "Visual Arts"],
  },
  {
    title: "Two Rivers, One Evening",
    curator: "Aruna Sairam",
    category: "Performance",
    slots: [{ day: 14, time: "19:30" }],
    venue: "Samba Square",
    price: 499,
    blurb:
      "A duet of Carnatic and Konkani repertoires staged as a single evening-long conversation.",
    tags: ["All Ages", "INR 499", "Music"],
  },
  {
    title: "Night Study: Lines and Lanterns",
    curator: "Sudhir Rajbhar",
    category: "Workshop",
    slots: [{ day: 14, time: "19:30" }],
    venue: "Art Park",
    price: 249,
    blurb: "A lamp-lit drawing session in the park, working only from shadow.",
    tags: ["All Ages", "INR 249", "Crafts"],
  },
  {
    title: "The Same Hour Elsewhere",
    curator: "Mahesh Dattani",
    category: "Film Screening",
    slots: [{ day: 17, time: "19:30" }],
    venue: "ESG Building",
    price: 249,
    blurb: "Three films about simultaneity, screened at the exact hour they depict.",
    tags: ["18+", "INR 249", "Visual Arts"],
  },
  // Day pass: one booking covers everything programmed at the Arena that day.
  {
    title: "Day 4 at the Arena",
    newlyAdded: true,
    curator: "Abhishek Majumdar",
    category: "Performance",
    slots: [{ day: 16, time: "16:00" }],
    venue: "Arena at DB Ground",
    price: 799,
    blurb:
      "One pass, one evening, three programmes at the Arena — book the day and everything on it is yours.",
    longBlurb:
      "Day 4 at the Arena is programmed as a single continuous evening. Booking the day admits you to all three programmes listed below; there is no separate ticket for each.",
    tags: ["18+", "INR 799", "Theatre", "Music"],
    includes: [
      {
        title: "Opening Set: Drums of the Coast",
        time: "16:00",
        category: "Performance",
        refId: "day4-drums",
      },
      {
        title: "The Interval Play",
        time: "18:00",
        category: "Theatre",
        note: "45 mins",
        refId: "day4-interval",
      },
      { title: "Night Raga at the Arena", time: "20:30", category: "Music", refId: "day4-raga" },
    ],
  },
  // Main programme with extended / micro programming offered as an add-on.
  {
    title: "The Quiet Loom",
    curator: "Kshitij Jalori",
    category: "Exhibition",
    slots: [{ day: 15, time: "11:00" }],
    venue: "Directorate of Accounts",
    price: 299,
    blurb:
      "An exhibition of slow textile practice, with an optional hands-on micro-workshop alongside it.",
    tags: ["All Ages", "INR 299", "Crafts"],
    addOns: [
      {
        id: "micro-loom-lab",
        title: "Micro-Workshop: Dyeing with What’s Left Over",
        category: "Workshop",
        day: 15,
        time: "15:00",
        price: 199,
        blurb:
          "A 90-minute extension of the exhibition — natural dyeing with kitchen and market waste, led by two of the exhibiting weavers.",
      },
    ],
  },
  // Sub-programmes of the Day 4 pass — each has its own page, but is covered
  // by the day booking rather than sold separately.
  {
    slug: "day4-drums",
    title: "Opening Set: Drums of the Coast",
    curator: "Abhishek Majumdar",
    category: "Performance",
    slots: [{ day: 16, time: "16:00" }],
    venue: "Arena at DB Ground",
    price: 0,
    blurb:
      "Coastal percussion ensembles open the Arena evening. Covered by the Day 4 at the Arena pass.",
    tags: ["All Ages", "Free", "Music"],
  },
  {
    slug: "day4-interval",
    title: "The Interval Play",
    curator: "Abhishek Majumdar",
    category: "Performance",
    slots: [{ day: 16, time: "18:00" }],
    venue: "Arena at DB Ground",
    price: 0,
    blurb:
      "A 45-minute play staged in the gap between two concerts. Covered by the Day 4 at the Arena pass.",
    tags: ["18+", "Free", "Theatre"],
  },
  {
    slug: "day4-raga",
    title: "Night Raga at the Arena",
    curator: "Abhishek Majumdar",
    category: "Performance",
    slots: [{ day: 16, time: "20:30" }],
    venue: "Arena at DB Ground",
    price: 0,
    blurb: "A late-night raga to close Day 4. Covered by the Day 4 at the Arena pass.",
    tags: ["All Ages", "Free", "Music"],
  },
  // Extended / micro programming attached to The Quiet Loom, also bookable alone.
  {
    slug: "micro-loom-lab",
    title: "Micro-Workshop: Dyeing with What’s Left Over",
    curator: "Kshitij Jalori",
    category: "Workshop",
    slots: [{ day: 15, time: "15:00" }],
    venue: "Directorate of Accounts",
    price: 199,
    blurb:
      "A 90-minute extension of The Quiet Loom — natural dyeing with kitchen and market waste, led by two of the exhibiting weavers.",
    tags: ["All Ages", "INR 199", "Crafts"],
  },
];

export const PROGRAMMES: Programme[] = RAW.map((p, i) => ({
  ...p,
  id: p.slug ?? `saf-${i + 1}`,
  img: p.img ?? IMAGES[i % IMAGES.length],
}));

export const programmeById = (id?: string) =>
  id ? PROGRAMMES.find((p) => p.id === id) : undefined;

export const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
};
const addMinutes = (t: string, mins: number) => {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
};
export const fmtTimeShort = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")}`;
};
export const slotEnd = (s: Slot, durationMin = 90) => addMinutes(s.time, durationMin);
export const fmtTimeRange = (s: Slot, durationMin = 90) => {
  const end = slotEnd(s, durationMin);
  const [eh] = end.split(":").map(Number);
  const period = eh >= 12 ? "PM" : "AM";
  return `${fmtTimeShort(s.time)} – ${fmtTimeShort(end)} ${period}`;
};
export const fmtSlot = (s: Slot) => `${s.day} Dec · ${fmtTimeRange(s)}`;
export const dateLabel = (p: Programme) => {
  const uniqDays = Array.from(new Set(p.slots.map((s) => s.day))).sort((a, b) => a - b);
  if (uniqDays.length === 1) return `${uniqDays[0]} Dec`;
  if (uniqDays.length >= 6) return `${uniqDays[0]}–${uniqDays[uniqDays.length - 1]} Dec`;
  return uniqDays.join(", ") + " Dec";
};
export const timeLabel = (p: Programme) => fmtTimeRange(p.slots[0]);

export const programmesByVenue = (venue: string) => PROGRAMMES.filter((p) => p.venue === venue);

export const programmesByCurator = (curator: string) =>
  PROGRAMMES.filter((p) => p.curator === curator);

// Related = same category OR shares a tag OR shares curator, excluding self.
export const relatedProgrammes = (p: Programme, limit = 3) => {
  const tagSet = new Set(p.tags);
  const scored = PROGRAMMES.filter((x) => x.id !== p.id).map((x) => {
    let score = 0;
    if (x.curator === p.curator) score += 3;
    if (x.category === p.category) score += 2;
    for (const t of x.tags) if (tagSet.has(t)) score += 1;
    return { p: x, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.p);
};
