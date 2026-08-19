import venuesBox from "@public/venues-box.png";

import { HomePromoPanel } from "./HomePromoPanel";
import { HomeSectionHeader } from "./HomeSectionHeader";

export function VenuesSection() {
  return (
    <section className="container-editorial mt-20 md:mt-32">
      <HomeSectionHeader title="Venues">
        <HomePromoPanel image={venuesBox} imageClassName="scale-150 object-[22%_78%]">
          <p className="notch text-xl leading-[1] font-semibold tracking-[-0.01em] text-white uppercase md:text-2xl">
            Serendipity Dash
          </p>
          <p className="headline mt-2 max-w-lg text-xs text-white/85 md:text-sm">
            Run the festival streets that cross our festival venues over the years, dodge the vans
            and collect points. Our little game, playable in your browser.
          </p>
          <span className="label notch mt-4 inline-block cursor-default border border-white px-4 py-2.5 text-white">
            Coming soon →
          </span>
        </HomePromoPanel>
      </HomeSectionHeader>
    </section>
  );
}
