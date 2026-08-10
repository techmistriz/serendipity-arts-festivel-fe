"use client";

import GlitchBar from "@/src/components/common/GlitchBar";
import { GlitchBorder } from "@/src/components/common/GlitchBorder";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    getCurators,
    getCuratorDetail,
    type ApiCurator,
    type CuratorDetail,
} from "@/src/services/curators";

const IMAGE_BASE_URL = "http://localhost:8000";

export default function Curators() {
    const [discipline, setDiscipline] = useState("All");

    const [curators, setCurators] = useState<ApiCurator[]>([]);
    const [active, setActive] = useState<CuratorDetail | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    // -----------------------------------
    // Image URL
    // -----------------------------------

    const getImageUrl = (image: string | null) => {
        if (!image) {
            return "/images/placeholder.jpg";
        }

        if (/^https?:\/\//i.test(image)) {
            return image;
        }

        return `${IMAGE_BASE_URL}/${image.replace(/^\//, "")}`;
    };

    // -----------------------------------
    // Get curators
    // -----------------------------------

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

    // -----------------------------------
    // Get curator detail
    // -----------------------------------

    const handleCuratorClick = async (
        curator: ApiCurator
    ) => {
        try {
            setDetailLoading(true);

            const detail = await getCuratorDetail(
                curator.slug
            );

            setActive(detail);
        } catch (error) {
            console.error(
                "Failed to load curator detail:",
                error
            );
        } finally {
            setDetailLoading(false);
        }
    };

    // -----------------------------------
    // Disciplines
    // -----------------------------------

    const disciplines = [
        "All",
        ...Array.from(
            new Set(
                curators
                    .map((curator) =>
                        curator.discipline?.name
                    )
                    .filter(Boolean) as string[]
            )
        ),
    ];

    // -----------------------------------
    // Filter
    // -----------------------------------

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
            <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Curators</h1>
            <p className="mt-6 max-w-2xl text-muted-foreground">
                The artists, scholars and practitioners shaping the 2026 edition — an interdisciplinary cohort gathered across Accessibility, Culinary Arts, Music, Dance, Theatre, Craft, Visual Arts and Special Projects.
            </p>


            {/* Loading */}
            {loading && (
                <div className="mt-16 text-center">
                    <p className="headline uppercase text-sm">
                        Loading curators...
                    </p>
                </div>
            )}

            {!loading && (
                <>
                    {/* Disciplines */}
                    <div className="mt-10 md:mt-14 rule-t pt-6 flex flex-wrap gap-x-4 gap-y-2">
                        {disciplines.map((item) => (
                            <button
                                key={item}
                                onClick={() =>
                                    setDiscipline(item)
                                }
                                className={`display uppercase text-sm md:text-lg leading-none transition-colors ${discipline === item
                                        ? "text-foreground underline underline-offset-[6px] decoration-2 decoration-accent"
                                        : discipline !== "All"
                                            ? "text-muted-foreground/60 hover:text-foreground"
                                            : "text-foreground hover:text-accent"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 items-stretch">
                        {sortedList.map((curator) => (
                            <button key={curator.id}
                                onClick={() =>
                                    handleCuratorClick(
                                        curator
                                    )
                                } className="group flex h-full flex-col text-left">
                                <GlitchBorder seed={
                                    curator.name
                                        .length + 4
                                } thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                                    <img src={getImageUrl(
                                        curator.curator_image
                                    )} alt={curator.name} width={800}
                                        height={600}
                                        className="w-full aspect-[4/5] object-cover " />

                                </GlitchBorder>
                                <p className="label text-muted-foreground mt-3">  {curator.discipline?.name}</p>
                                <h3 className="headline font-semibold text-base md:text-xl mt-1 min-h-[2.4em] leading-[1.2] group-hover:text-accent transition-colors"> {curator.name}</h3>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 headline"> {
                                    curator.short_description
                                }</p>
                                <span className="mt-auto pt-3 inline-block self-start headline text-[11px] uppercase tracking-[0.08em] border border-foreground px-3 py-1.5 group-hover:bg-foreground group-hover:text-background transition-colors">
                                    More info +
                                </span>
                            </button>
                        ))}
                    </div>

                    {sortedList.length === 0 && (
                        <div className="mt-16 text-center">
                            <p className="headline text-sm uppercase text-muted-foreground">
                                No curators found
                            </p>
                        </div>
                    )}

                </>
            )}

              {/* Detail loading */}
            {detailLoading && (
                <div className="fixed inset-0 z-[60] bg-background/80 flex items-center justify-center">
                    <p className="headline uppercase text-sm">
                        Loading curator...
                    </p>
                </div>
            )}


 {/* Detail modal */}
            {active && (
                <CuratorDetailModal
                    curator={active}
                    onClose={() => setActive(null)}
                    getImageUrl={getImageUrl}
                />
            )}

            {/* {active && (
                <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto ed-fade">
                    <GlitchBar seed={13} direction="v" variant="vibrate" speed={0.35} count={90} className="fixed left-0 top-0 bottom-0 w-1.5 z-10" />
                    <GlitchBar seed={31} direction="v" variant="bulge" speed={1.8} count={90} className="fixed right-0 top-0 bottom-0 w-1.5 z-10" />
                    <div className="container-editorial pt-6 md:pt-10 pb-16">
                        <div className="flex items-center justify-between rule-b pb-4">
                            <p className="label">Curator</p>
                            <button onClick={() => setActive(null)} className="label hover:text-accent">Close ×</button>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                            <div className="md:col-span-5">
                                <GlitchBorder seed={active.name.length + 23} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                                    <Image src={active.img} alt={active.name} width={900}
                                        height={700} className="w-full aspect-[4/5] object-cover" />
                                </GlitchBorder>
                            </div>
                            <div className="md:col-span-7">
                                <p className="label text-muted-foreground">{active.discipline}</p>
                                <h2 className="mt-2 display uppercase text-3xl md:text-6xl leading-[0.92] tracking-[-0.02em]">{active.name}</h2>
                                <div className="mt-6 space-y-4 max-w-prose text-base md:text-lg leading-relaxed headline">
                                    {active.bio.map((p, i) => <p key={i}>{p}</p>)}
                                </div>

                                <CuratorProgrammes name={active.name} onNavigate={() => setActive(null)} />
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}

function CuratorDetailModal({
    curator,
    onClose,
    getImageUrl,
}: {
    curator: CuratorDetail;
    onClose: () => void;
    getImageUrl: (image: string | null) => string;
}) {
    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto ed-fade">

            <GlitchBar
                seed={13}
                direction="v"
                variant="vibrate"
                speed={0.35}
                count={90}
                className="fixed left-0 top-0 bottom-0 w-1.5 z-10"
            />

            <GlitchBar
                seed={31}
                direction="v"
                variant="bulge"
                speed={1.8}
                count={90}
                className="fixed right-0 top-0 bottom-0 w-1.5 z-10"
            />

            <div className="container-editorial pt-6 md:pt-10 pb-16">

                {/* Header */}
                <div className="flex items-center justify-between rule-b pb-4">

                    <p className="label">
                        Curator
                    </p>

                    <button
                        onClick={onClose}
                        className="label hover:text-accent"
                    >
                        Close ×
                    </button>

                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

                    {/* Image */}
                    <div className="md:col-span-5">

                        <GlitchBorder
                            seed={
                                curator.name.length + 23
                            }
                            thickness={1}
                            hoverBoost={14}
                            delayMs={200}
                            className="overflow-hidden"
                        >

                            <img
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

                    {/* Content */}
                    <div className="md:col-span-7">

                        <p className="label text-muted-foreground">
                            {curator.discipline?.name}
                        </p>

                        <h2 className="mt-2 display uppercase text-3xl md:text-6xl leading-[0.92] tracking-[-0.02em]">
                            {curator.name}
                        </h2>

                        {/* Bio */}
                        {curator.bio && (
                            <div
                                className="mt-6 max-w-prose text-base md:text-lg leading-relaxed headline"
                                dangerouslySetInnerHTML={{
                                    __html: curator.bio,
                                }}
                            />
                        )}
                        {/* short description */}
                        {curator.short_description && (
                            <div
                                className="mt-6 max-w-prose text-base md:text-lg leading-relaxed headline"
                                dangerouslySetInnerHTML={{
                                    __html: curator.short_description,
                                }}
                            />
                        )}

                        {/* Instagram */}
                        {(curator.instagram_link ||
                            curator.instagram_handle) && (
                            <div className="mt-8">

                                <a
                                    href={
                                        curator.instagram_link &&
                                        curator.instagram_link !== "##"
                                            ? curator.instagram_link
                                            : "#"
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors inline-block"
                                >
                                    {curator.instagram_handle ||
                                        "Instagram"}{" "}
                                    →
                                </a>

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}


