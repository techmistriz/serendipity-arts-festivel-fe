import { GlitchBorder } from "@/components/common/GlitchBorder";

import type { CuratorListItem } from "../types";
import { CuratorImage } from "./CuratorImage";

type CuratorCardProps = {
  curator: CuratorListItem;
  onOpen: (curator: CuratorListItem) => void;
  disabled: boolean;
};

export function CuratorCard({ curator, onOpen, disabled }: CuratorCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(curator)}
      disabled={disabled}
      aria-label={`View details for ${curator.name}`}
      className="group flex h-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-70"
    >
      <GlitchBorder
        seed={curator.name.length + 4}
        thickness={1}
        hoverBoost={14}
        delayMs={200}
        className="overflow-hidden"
      >
        <CuratorImage image={curator.curator_image} alt={curator.name} />
      </GlitchBorder>

      <p className="label mt-3 text-muted-foreground">
        {curator.discipline?.name ?? "Independent"}
      </p>

      <h2 className="headline mt-1 min-h-[2.4em] text-base leading-[1.2] font-semibold transition-colors group-hover:text-accent md:text-xl">
        {curator.name}
      </h2>

      {curator.short_description && (
        <p className="headline mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
          {curator.short_description}
        </p>
      )}

      <span className="headline mt-auto inline-block self-start border border-foreground px-3 py-1.5 pt-3 text-[11px] tracking-[0.08em] uppercase transition-colors group-hover:bg-foreground group-hover:text-background">
        More info +
      </span>
    </button>
  );
}
