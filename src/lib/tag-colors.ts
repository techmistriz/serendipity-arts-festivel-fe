// Fixed CMYK color mapping for categories, price tiers and tag chips so
// every card reads the same across the site.
// Only these 6 pantones may be used:
//   #B39ECC purple · #2C499F blue · #62C6C2 teal
//   #CEDC29 lime  · #F47521 orange · #F26458 red

type Style = { background: string; color: string };

const INK = "#0A0A0A";
const PAPER = "#FFFFFF";

export const CATEGORY_COLOR: Record<string, Style> = {
  Exhibition: { background: "#B39ECC", color: INK }, // purple
  Performance: { background: "#F26458", color: PAPER }, // red
  Workshop: { background: "#F47521", color: INK }, // orange
  Talk: { background: "#62C6C2", color: INK }, // teal
  "Film Screening": { background: "#2C499F", color: PAPER }, // blue
};

export function categoryStyle(category: string): Style {
  return CATEGORY_COLOR[category] ?? { background: "#CEDC29", color: INK };
}

// Price tier chip — Free vs Guest vs paid all readable at a glance.
export function priceStyle(_priceLabel: string): Style {
  // One single colour for every price chip — Free, Guest and paid alike.
  return { background: "#2C499F", color: PAPER };
}

// Long-form tag chips (18+, INR 499, Music, Dance, …). Same tag → same colour
// in every place it appears, so users learn what each swatch means.
export const TAG_COLOR: Record<string, Style> = {
  // Audience
  "All Ages": { background: "#CEDC29", color: INK },
  "18+": { background: "#F26458", color: PAPER },
  // Price tiers
  Free: { background: "#2C499F", color: PAPER },
  "INR 99": { background: "#2C499F", color: PAPER },
  "INR 249": { background: "#2C499F", color: PAPER },
  "INR 499": { background: "#2C499F", color: PAPER },
  "INR 999": { background: "#2C499F", color: PAPER },
  // Disciplines
  Music: { background: "#2C499F", color: PAPER },
  Dance: { background: "#F26458", color: PAPER },
  Theatre: { background: "#F47521", color: INK },
  "Visual Arts": { background: "#B39ECC", color: INK },
  "Culinary Arts": { background: "#CEDC29", color: INK },
  Crafts: { background: "#F47521", color: INK },
  "Children’s Programmes": { background: "#62C6C2", color: INK },
  Accessibility: { background: "#2C499F", color: PAPER },
};

export function tagStyle(tag: string): Style {
  return TAG_COLOR[tag] ?? { background: "#B39ECC", color: INK };
}
