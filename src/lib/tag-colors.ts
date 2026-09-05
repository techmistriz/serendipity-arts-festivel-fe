import {
  CATEGORY_COLOR,
  DEFAULT_TAG_STYLE,
  PRICE_TAG_STYLE,
  TAG_COLOR,
  type TagStyle,
} from "@/data/tag-colors";

export function categoryStyle(category: string): TagStyle {
  return CATEGORY_COLOR[category] ?? DEFAULT_TAG_STYLE;
}

export function priceStyle(priceLabel: string): TagStyle {
  void priceLabel;
  return PRICE_TAG_STYLE;
}

export function tagStyle(tag: string): TagStyle {
  return TAG_COLOR[tag] ?? DEFAULT_TAG_STYLE;
}

export function disciplineStyle(discipline: {
  name: string;
  font_color: string;
  background_color: string;
}): TagStyle {
  return {
    color: discipline.font_color,
    background: discipline.background_color,
  };
}
