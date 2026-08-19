"use client";

import GlitchBar from "@/src/components/common/GlitchBar";
import { GlitchBorder } from "@/src/components/common/GlitchBorder";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    getCurators,
    getCuratorDetail,
    type ApiCurator,
    type ApiProgram,
    type CuratorDetail,
} from "@/src/services/curators";

import Loader from "@/src/components/common/Loader";
import Image from "next/image";

const IMAGE_BASE_URL = "http://localhost:8000";

interface ActiveCurator {
    curator: CuratorDetail;
    programs: ApiProgram[];
}

export default function Curators() {
    const [discipline, setDiscipline] = useState("All");

    const [curators, setCurators] = useState<ApiCurator[]>([]);

    const [active, setActive] = useState<ActiveCurator | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    // ----------Image URL------------

    const getImageUrl = (image: string | null) => {
        if (!image) {
            return "/images/placeholder.jpg";
        }

        if (/^https?:\/\//i.test(image)) {
            return image;
        }

        return `${IMAGE_BASE_URL}/${image.replace(/^\//, "")}`;
    };

    // ----------Get curators-----------

    useEffect(() => {
        async function loadCurators() {
            try {
                setLoading(true);

                const data = await getCurators();

                const visibleCurators = data.filter(
                    (curator) =>
                        curator.discipline &&
                        curator.discipline.name
                );

                setCurators(visibleCurators);
            } catch (error) {
                console.error(
                    "Failed to load curators:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadCurators();
    }, []);

    // ----------Get curator detail-------------

    const handleCuratorClick = async (
        curator: ApiCurator
    ) => {
        try {
            setDetailLoading(true);

            const data = await getCuratorDetail(
                curator.slug
            );

            setActive({
                curator: data.curator,
                programs: data.programs || [],
            });
        } catch (error) {
            console.error(
                "Failed to load curator detail:",
                error
            );
        } finally {
            setDetailLoading(false);
        }
    };

    // --------Disciplines-----------

    const disciplines = [
        "All",
        ...Array.from(
            new Set(
                curators
                    .map(
                        (curator) =>
                            curator.discipline?.name
                    )
                    .filter(Boolean) as string[]
            )
        ),
    ];

    // ---------Filter -----------

    const list =
        discipline === "All"
            ? curators
            : curators.filter(
                (curator) =>
                    curator.discipline?.name ===
                    discipline
            );

    const sortedList = list
        .slice()
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    return (
        <div className="container-editorial pt-10 md:pt-20 pb-32">
            {/* Page heading */}

            <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">
                Curators
            </h1>

            <p className="mt-6 max-w-2xl text-muted-foreground">
                The artists, scholars and practitioners
                shaping the 2026 edition — an
                interdisciplinary cohort gathered across
                Accessibility, Culinary Arts, Music,
                Dance, Theatre, Craft, Visual Arts and
                Special Projects.
            </p>

            {/* ----------Loading ---------- */}

            {loading && (
                <div className="mt-40">
                    <Loader />
                </div>
            )}

            {!loading && (
                <>
                    {/* ----------Disciplines -------- */}

                    <div className="mt-10 md:mt-14 rule-t pt-6 flex flex-wrap gap-x-4 gap-y-2">
                        {disciplines.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    setDiscipline(item)
                                }
                                className={`display uppercase text-sm md:text-lg leading-none transition-colors ${discipline === item
                                    ? "text-foreground underline underline-offset-[6px] decoration-2 decoration-accent"
                                    : discipline !==
                                        "All"
                                        ? "text-muted-foreground/60 hover:text-foreground"
                                        : "text-foreground hover:text-accent"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* --------- Curator Grid ----------- */}

                    <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 items-stretch">
                        {sortedList.map((curator) => (
                            <button
                                key={curator.id}
                                type="button"
                                onClick={() =>
                                    handleCuratorClick(
                                        curator
                                    )
                                }
                                className="group flex h-full flex-col text-left"
                            >
                                <GlitchBorder
                                    seed={
                                        curator.name
                                            .length + 4
                                    }
                                    thickness={1}
                                    hoverBoost={14}
                                    delayMs={200}
                                    className="overflow-hidden"
                                >
                                    <Image
                                        src={getImageUrl(
                                            curator.curator_image
                                        )}
                                        alt={
                                            curator.name
                                        }
                                        width={800}
                                        height={600}
                                        className="w-full aspect-[4/5] object-cover"
                                    />
                                </GlitchBorder>

                                <p className="label text-muted-foreground mt-3">
                                    {
                                        curator
                                            .discipline
                                            ?.name
                                    }
                                </p>

                                <h3 className="headline font-semibold text-base md:text-xl mt-1 min-h-[2.4em] leading-[1.2] group-hover:text-accent transition-colors">
                                    {curator.name}
                                </h3>

                                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 headline">
                                    {
                                        curator.short_description
                                    }
                                </p>

                                <span className="mt-auto pt-3 inline-block self-start headline text-[11px] uppercase tracking-[0.08em] border border-foreground px-3 py-1.5 group-hover:bg-foreground group-hover:text-background transition-colors">
                                    More info +
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* ---------Empty state ----------- */}

                    {sortedList.length === 0 && (
                        <div className="mt-16 text-center">
                            <p className="headline text-sm uppercase text-muted-foreground">
                                No curators found
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* -------------Detail Loading --------- */}

            {/* {detailLoading && (
                <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Loader />
                </div>
            )} */}

            {/* -----------Detail Modal -------- */}

            {active && !detailLoading && (
                <CuratorDetailModal
                    curator={active.curator}
                    programs={active.programs}
                    onClose={() => setActive(null)}
                    getImageUrl={getImageUrl}
                />
            )}
        </div>
    );
}

/* --------- CURATOR DETAIL MODAL-------- */

function CuratorDetailModal({
    curator,
    programs,
    onClose,
    getImageUrl,
}: {
    curator: CuratorDetail;
    programs: ApiProgram[];
    onClose: () => void;
    getImageUrl: (image: string | null) => string;
}) {
    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto ed-fade">
            {/* Left glitch bar */}

            <GlitchBar
                seed={13}
                direction="v"
                variant="vibrate"
                speed={0.35}
                count={90}
                className="fixed left-0 top-0 bottom-0 w-1.5 z-10"
            />

            {/* Right glitch bar */}

            <GlitchBar
                seed={31}
                direction="v"
                variant="bulge"
                speed={1.8}
                count={90}
                className="fixed right-0 top-0 bottom-0 w-1.5 z-10"
            />

            <div className="container-editorial pt-6 md:pt-10 pb-16">
                {/* ------------Modal Header ---------- */}

                <div className="flex items-center justify-between rule-b pb-4">
                    <p className="label">
                        Curator
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="label hover:text-accent"
                    >
                        Close ×
                    </button>
                </div>

                {/* --------Main Content ----------- */}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                    {/* -------- Image --------- */}

                    <div className="md:col-span-5">
                        <GlitchBorder
                            seed={
                                curator.name.length +
                                23
                            }
                            thickness={1}
                            hoverBoost={14}
                            delayMs={200}
                            className="overflow-hidden"
                        >
                            <Image
                                src={getImageUrl(
                                    curator.curator_image
                                )}
                                alt={curator.name}
                                width={900}
                                height={700}
                                className="w-full aspect-[4/5] object-cover"
                            />
                        </GlitchBorder>
                    </div>

                    {/* ------Content ----------- */}

                    <div className="md:col-span-7">
                        {/* Discipline */}

                        {curator.discipline && (
                            <p className="label text-muted-foreground">
                                {
                                    curator
                                        .discipline
                                        .name
                                }
                            </p>
                        )}

                        {/* Name */}

                        <h2 className="mt-2 display uppercase text-3xl md:text-6xl leading-[0.92] tracking-[-0.02em]">
                            {curator.name}
                        </h2>

                        {/* Short Description */}

                        {curator.short_description && (
                            <p className="mt-6 max-w-prose text-base md:text-lg leading-relaxed headline">
                                {
                                    curator.short_description
                                }
                            </p>
                        )}

                        {/* Bio */}

                        {curator.bio && (
                            <div
                                className="mt-6 max-w-prose text-base md:text-lg leading-relaxed headline"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        curator.bio,
                                }}
                            />
                        )}

                        {/* Instagram */}

                        {(curator.instagram_link ||
                            curator.instagram_handle) && (
                                <div className="mt-8">
                                    {curator.instagram_link &&
                                        curator.instagram_link !==
                                        "##" ? (
                                        <a
                                            href={
                                                curator.instagram_link
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors inline-block"
                                        >
                                            {curator.instagram_handle ||
                                                "Instagram"}{" "}
                                            →
                                        </a>
                                    ) : curator.instagram_handle ? (
                                        <span className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 inline-block">
                                            {
                                                curator.instagram_handle
                                            }
                                        </span>
                                    ) : null}
                                </div>
                            )}

                        {/* ----------Programs ----------- */}

                        <CuratorProgrammes
                            programs={programs}
                            onNavigate={onClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --------- CURATOR PROGRAMMES -------- */

function CuratorProgrammes({
    programs,
    onNavigate,
}: {
    programs: ApiProgram[];
    onNavigate: () => void;
}) {
    if (!programs || programs.length === 0) {
        return null;
    }

    return (
        <div className="mt-10 rule-t pt-6">
            <p className="label text-muted-foreground mb-4">
                Curation at the Serendipity Arts
                Festival 2026
            </p>

            <ul className="divide-y divide-rule">
                {programs.map((program) => {
                    const firstDetail =
                        program.program_details?.[0];

                    return (
                        <li key={program.id}>
                            <Link
                                href={`/programmes/${program.slug}`}
                                onClick={onNavigate}
                                className="group py-3 flex items-baseline justify-between gap-4 hover:text-accent transition-colors"
                            >
                                {/* Program name */}

                                <span className="headline font-semibold text-base md:text-xl leading-tight">
                                    {program.name}
                                </span>

                                {/* Category + date */}

                                <span className="label text-muted-foreground shrink-0 text-right headline group-hover:text-accent transition-colors">
                                    {program.category
                                        ?.name && (
                                            <>
                                                {
                                                    program
                                                        .category
                                                        .name
                                                }
                                            </>
                                        )}

                                    {firstDetail?.event_date && (
                                        <>
                                            {" · "}
                                            {formatProgramDate(
                                                firstDetail.event_date
                                            )}
                                        </>
                                    )}

                                    {" →"}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* See all programmes */}

            <Link
                href="/programmes"
                onClick={onNavigate}
                className="mt-6 inline-block headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
                See all programmes →
            </Link>
        </div>
    );
}

/* --------- DATE FORMATTER -------- */

function formatProgramDate(date: string) {
    const [day, month, year] =
        date.split("-");

    if (!day || !month || !year) {
        return date;
    }

    const parsed = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}