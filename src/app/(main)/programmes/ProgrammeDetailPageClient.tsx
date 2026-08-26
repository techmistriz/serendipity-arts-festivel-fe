"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import { BookingSheet } from "./BookingSheet";
import { DetailPageLoadingSkeleton } from "@/components/common/LoadingSkeletons";
import { mapApiProgrammeToUi, mapApiProgrammesToUi } from "@/lib/programme-adapter";
import { useProgramme } from "@/hooks/useProgrammeDetail";
import { useProgrammes } from "@/hooks/useProgrammes";

type ProgrammeIntent = "about" | "cart";

type ProgrammeDetailPageClientProps = {
  slug: string;
  initialIntent?: ProgrammeIntent;
};

export function ProgrammeDetailPageClient({
  slug,
  initialIntent = "about",
}: ProgrammeDetailPageClientProps) {
  const router = useRouter();
  const {
    programme: apiProgramme,
    loading: isProgrammeLoading,
    error,
    refetch,
  } = useProgramme(slug);
  const { programmes: apiProgrammes } = useProgrammes({ limit: 1000 });

  const programme = useMemo(
    () => (apiProgramme ? mapApiProgrammeToUi(apiProgramme) : null),
    [apiProgramme],
  );

  const allProgrammes = useMemo(() => {
    const mappedProgrammes = mapApiProgrammesToUi(apiProgrammes);

    if (!programme || mappedProgrammes.some((item) => item.id === programme.id)) {
      return mappedProgrammes;
    }

    return [programme, ...mappedProgrammes];
  }, [apiProgrammes, programme]);

  const openProgramme = useCallback(
    (nextProgramme: NonNullable<typeof programme>) => {
      if (!nextProgramme.slug) {
        router.push("/programmes");
        return;
      }

      router.push(`/programmes/${encodeURIComponent(nextProgramme.slug)}`);
    },
    [router],
  );

  if (isProgrammeLoading) {
    return <DetailPageLoadingSkeleton label="Loading programme" />;
  }

  if (!programme) {
    return (
      <div className="container-editorial py-16 md:py-24">
        <div className="max-w-xl border border-foreground p-6">
          <p className="headline text-lg">This programme is unavailable.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "The programme may have been moved or is no longer available."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="headline border border-foreground px-4 py-2 text-xs uppercase tracking-[0.06em] transition-colors hover:bg-foreground hover:text-background"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => router.push("/programmes")}
              className="headline border border-foreground px-4 py-2 text-xs uppercase tracking-[0.06em] transition-colors hover:bg-foreground hover:text-background"
            >
              Browse programmes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const programmePath = `/programmes/${encodeURIComponent(programme.slug)}`;

  return (
    <BookingSheet
      key={programme.slug}
      programme={programme}
      intent={initialIntent}
      allProgrammes={allProgrammes}
      variant="page"
      returnPath={programmePath}
      onClose={() => router.push("/programmes")}
      onOpen={openProgramme}
    />
  );
}
