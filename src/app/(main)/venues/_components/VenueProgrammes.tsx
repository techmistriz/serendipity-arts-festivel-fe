import Link from "next/link";

import { formatDate } from "@/utils/format";

import type { VenueProgramDetail } from "../types";

type VenueProgrammesProps = {
  programs: VenueProgramDetail[];
  onNavigate?: () => void;
};

export function VenueProgrammes({ programs, onNavigate }: VenueProgrammesProps) {
  if (programs.length === 0) return null;

  return (
    <div className="mt-16 border-t border-rule pt-8 md:mt-20">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="display text-2xl leading-none uppercase md:text-4xl">What&apos;s on here</h3>
        <p className="label shrink-0 text-muted-foreground">
          {programs.length} programme{programs.length === 1 ? "" : "s"}
        </p>
      </div>

      <ul className="mt-6 divide-y divide-rule">
        {programs.map((item) => (
          <li key={item.id}>
            <Link
              href={`/programmes?p=${encodeURIComponent(String(item.program_id))}`}
              onClick={onNavigate}
              className="group flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-accent"
            >
              <div>
                <p className="headline text-base leading-tight font-semibold md:text-xl">
                  {item.program.name}
                </p>
                {(item.program.category?.name || item.program.curators.length > 0) && (
                  <p className="label mt-1 text-muted-foreground transition-colors group-hover:text-accent">
                    {item.program.category?.name}
                    {item.program.category?.name && item.program.curators.length > 0 ? " · " : null}
                    {item.program.curators.length > 0
                      ? `Curated by ${item.program.curators.map((curator) => curator.name).join(", ")}`
                      : null}
                  </p>
                )}
              </div>
              <p className="label shrink-0 text-right text-muted-foreground transition-colors group-hover:text-accent">
                {item.event_date ? formatDate(item.event_date) : null}
                {(item.from_time || item.to_time) && (
                  <>
                    <br />
                    {item.from_time} – {item.to_time} →
                  </>
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
