import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import sambaImg from "@/assets/venues/samba-square-2026.jpg.asset.json";
import directorateImg from "@/assets/venues/directorate.jpg.asset.json";
import gmcImg from "@/assets/venues/old-gmc.jpg.asset.json";
import artParkImg from "@/assets/venues/art-park.jpg.asset.json";
import promenadeImg from "@/assets/venues/promenade.jpg.asset.json";
import esgImg from "@/assets/venues/esg-v2.jpg.asset.json";
import arenaImg from "@/assets/venues/arena-db.jpg.asset.json";
import { programmesByVenue, dateLabel } from "@/lib/programmes-data";
import { GlitchBar } from "@/components/site/GlitchBar";
import { GlitchBorder } from "@/components/site/GlitchBorder";


export const Route = createFileRoute("/venues")({
  head: () => ({
    meta: [
      { title: "Venues — Serendipity Arts Festival 2026" },
      {
        name: "description",
        content:
          "Heritage buildings and purpose-built festival spaces across Panjim — each reimagined for the arts.",
      },
    ],
  }),
  component: Venues,
});

type Venue = {
  name: string;
  img: string;
  blurb: string;
  subVenues: string[];
  directions: string;
};

const VENUES: Venue[] = [
  {
    name: "The Old GMC Complex",
    img: gmcImg.url,
    blurb:
      "The former Goa Medical College — a 19th-century Portuguese-era structure on the Mandovi — becomes a labyrinth of exhibitions and public art across three floors. Long corridors, high-ceilinged wards and inner courtyards host the Festival's largest visual arts programme.",
    subVenues: ["Ground Floor Galleries", "First Floor Wing", "Central Courtyard", "Second Floor Wing"],
    directions: "https://maps.app.goo.gl/",
  },
  {
    name: "Art Park",
    img: artParkImg.url,
    blurb:
      "Embodying Goa's susegad spirit, this riverside park invites you to indulge in authentic Goan dishes, wander through large-scale public art installations, and explore a thoughtfully curated shopping experience.",
    subVenues: ["Main Lawn", "Culinary Pavilion", "Workshop Tent", "Shopping Village"],
    directions: "https://maps.app.goo.gl/",
  },
  {
    name: "Promenade",
    img: promenadeImg.url,
    blurb:
      "The Mandovi riverfront promenade becomes the Festival's open-air stage — sound, water and light in conversation, with music and performance programmed at dusk.",
    subVenues: ["North Deck", "Central Bandstand", "South Deck"],
    directions: "https://maps.app.goo.gl/",
  },
  {
    name: "Samba Square",
    img: sambaImg.url,
    blurb:
      "Adjacent to the Church of Immaculate Conception, Samba Square presents an immersive project exploring Ladakh's interplay of scarcity and ingenuity. Witness the collaboration between skilled craftspeople and designers, highlighting sustainable practices and cultural resilience in the Himalayan cold desert.",
    subVenues: ["Central Stage", "Shaded Pavilion"],
    directions: "https://maps.app.goo.gl/",
  },
  {
    name: "Arena at DB Ground",
    img: arenaImg.url,
    blurb:
      "The Dr. Shyama Prasad Mukherjee (DB) Ground hosts the Festival's headline concert arena — the Festival's largest music footprint under an open sky.",
    subVenues: ["Main Arena", "Backstage Lounge"],
    directions: "https://maps.app.goo.gl/",
  },
  {
    name: "ESG Building",
    img: esgImg.url,
    blurb:
      "The Entertainment Society of Goa building — the Festival's cinema and screening venue for the film programme, alongside intimate talks and panels.",
    subVenues: ["Cinema Hall 1", "Cinema Hall 2", "Panel Room"],
    directions: "https://maps.app.goo.gl/",
  },
  {
    name: "Directorate of Accounts",
    img: directorateImg.url,
    blurb:
      "Dating back to the 1500s, the Accounts Building has seen many visions and versions of Panjim. With its wide verandah, a grand colonnade, and mysterious secret tunnels, SAF is excited to bring this venue alive with a range of visual arts exhibitions, installations, workshops, and screenings.\n\nThe building will host our grantees, engage with urgent themes such as climate change, feature Narkasur effigies, thought-provoking documentaries, and installations that explore the complexities of our hyper-stimulated world through public participation and much more. Between these experiences, our on-site café invites you to pause and enjoy a quick bite.",
    subVenues: ["Ground Floor", "First Floor", "Second Floor", "The Studio"],
    directions: "https://maps.app.goo.gl/",
  },
];


