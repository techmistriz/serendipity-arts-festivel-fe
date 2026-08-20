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

export const PROGRAMME_CATEGORIES = [
  "All",
  "Exhibition",
  "Performance",
  "Workshop",
  "Talk",
  "Film Screening",
] as const;

export const PROGRAMME_DAYS = [13, 14, 15, 16, 17, 18, 19, 20];

export const PROGRAMME_VENUES = [
  "The Old GMC Complex",
  "Art Park",
  "Promenade",
  "Samba Square",
  "Arena at DB Ground",
  "ESG Building",
  "Directorate of Accounts",
];

export const PROGRAMME_TAGS = [
  "All Ages",
  "18+",
  "Free",
  "INR 99",
  "INR 249",
  "INR 499",
  "Music",
  "Dance",
  "Theatre",
  "Visual Arts",
  "Culinary Arts",
  "Crafts",
  "Children’s Programmes",
  "Accessibility",
];

export const PROGRAMMES_PER_PAGE = 12;
