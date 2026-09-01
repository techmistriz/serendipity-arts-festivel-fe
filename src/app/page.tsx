// import { ScrollGlitchRain } from "@/components/common/ScrollGlitchRain";
import { CuratorsSection } from "@/components/home/CuratorsSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeIntroduction } from "@/components/home/HomeIntroduction";
import HomeProgrammes from "@/components/home/HomeProgrammes";
import { HomeStructuredData } from "@/components/home/HomeStructuredData";
// import { ListenGatherMove } from "@/components/home/ListenGatherMove";
import { PressSection } from "@/components/home/PressSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { VenuesSection } from "@/components/home/VenuesSection";
// import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";

export default function Home() {
  return (
    <>
      {/* <RouteLoadingOverlay /> */}
      <HomeHero />
      <HomeIntroduction />
      {/* <ListenGatherMove /> */}
      <HomeProgrammes />
      <CuratorsSection />
      <VenuesSection />
      <TestimonialsSection />
      <PressSection />
      <SponsorsSection />
      <HomeStructuredData />
      <div className="pb-24" />
    </>
  );
}
