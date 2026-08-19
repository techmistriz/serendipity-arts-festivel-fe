"use client";

import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import GlitchBar from "@/components/common/GlitchBar";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import Loader from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import {
  getCuratorDetail,
  getCurators,
  type CuratorDetailData,
  type CuratorListItem,
  type CuratorProgram,
} from "@/services/curators";
import { getErrorMessage } from "@/utils/error";
import { formatDate } from "@/utils/format";
import { resolveApiMediaUrl } from "@/utils/media";

type DisciplineFilter = "all" | number;

const BIO_ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "em",
  "h2",
  "h3",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "ul",
];

export default function CuratorsClient() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineFilter>("all");
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

  const disciplines = useMemo(
    () =>
      Array.from(
        new Map(
          curators
            .filter((curator) => curator.discipline)
            .map((curator) => [curator.discipline!.id, curator.discipline!] as const),
        ).values(),
      ),
    [curators],
  );

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

      {listError && (
        <Alert variant="destructive" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <AlertTitle>Curators are unavailable</AlertTitle>
              <AlertDescription>{listError}</AlertDescription>
            </div>
            <Button variant="outline" onClick={retryCurators}>
              Try again
            </Button>
          </div>
        </Alert>
      )}

      {detailError && (
        <Alert variant="destructive" className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <AlertTitle>Curator details are unavailable</AlertTitle>
              <AlertDescription>{detailError}</AlertDescription>
            </div>
            <Button variant="outline" onClick={retryCuratorDetail} disabled={!lastSelectedCurator}>
              Try again
            </Button>
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="mt-40" role="status" aria-live="polite">
          <Loader />
          <span className="sr-only">Loading curators</span>
        </div>
      ) : (
        <>
          <div
            className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-rule pt-6 md:mt-14"
            aria-label="Filter curators by discipline"
            role="toolbar"
          >
            <button
              type="button"
              onClick={() => setSelectedDiscipline("all")}
              aria-pressed={selectedDiscipline === "all"}
              className={filterClassName(
                selectedDiscipline === "all",
                selectedDiscipline !== "all",
              )}
            >
              All
            </button>
            {disciplines.map((discipline) => (
              <button
                key={discipline.id}
                type="button"
                onClick={() => setSelectedDiscipline(discipline.id)}
                aria-pressed={selectedDiscipline === discipline.id}
                className={filterClassName(
                  selectedDiscipline === discipline.id,
                  selectedDiscipline !== "all",
                )}
              >
                {discipline.name}
              </button>
            ))}
          </div>

          {visibleCurators.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 items-stretch gap-x-4 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
              {visibleCurators.map((curator) => (
                <button
                  key={curator.id}
                  type="button"
                  onClick={() => void openCurator(curator)}
                  disabled={detailLoading}
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
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="headline text-sm uppercase text-muted-foreground">
                {selectedDiscipline === "all"
                  ? "No curators are available yet"
                  : "No curators match this discipline"}
              </p>
            </div>
          )}
        </>
      )}

      {detailLoading && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <Loader />
          <span className="sr-only">Loading curator details</span>
        </div>
      )}

      <CuratorDetailModal activeCurator={activeCurator} onClose={() => setActiveCurator(null)} />
    </div>
  );
}

function CuratorImage({ image, alt }: { image: string | null; alt: string }) {
  const src = resolveApiMediaUrl(image);

  if (!src) {
    return (
      <div className="flex aspect-[4/5] w-full items-end bg-muted p-4 text-xs tracking-[0.08em] text-muted-foreground uppercase">
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={1000}
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
      className="aspect-[4/5] w-full object-cover"
    />
  );
}

function CuratorDetailModal({
  activeCurator,
  onClose,
}: {
  activeCurator: CuratorDetailData | null;
  onClose: () => void;
}) {
  const curator = activeCurator?.curator;
  const sanitizedBio = useMemo(
    () =>
      curator?.bio
        ? String(
            DOMPurify.sanitize(curator.bio, {
              ALLOWED_TAGS: BIO_ALLOWED_TAGS,
              ALLOWED_ATTR: ["href"],
            }),
          )
        : null,
    [curator],
  );
  const instagramUrl = getSafeExternalUrl(curator?.instagram_link);

  return (
    <Modal open={Boolean(activeCurator)} onOpenChange={(open) => !open && onClose()}>
      {curator && (
        <ModalContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] max-w-6xl gap-0 overflow-y-auto p-0"
        >
          <GlitchBar
            seed={13}
            direction="v"
            variant="vibrate"
            speed={0.35}
            count={90}
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-1.5"
          />
          <GlitchBar
            seed={31}
            direction="v"
            variant="bulge"
            speed={1.8}
            count={90}
            className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-1.5"
          />

          <div className="container-editorial relative px-6 pt-6 pb-16 md:px-10 md:pt-10">
            <ModalHeader className="flex flex-row items-center justify-between border-b border-rule pb-4">
              <p className="label">Curator</p>
              <ModalClose asChild>
                <button type="button" className="label transition-colors hover:text-accent">
                  Close ×
                </button>
              </ModalClose>
            </ModalHeader>
            <ModalTitle className="sr-only">{curator.name}</ModalTitle>
            <ModalDescription className="sr-only">Details for {curator.name}</ModalDescription>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <GlitchBorder
                  seed={curator.name.length + 23}
                  thickness={1}
                  hoverBoost={14}
                  delayMs={200}
                  className="overflow-hidden"
                >
                  <CuratorImage image={curator.curator_image} alt={curator.name} />
                </GlitchBorder>
              </div>

              <div className="md:col-span-7">
                {curator.discipline && (
                  <p className="label text-muted-foreground">{curator.discipline.name}</p>
                )}

                <h2 className="display mt-2 text-3xl leading-[0.92] tracking-[-0.02em] uppercase md:text-6xl">
                  {curator.name}
                </h2>

                {curator.short_description && (
                  <p className="headline mt-6 max-w-prose text-base leading-relaxed md:text-lg">
                    {curator.short_description}
                  </p>
                )}

                {sanitizedBio && (
                  <div
                    className="headline mt-6 max-w-prose space-y-4 text-base leading-relaxed md:text-lg [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                    dangerouslySetInnerHTML={{ __html: sanitizedBio }}
                  />
                )}

                {(instagramUrl || curator.instagram_handle) && (
                  <div className="mt-8">
                    {instagramUrl ? (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="headline inline-block border border-foreground px-5 py-3 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background"
                      >
                        {curator.instagram_handle || "Instagram"} →
                      </a>
                    ) : (
                      <span className="headline inline-block border border-foreground px-5 py-3 text-xs tracking-[0.06em] uppercase">
                        {curator.instagram_handle}
                      </span>
                    )}
                  </div>
                )}

                <CuratorProgrammes programs={activeCurator.programs} onNavigate={onClose} />
              </div>
            </div>
          </div>
        </ModalContent>
      )}
    </Modal>
  );
}

function CuratorProgrammes({
  programs,
  onNavigate,
}: {
  programs: CuratorProgram[];
  onNavigate: () => void;
}) {
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

function filterClassName(isSelected: boolean, hasActiveFilter: boolean) {
  if (isSelected) {
    return "display text-sm leading-none text-foreground underline decoration-2 decoration-accent underline-offset-[6px] uppercase transition-colors md:text-lg";
  }

  return `display text-sm leading-none uppercase transition-colors md:text-lg ${
    hasActiveFilter
      ? "text-muted-foreground/60 hover:text-foreground"
      : "text-foreground hover:text-accent"
  }`;
}

function getSafeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === "https:" ? parsedUrl.toString() : null;
  } catch {
    return null;
  }
}
