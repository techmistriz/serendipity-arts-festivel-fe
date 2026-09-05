export type TagStyle = { background: string; color: string };

const INK = "#0A0A0A";
const PAPER = "#FFFFFF";

export const DEFAULT_TAG_STYLE: TagStyle = { background: "#B39ECC", color: INK };
export const PRICE_TAG_STYLE: TagStyle = { background: "#2C499F", color: PAPER };

export const CATEGORY_COLOR: Record<string, TagStyle> = {
  Exhibition: { background: "#B39ECC", color: INK },
  Performance: { background: "#F26458", color: PAPER },
  Workshop: { background: "#F47521", color: INK },
  Talk: { background: "#62C6C2", color: INK },
  "Film Screening": { background: "#2C499F", color: PAPER },
};

export const TAG_COLOR: Record<string, TagStyle> = {
  "All Ages": { background: "#CEDC29", color: INK },
  "18+": { background: "#F26458", color: PAPER },
  Free: PRICE_TAG_STYLE,
  "INR 99": PRICE_TAG_STYLE,
  "INR 249": PRICE_TAG_STYLE,
  "INR 499": PRICE_TAG_STYLE,
  "INR 999": PRICE_TAG_STYLE,
  Music: PRICE_TAG_STYLE,
  Dance: { background: "#F26458", color: PAPER },
  Theatre: { background: "#F47521", color: INK },
  "Visual Arts": { background: "#B39ECC", color: INK },
  "Culinary Arts": { background: "#CEDC29", color: INK },
  Crafts: { background: "#F47521", color: INK },
  "Children’s Programmes": { background: "#62C6C2", color: INK },
  Accessibility: PRICE_TAG_STYLE,
};
