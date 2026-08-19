export function getCuratorFilterClassName(isSelected: boolean, hasActiveFilter: boolean) {
  if (isSelected) {
    return "display text-sm leading-none text-foreground underline decoration-2 decoration-accent underline-offset-[6px] uppercase transition-colors md:text-lg";
  }

  return `display text-sm leading-none uppercase transition-colors md:text-lg ${
    hasActiveFilter
      ? "text-muted-foreground/60 hover:text-foreground"
      : "text-foreground hover:text-accent"
  }`;
}