function Venues() {
  const [active, setActive] = useState<Venue | null>(null);

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Venues</h1>
      <p className="mt-6 max-w-3xl text-muted-foreground">
        The venues at the Serendipity Arts Festival range from heritage Goan buildings to purpose-built festival spaces, each offering a unique setting for performances, exhibitions, workshops, and more. Spread across Panjim's riverfront, the Festival transforms the city into a buzzing cultural hub — accessible to all.
      </p>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {VENUES.slice().sort((a, b) => a.name.localeCompare(b.name)).map((v) => (
          <button key={v.name} onClick={() => setActive(v)} className="group block text-left">
            <GlitchBorder seed={v.name.length + 9} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden aspect-[4/3]">
              <img src={v.img} alt={v.name} loading="lazy"
                className="w-full h-full object-cover " />

            </GlitchBorder>
            <h3 className="mt-4 display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em] group-hover:text-accent transition-colors break-words">
              {v.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 headline">{v.blurb}</p>
            <span className="mt-3 inline-block headline text-[11px] uppercase tracking-[0.08em] border border-foreground px-3 py-1.5 group-hover:bg-foreground group-hover:text-background transition-colors">
              More info +
            </span>
          </button>
        ))}
      </div>

      {active && <VenueDetail venue={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function VenueDetail({ venue, onClose }: { venue: Venue; onClose: () => void }) {
  const [sub, setSub] = useState(0);
  const programmes = programmesByVenue(venue.name);
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
            <GlitchBorder seed={venue.name.length + 31} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
              <img src={venue.img} alt={venue.name} className="w-full aspect-[4/3] object-cover" />
            </GlitchBorder>
          </div>
          <div className="md:col-span-6">
            <h2 className="display uppercase text-3xl md:text-6xl leading-[0.92] tracking-[-0.02em]">{venue.name}</h2>
            <p className="mt-4 text-base md:text-lg max-w-prose leading-relaxed headline whitespace-pre-line">{venue.blurb}</p>

            <div className="mt-8">
              <p className="label text-muted-foreground mb-3">Sub-venues</p>
              <div className="flex flex-wrap gap-2">
                {venue.subVenues.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSub(i)}
                    className={`headline text-xs uppercase tracking-[0.06em] border px-3 py-2 transition-colors ${
                      sub === i
                        ? "bg-foreground text-background border-foreground"
                        : "border-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground headline">
                Selected: <span className="text-foreground">{venue.subVenues[sub]}</span>
              </p>
            </div>

            <a href={venue.directions} target="_blank" rel="noreferrer"
              className="mt-8 inline-block headline text-xs uppercase tracking-[0.06em] border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
              Get directions →
            </a>
          </div>
        </div>

        {/* Interconnectedness: programmes at this venue */}
        {programmes.length > 0 && (
          <div className="mt-16 md:mt-20 rule-t pt-8">
            <div className="flex items-baseline justify-between">
              <h3 className="display uppercase text-2xl md:text-4xl leading-none">What's on here</h3>
              <p className="label text-muted-foreground">{programmes.length} programmes</p>
            </div>
            <ul className="mt-6 divide-y divide-rule">
              {programmes.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/programmes"
                    search={{ p: p.id } as never}
                    onClick={onClose}
                    className="group py-4 flex items-baseline justify-between gap-4 hover:text-accent transition-colors"
                  >
                    <div>
                      <p className="headline font-semibold text-base md:text-xl leading-tight">{p.title}</p>
                      <p className="label text-muted-foreground mt-1 group-hover:text-accent transition-colors">
                        {p.category} · Curated by {p.curator}
                      </p>
                    </div>
                    <p className="label text-muted-foreground shrink-0 text-right group-hover:text-accent transition-colors">{dateLabel(p)} →</p>
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


