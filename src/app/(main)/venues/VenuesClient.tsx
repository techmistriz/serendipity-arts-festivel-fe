"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import GlitchBar from "@/src/components/common/GlitchBar";
import { GlitchBorder } from "@/src/components/common/GlitchBorder";

import {
    getVenues,
    getVenueDetail,
    type ApiVenue,
    type VenueDetail as ApiVenueDetail,
} from "@/src/services/venues";
import { stripHtml } from "@/src/utils/html";
import Loader from "@/src/components/common/Loader";
import { GOA_NODES, GOA_VENUE_POINTS } from "@/src/lib/goa-map";
import { GoogleWayfindingMap } from "@/src/components/GoogleWayfindingMap";


const getImageUrl = (image: string | null) => {
    if (!image) {
        return "/images/placeholder.jpg";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `http://localhost:8000/uploads/${image}`;
};


export default function Venues() {
    const searchParams = useSearchParams();
    const programmeId = searchParams.get("p");

    const [venues, setVenues] = useState<ApiVenue[]>([]);
    const [active, setActive] = useState<ApiVenueDetail | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        async function loadVenues() {
            try {
                setLoading(true);

                const data = await getVenues();

                // Hide venues that API says should not appear
                const visibleVenues = data.filter(
                    (venue) => venue.is_hide_on_frontend !== 1
                );

                setVenues(visibleVenues);
            } catch (error) {
                console.error("Failed to load venues:", error);
            } finally {
                setLoading(false);
            }
        }

        loadVenues();
    }, []);

    const handleVenueClick = async (venue: ApiVenue) => {
        try {
            setDetailLoading(true);

            const detail = await getVenueDetail(venue.id);

            setActive(detail);
        } catch (error) {
            console.error("Failed to load venue detail:", error);
        } finally {
            setDetailLoading(false);
        }
    };




    return (
        <div className="container-editorial pt-10 md:pt-20 pb-32">
            <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Venues</h1>
            <p className="mt-6 max-w-3xl text-muted-foreground">
                The venues at the Serendipity Arts Festival range from heritage Goan buildings to purpose-built festival spaces, each offering a unique setting for performances, exhibitions, workshops, and more. Spread across Panjim's riverfront, the Festival transforms the city into a buzzing cultural hub — accessible to all.
            </p>
            {/* Loading */}
            {/* {loading && (
                <div className="mt-16 text-center">
                    <p className="headline uppercase text-sm">
                        Loading venues...
                    </p>
                </div>
            )} */}

            {loading && (
                <div className="mt-40">

                    <Loader />
                </div>
            )}


            {!loading && (
                <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {venues
                        .slice()
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((venue) => (
                            <button
                                key={venue.id}
                                onClick={() => handleVenueClick(venue)}
                                className="group block text-left"
                            >
                                <GlitchBorder seed={venue.title.length + 9} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden aspect-[4/3]">
                                    <img
                                        src={getImageUrl(venue.featured_image)}
                                        alt={venue.title}
                                        width={800}
                                        height={600}
                                        className="w-full h-full object-cover"
                                    />

                                </GlitchBorder>
                                <h3 className="mt-4 display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em] group-hover:text-accent transition-colors break-words">
                                    {venue.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 headline"> {stripHtml(venue.description)}</p>
                                <span className="mt-3 inline-block headline text-[11px] uppercase tracking-[0.08em] border border-foreground px-3 py-1.5 group-hover:bg-foreground group-hover:text-background transition-colors">
                                    More info +
                                </span>
                            </button>
                        ))}
                </div>

            )}

            {/* Wayfinding */}
            <section className="mt-20 md:mt-28">
                <h2 className="display uppercase text-[9vw] md:text-[5vw] leading-[0.9]">
                    Wayfinding
                </h2>

                <p className="mt-4 max-w-2xl text-muted-foreground headline text-sm">
                    Pick a start and an end venue to get the route — on foot, by car or by
                    transit.
                </p>

                <div className="mt-8">
                    <GoogleWayfindingMap
                        ariaLabel="Google map of Serendipity Arts Festival venues across Panjim"
                        points={GOA_VENUE_POINTS}
                        nodes={GOA_NODES}
                        caption="Panjim riverfront · all venues sit within a twenty minute walk. Highlighted pins are venues on your booking list."
                    />
                </div>
            </section>

            {/* Detail loading */}
            {/* {detailLoading && (
                <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
                    <p className="headline uppercase text-sm">
                        Loading venue...
                    </p>
                </div>
            )} */}

            {active && <VenueDetail venue={active} onClose={() => setActive(null)} />}
        </div>
    );
}

