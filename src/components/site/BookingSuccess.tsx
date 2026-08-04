// Success panel shown after a successful booking / checkout.
// LGM motifs appear as smaller "logo marks" alongside each word, in
// the CMYK palette. Copy is short and confident.
import { Link } from "@tanstack/react-router";
import { SoundGlitch } from "./SoundGlitch";
import { GatherGlitch } from "./GatherGlitch";
import { MatrixBulge } from "./MatrixBulge";
import { GlitchBar } from "./GlitchBar";

type Props = {
  title?: string;
  onClose: () => void;
};

export function BookingSuccess({
  title = "Booking successful.",
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md overflow-y-auto ed-fade">
      <GlitchBar seed={9} direction="v" variant="vibrate" speed={0.4} count={90} className="fixed left-0 top-0 bottom-0 w-1.5 z-10" />
      <GlitchBar seed={41} direction="v" variant="bulge" speed={1.6} count={90} className="fixed right-0 top-0 bottom-0 w-1.5 z-10" />

      <div className="container-editorial pt-6 md:pt-10 pb-16 max-w-4xl">
        <div className="flex items-center justify-between rule-b pb-4">
          <p className="label text-accent">Confirmation</p>
          <button onClick={onClose} className="label hover:text-accent">Close ×</button>
        </div>

        <div className="mt-10 md:mt-16">
          <h2 className="display uppercase text-[12vw] md:text-[6.5vw] leading-[0.9] tracking-[-0.03em]">
            {title}
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground headline text-base">
            Your programmes will be added to your Art Pass, available to download closer to the festival on our app. Just show it at any venue in front of our zappers.
          </p>
        </div>

        {/* LGM logo marks — compact rows, each word paired with its motif */}
        <div className="mt-12 md:mt-16 space-y-4 md:space-y-5">
          <LGMRow word="Listen">
            <SoundGlitch seed={19} count={22} className="h-10 md:h-12" />
          </LGMRow>
          <LGMRow word="Gather">
            <GatherGlitch seed={53} count={70} duration={4.5} rectWidth={200} barHeight="50%" className="h-10 md:h-12" />
          </LGMRow>
          <LGMRow word="Move">
            <MatrixBulge seed={71} count={26} duration={3.2} className="h-10 md:h-12" />
          </LGMRow>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/programmes" onClick={onClose}
            className="headline uppercase tracking-[0.06em] text-sm md:text-base border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}

function LGMRow({ word, children }: { word: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 items-center gap-3 md:gap-6 rule-t pt-4 md:pt-5">
      <p
        className="col-span-4 display uppercase text-foreground text-[9vw] md:text-[4vw] leading-[0.85] tracking-[-0.03em]"
      >
        {word}.
      </p>
      <div className="col-span-8">{children}</div>
    </div>
  );
}
