"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AsyncErrorAlert, EmptyState, LoadingState } from "@/components/common/AsyncState";
import { getErrorMessage } from "@/utils/error";

import { getCuratorDetail, getCurators } from "./api";
import { CuratorCard } from "./_components/CuratorCard";
import { CuratorFilters } from "./_components/CuratorFilters";
import { CuratorDetailModal } from "./_components/CuratorDetailModal";
import { filterCuratorsByDiscipline, getCuratorDisciplines } from "./helpers";
import type { CuratorDetailData, CuratorDisciplineFilter, CuratorListItem } from "./types";

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

  function initializeApp() {
    void getCurators()
      .then(setCurators)
      .catch((error: unknown) => {
        setListError(getErrorMessage(error, "Unable to load curators. Please try again."));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    initializeApp();
  }, []);

  const openCurator = useCallback(async (curator: CuratorListItem) => {
    setLastSelectedCurator(curator);
    setDetailError(null);

    const cachedDetail = detailCache.current.get(curator.slug);
    if (cachedDetail) {
      setActiveCurator(cachedDetail);
      return;
    }

    setDetailLoading(true);

    try {
      const detail = await getCuratorDetail(curator.slug);

      detailCache.current.set(curator.slug, detail);
      setActiveCurator(detail);
    } catch (error) {
      setDetailError(getErrorMessage(error, "Unable to load curator details. Please try again."));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const disciplines = useMemo(() => getCuratorDisciplines(curators), [curators]);
  const visibleCurators = useMemo(
    () => filterCuratorsByDiscipline(curators, selectedDiscipline),
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

      {listError && (
        <AsyncErrorAlert
          title="Curators are unavailable"
          error={listError}
          onRetry={retryCurators}
          className="mt-10"
        />
      )}
      {detailError && (
        <AsyncErrorAlert
          title="Curator details are unavailable"
          error={detailError}
          onRetry={retryCuratorDetail}
          retryDisabled={!lastSelectedCurator}
          className="mt-6"
        />
      )}

      {loading ? (
        <LoadingState label="Loading curators" variant="inline" />
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
            <EmptyState
              message={
                selectedDiscipline === "all"
                  ? "No curators are available yet"
                  : "No curators match this discipline"
              }
            />
          )}
        </>
      )}

      {detailLoading && <LoadingState label="Loading curator details" variant="overlay" />}

      <CuratorDetailModal activeCurator={activeCurator} onClose={() => setActiveCurator(null)} />
    </div>
  );
}
