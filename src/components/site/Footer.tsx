import { Link } from "@tanstack/react-router";
import { GlitchBar } from "./GlitchBar";
import { PARTNERS, FESTIVAL_LOGO, FOUNDATION_LOGO } from "@/lib/partners";

export function Footer() {
  return (
    <footer className="relative rule-t mt-32 overflow-hidden">
      {/* Moving horizontal glitch strip across the top of the footer */}
      <GlitchBar seed={41} direction="h" speed={5} count={140} className="h-4 w-full" />
      <GlitchBar seed={73} direction="v" variant="bulge" speed={1.4} count={120} className="hidden md:block absolute right-0 top-4 bottom-0 w-2" />
      <GlitchBar seed={58} direction="v" variant="vibrate" speed={0.32} count={120} className="hidden md:block absolute left-0 top-4 bottom-0 w-2" />
      <div className="container-editorial py-16 md:py-24">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-8">
              <img src={FOUNDATION_LOGO.url} alt="Serendipity Arts — Munjal Initiative for Creativity" loading="lazy" className="h-9 md:h-12 w-auto object-contain" />
              <img src={FESTIVAL_LOGO.url} alt="Serendipity Arts Festival" loading="lazy" className="h-14 md:h-20 w-auto object-contain" />
            </div>

            <p className="display uppercase text-2xl md:text-3xl leading-[1.05] mb-6">
              Subscribe to The Serendipity Dispatch, our monthly newsletter.
            </p>

            <form className="flex items-center gap-3 border-b border-foreground pb-2 max-w-md">
              <input
                type="email"
                placeholder="your@email"
                aria-label="Email address"
                className="flex-1 bg-transparent outline-none py-2 text-base placeholder:text-muted-foreground"
              />
              <button className="label hover:text-accent transition-colors">Subscribe &rarr;</button>
            </form>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <p className="label text-muted-foreground mb-4">Navigate</p>
            <ul className="space-y-2 text-sm headline">
              <li><Link to="/programmes" className="hover:text-accent">Programmes</Link></li>
              <li><Link to="/curators" className="hover:text-accent">Curators</Link></li>
              <li><Link to="/venues" className="hover:text-accent">Venues</Link></li>
              <li><Link to="/about" className="hover:text-accent">About us</Link></li>
              <li><Link to="/partners" className="hover:text-accent">Partners</Link></li>
              <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms &amp; Conditions</Link></li>

            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="label text-muted-foreground mb-4">Follow</p>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com/serendipityartsfestival/" target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a></li>
              <li><a href="https://www.youtube.com/@SerendipityArtsFestival" target="_blank" rel="noreferrer" className="hover:text-accent">YouTube</a></li>
              <li><a href="https://x.com/serendipityartf" target="_blank" rel="noreferrer" className="hover:text-accent">X / Twitter</a></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <p className="label text-muted-foreground mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-accent">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 rule-t pt-6">
          <p className="label text-muted-foreground">
            &copy; Serendipity Arts Festival. All rights reserved.
          </p>
          <p className="label text-muted-foreground">
            
          </p>
        </div>
      </div>
    </footer>
  );
}
