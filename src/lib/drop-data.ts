// Programmes announced but not yet released. They stay locked until the drop.
export type DropItem = {
  title: string;
  venue: "Azad Maidan" | "The Old GMC Complex";
  note?: string;
};

/** Drop moment — IST evening. */
export const DROP_AT = new Date("2026-09-19T00:00:00+05:30");

export const DROP_ITEMS: DropItem[] = [
  { title: "Horse Woman River", venue: "Azad Maidan" },
  { title: "The Long Strong Happy Death", venue: "The Old GMC Complex" },
  { title: "Unframed", venue: "Azad Maidan" },
  { title: "Sudan", venue: "The Old GMC Complex" },
  { title: "Ranj + Clifr", venue: "Azad Maidan" },
  {
    title: "Goa's Best Kept Secret: Konkani Muslim Cuisine — Sea Food Biryani",
    venue: "The Old GMC Complex",
  },
  {
    title: "Smoke, Salt & Memory: Recreating Karwar's Hay-Smoked Mackerel in an Urban Kitchen",
    venue: "Azad Maidan",
  },
  { title: "hey, i think we forgot something...", venue: "The Old GMC Complex" },
  { title: "One Part Woman", venue: "Azad Maidan", note: "Subject to confirmation" },
  { title: "Home-sick", venue: "The Old GMC Complex" },
];
