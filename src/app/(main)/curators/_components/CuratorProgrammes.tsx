import Link from "next/link";

import { formatDate } from "@/utils/format";

import type { CuratorProgram } from "../types";

type CuratorProgrammesProps = {
  programs: CuratorProgram[];
  onNavigate: () => void;
};

export function CuratorProgrammes({ programs, onNavigate }: CuratorProgrammesProps) {
  if (programs.length === 0) return null;

  return (
    <div className="mt-10 border-t border-rule pt-6">
      <p className="label mb-4 text-muted-foreground">
        Curation at the Serendipity Arts Festival 2026
      </p>

      <ul className="divide-y divide-rule">
        {programs.map((program) => {
          const firstDetail = program.program_details[0];

          return (
            <li key={program.id}>
              <Link
                href={`/programmes?p=${encodeURIComponent(String(program.id))}`}
                onClick={onNavigate}
                className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
              >
                <span className="headline text-base leading-tight font-semibold md:text-xl">
                  {program.name}
                </span>
                <span className="headline label shrink-0 text-right text-muted-foreground transition-colors group-hover:text-accent">
                  {program.category?.name}
                  {program.category?.name && firstDetail?.event_date ? " · " : null}
                  {firstDetail?.event_date ? formatDate(firstDetail.event_date) : null} →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/programmes"
        onClick={onNavigate}
        className="headline mt-6 inline-block border border-foreground px-5 py-3 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background"
      >
        See all programmes →
      </Link>
    </div>
  );
}
