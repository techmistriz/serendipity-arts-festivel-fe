"use client";


import GlitchBar from "@/src/components/common/GlitchBar";
import { GlitchBorder } from "@/src/components/common/GlitchBorder";
import { Curator, CURATORS } from "@/src/data/curators";
import { dateLabel, programmesByCurator } from "@/src/data/programmes-data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



const DISCIPLINES = ["All", ...Array.from(new Set(CURATORS.map((c) => c.discipline)))];

export default function Curators() {
    const [d, setD] = useState("All");
    const [active, setActive] = useState<Curator | null>(null);
    const list = (d === "All" ? CURATORS : CURATORS.filter((c) => c.discipline === d))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="container-editorial pt-10 md:pt-20 pb-32">
            <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Curators</h1>
            <p className="mt-6 max-w-2xl text-muted-foreground">
                The artists, scholars and practitioners shaping the 2026 edition — an interdisciplinary cohort gathered across Accessibility, Culinary Arts, Music, Dance, Theatre, Craft, Visual Arts and Special Projects.
            </p>

            <div className="mt-10 md:mt-14 rule-t pt-6 flex flex-wrap gap-x-4 gap-y-2">
                {DISCIPLINES.map((x) => (
                    <button
                        key={x}
                        onClick={() => setD(x)}
                        className={`display uppercase text-sm md:text-lg leading-none transition-colors ${d === x
                            ? "text-foreground underline underline-offset-[6px] decoration-2 decoration-accent"
                            : d !== "All"
                                ? "text-muted-foreground/60 hover:text-foreground"
                                : "text-foreground hover:text-accent"
                            }`}
                    >
                        {x}
                    </button>
                ))}
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 items-stretch">
                {list.map((c) => (
                    <button key={c.name} onClick={() => setActive(c)} className="group flex h-full flex-col text-left">
                        <GlitchBorder seed={c.name.length + 4} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                            <Image src={c.img} alt={c.name} width={800}
                                height={600}
                                className="w-full aspect-[4/5] object-cover " />

                        </GlitchBorder>
                        <p className="label text-muted-foreground mt-3">{c.discipline}</p>
                        <h3 className="headline font-semibold text-base md:text-xl mt-1 min-h-[2.4em] leading-[1.2] group-hover:text-accent transition-colors">{c.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 headline">{c.short}</p>
                        <span className="mt-auto pt-3 inline-block self-start headline text-[11px] uppercase tracking-[0.08em] border border-foreground px-3 py-1.5 group-hover:bg-foreground group-hover:text-background transition-colors">
                            More info +
                        </span>
                    </button>
                ))}
            </div>

            {active && (
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
            )}
        </div>
    );
}

function CuratorProgrammes({ name, onNavigate }: { name: string; onNavigate: () => void }) {
    const items = programmesByCurator(name);
    if (items.length === 0) return null;
    return (
        <div className="mt-10 rule-t pt-6">
            <p className="label text-muted-foreground mb-4">Curation at the Serendipity Arts Festival 2026</p>
            <ul className="divide-y divide-rule">
                {items.map((p) => (
                    <li key={p.id}>
                        <Link
                            
                            href={`/programmes?p=${p.id}`}
                            onClick={onNavigate}
                            className="group py-3 flex items-baseline justify-between gap-4 hover:text-accent transition-colors"
                        >
                            <span className="headline font-semibold text-base md:text-xl leading-tight">{p.title}</span>
                            <span className="label text-muted-foreground shrink-0 text-right headline group-hover:text-accent transition-colors">
                                {p.category} · {dateLabel(p)} →
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
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