function VenueDetail({ venue, onClose }: { venue: ApiVenueDetail; onClose: () => void }) {
    const [sub, setSub] = useState(0);

    const subVenues = venue.childs || [];

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto ed-fade">
            {/* Vertical glitch on the edges — keeps the close/label row visible */}
            <GlitchBar seed={17} direction="v" variant="bulge" speed={1.6} count={80} className="fixed left-0 top-0 bottom-0 w-1.5 z-10" />
            <GlitchBar seed={37} direction="v" variant="vibrate" speed={0.4} count={80} className="fixed right-0 top-0 bottom-0 w-1.5 z-10" />
            <div className="container-editorial pt-6 md:pt-10 pb-16">
                <div className="flex items-center justify-between rule-b pb-4">
                    <p className="label">Venue</p>
                    <button onClick={onClose} className="label hover:text-accent">Close ×</button>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                    <div className="md:col-span-6">
                        <GlitchBorder seed={venue.title.length + 31} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
                            <Image
                                src={getImageUrl(venue.featured_image)}
                                alt={venue.title}
                                width={900}
                                height={700}
                                className="w-full aspect-[4/3] object-cover"
                            />
                        </GlitchBorder>
                    </div>
                    <div className="md:col-span-6">
                        <h2 className="display uppercase text-3xl md:text-6xl leading-[0.92] tracking-[-0.02em]">{venue.title}</h2>
                        <div className="mt-4 text-base md:text-lg max-w-prose leading-relaxed headline whitespace-pre-line" dangerouslySetInnerHTML={{
                            __html: venue.description || "",
                        }} />
                        {/* Sub venues */}
                        {/* {subVenues.length > 0 && (
                            <div className="mt-8">
                                <p className="label text-muted-foreground mb-3">Sub-venues</p>

                                <div className="flex flex-wrap gap-2">
                                    {subVenues.map((child, index) => (
                                        <button
                                            key={child.id}
                                            onClick={() => setSub(index)}
                                            className={`headline text-xs uppercase tracking-[0.06em] border px-3 py-2 transition-colors ${sub === index
                                                ? "bg-foreground text-background border-foreground"
                                                : "border-foreground hover:bg-foreground hover:text-background"
                                                }`}
                                        >
                                            {child.title}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground headline">
                                    Selected: <span className="text-foreground"> {subVenues[sub]?.title}</span>
                                </p>
                            </div>

                        )} */}

                        {/* Directions */}
                        {venue.google_map_url && (
                            <a href={venue.google_map_url} target="_blank" rel="noreferrer"
                                className="mt-8 inline-block headline text-xs uppercase tracking-[0.06em] border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
                                Get directions →
                            </a>
                        )}
                    </div>
                </div>

                {/* Interconnectedness: programmes at this venue */}
                {venue.program_details?.length > 0 && (
                    <div className="mt-16 md:mt-20 rule-t pt-8">
                        <div className="flex items-baseline justify-between">
                            <h3 className="display uppercase text-2xl md:text-4xl leading-none">What's on here</h3>
                            <p className="label text-muted-foreground">{venue.program_details.length} programmes</p>
                        </div>
                        <ul className="mt-6 divide-y divide-rule">
                            {venue.program_details.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={`/programmes?p=${item.program_id}`}
                                        onClick={onClose}
                                        className="group py-4 flex items-baseline justify-between gap-4 hover:text-accent transition-colors"
                                    >
                                        <div>
                                            <p className="headline font-semibold text-base md:text-xl leading-tight"> {item.program?.name}</p>
                                            <p className="label text-muted-foreground mt-1 group-hover:text-accent transition-colors">
                                                {item.program?.category?.name}

                                                {item.program?.curators?.length > 0 && (
                                                    <>
                                                        {" "}
                                                        · Curated by{" "}
                                                        {item.program.curators
                                                            .map((curator) => curator.name)
                                                            .join(", ")}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        <p className="label text-muted-foreground shrink-0 text-right group-hover:text-accent transition-colors">  {item.event_date}
                                            <br />
                                            {item.from_time} – {item.to_time} →</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}


