"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Loader from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils/error";

import { getCuratorDetail, getCurators } from "./api";
import { CuratorCard } from "./_components/CuratorCard";
import { CuratorFilters, type CuratorDisciplineFilter } from "./_components/CuratorFilters";
import { CuratorDetailModal } from "./_components/CuratorDetailModal";
import type { CuratorDetailData, CuratorDiscipline, CuratorListItem } from "./types";

export default function CuratorsPageClient() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<CuratorDisciplineFilter>("all");
  const [curators, setCurators] = useState<CuratorListItem[]>([]);
  const [activeCurator, setActiveCurator] = useState<CuratorDetailData | null>(null);
  const [lastSelectedCurator, setLastSelectedCurator] = useState<CuratorListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const detailCache = useRef(new Map<string, CuratorDetailData>());
  const detailRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void getCurators(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setCurators(data);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setListError(getErrorMessage(error, "Unable to load curators. Please try again."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => detailRequest.current?.abort();
  }, []);

  const openCurator = useCallback(async (curator: CuratorListItem) => {
    setLastSelectedCurator(curator);
    setDetailError(null);

    const cachedDetail = detailCache.current.get(curator.slug);
    if (cachedDetail) {
      setActiveCurator(cachedDetail);
      return;
    }

    detailRequest.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    setDetailLoading(true);

    try {
      const detail = await getCuratorDetail(curator.slug, controller.signal);

      if (controller.signal.aborted) return;

      detailCache.current.set(curator.slug, detail);
      setActiveCurator(detail);
    } catch (error) {
      if (!controller.signal.aborted) {
        setDetailError(getErrorMessage(error, "Unable to load curator details. Please try again."));
      }
    } finally {
      if (!controller.signal.aborted) {
        setDetailLoading(false);
      }
    }
  }, []);

  const disciplines = useMemo(() => getDisciplines(curators), [curators]);
  const visibleCurators = useMemo(
    () =>
      selectedDiscipline === "all"
        ? curators
        : curators.filter((curator) => curator.discipline?.id === selectedDiscipline),
    [curators, selectedDiscipline],
  );

  const retryCuratorDetail = () => {
    if (lastSelectedCurator) {
      void openCurator(lastSelectedCurator);
    }
  };

  const retryCurators = () => {
    setLoading(true);
    setListError(null);

    void getCurators()
      .then(setCurators)
      .catch((error: unknown) => {
        setListError(getErrorMessage(error, "Unable to load curators. Please try again."));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container-editorial pt-10 pb-32 md:pt-20">
      <h1 className="display text-[13vw] leading-[0.9] uppercase md:text-[9vw]">Curators</h1>

      <p className="mt-6 max-w-2xl text-muted-foreground">
        The artists, scholars and practitioners shaping the 2026 edition — an interdisciplinary
        cohort gathered across Accessibility, Culinary Arts, Music, Dance, Theatre, Craft, Visual
        Arts and Special Projects.
      </p>

      {listError && <ListError error={listError} onRetry={retryCurators} />}
      {detailError && (
        <DetailError
          error={detailError}
          onRetry={retryCuratorDetail}
          canRetry={Boolean(lastSelectedCurator)}
        />
      )}

      {loading ? (
        <LoadingState label="Loading curators" className="mt-40" />
      ) : (
        <>
          <CuratorFilters
            disciplines={disciplines}
            selectedDiscipline={selectedDiscipline}
            onSelect={setSelectedDiscipline}
          />

          {visibleCurators.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 items-stretch gap-x-4 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
              {visibleCurators.map((curator) => (
                <CuratorCard
                  key={curator.id}
                  curator={curator}
                  onOpen={(selectedCurator) => void openCurator(selectedCurator)}
                  disabled={detailLoading}
                />
              ))}
            </div>
          ) : (
            <EmptyState hasActiveFilter={selectedDiscipline !== "all"} />
          )}
        </>
      )}

      {detailLoading && <LoadingState label="Loading curator details" fullScreen />}

      <CuratorDetailModal activeCurator={activeCurator} onClose={() => setActiveCurator(null)} />
    </div>
  );
}

function getDisciplines(curators: CuratorListItem[]): CuratorDiscipline[] {
  const disciplines = new Map<number, CuratorDiscipline>();

  curators.forEach((curator) => {
    if (curator.discipline) {
      disciplines.set(curator.discipline.id, curator.discipline);
    }
  });

  return Array.from(disciplines.values());
}

function ListError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <AlertTitle>Curators are unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </div>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </Alert>
  );
}

function DetailError({
  error,
  onRetry,
  canRetry,
}: {
  error: string;
  onRetry: () => void;
  canRetry: boolean;
}) {
  return (
    <Alert variant="destructive" className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <AlertTitle>Curator details are unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </div>
        <Button variant="outline" onClick={onRetry} disabled={!canRetry}>
          Try again
        </Button>
      </div>
    </Alert>
  );
}

function EmptyState({ hasActiveFilter }: { hasActiveFilter: boolean }) {
  return (
    <div className="mt-16 text-center">
      <p className="headline text-sm uppercase text-muted-foreground">
        {hasActiveFilter ? "No curators match this discipline" : "No curators are available yet"}
      </p>
    </div>
  );
}

function LoadingState({
  label,
  className,
  fullScreen = false,
}: {
  label: string;
  className?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          : className
      }
      role="status"
      aria-live="polite"
    >
      <Loader />
      <span className="sr-only">{label}</span>
    </div>
  );
}
