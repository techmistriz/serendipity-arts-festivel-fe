"use client";

import { useMemo } from "react";
import { useVibes } from "@/hooks/useVibes";
// import VibesFilters from "./_components/VibesFilters";
import VibeCard from "./_components/VibeCard";
import { VibeGridLoadingSkeleton } from "@/components/common/LoadingSkeletons";

// const REGIONS = ["All", "Panjim", "North Goa", "Shop"];

// const AREAS = ["All", "Panjim", "Siolim", "Anjuna", "Assagao", "Candolim", "Morjim"];

export default function VibesPageClient() {
  const { vibes, loading, error } = useVibes();

  // const [region, setRegion] = useState("All");
  // const [area, setArea] = useState("All");

  const filteredVibes = useMemo(() => {
    // Keep filters ready for when API provides region/area.
    // For now, API data does not contain these fields.
    return vibes;
  }, [vibes]);

  // const clearFilters = () => {
  //   setRegion("All");
  //   setArea("All");
  // };

  return (
    <main className="container-editorial pt-10 pb-32 md:pt-20">
      <h1 className="display text-[13vw] uppercase leading-[0.9] md:text-[9vw]">Vibes</h1>

      <p className="headline mt-6 max-w-3xl text-lg md:text-2xl">
        Eat, drink and linger with our food and drink partners across Goa.
      </p>

      {/* <VibesFilters
        region={region}
        area={area}
        regions={REGIONS}
        areas={AREAS}
        onRegionChange={setRegion}
        onAreaChange={setArea}
        onClear={clearFilters}
      /> */}

      {loading && <VibeGridLoadingSkeleton count={6} />}

      {error && <p className="label mt-10 text-accent">{error}</p>}

      {!loading && !error && (
        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVibes.map((vibe) => (
            <VibeCard key={vibe.id} vibe={vibe} />
          ))}
        </section>
      )}

      {!loading && !error && filteredVibes.length === 0 && (
        <p className="label mt-10 text-muted-foreground">No vibes found.</p>
      )}
    </main>
  );
}
