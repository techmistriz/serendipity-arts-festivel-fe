import Link from "next/link";

export default function SeaPage() {
  return (
    <div className="container-editorial pt-10 md:pt-16 pb-32">
      {/* Film banner */}
      <div className="relative overflow-hidden bg-black text-white aspect-[16/7] md:aspect-[16/5] w-full">
        <video
          src="/saf-aftermovie.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <h1 className="display uppercase text-white text-[9vw] md:text-[5.5vw] leading-[0.9] tracking-[-0.03em] text-center max-w-[18ch]">
            Serendipity Exchange for the Arts
          </h1>
        </div>
      </div>

      <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7">
          <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
            A delegate programme, parallel to the Festival.
          </p>
          <p className="mt-6 headline text-base md:text-lg text-muted-foreground max-w-prose">
            Serendipity Exchange for the Arts (SEA) is a delegate program running parallel to the
            Serendipity Arts Festival (SAF) 2026. It is envisioned as a vital platform for artists,
            companies, curators, producers, and arts managers to present their work, exchange ideas,
            and foster future collaborations, thereby reaching newer and wider audiences.
          </p>
        </div>

        <aside className="md:col-span-5">
          <div className="border border-foreground p-6 md:p-8">
            <p className="label text-accent">SEA Registration</p>
            <p className="mt-3 headline font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em]">
              Register as a delegate — programming is complimentary.
            </p>
            <p className="mt-4 text-sm text-muted-foreground headline">
              Email, full name, gender, country, state, city and a verified WhatsApp number. That’s
              it.
            </p>
            <Link
              href="/register?mode=sea&next="
              className="mt-6 inline-block headline uppercase tracking-[0.06em] text-sm bg-foreground text-background rounded-full px-6 py-3 hover:bg-accent transition-colors"
            >
              SEA Registration →
            </Link>
          </div>

          <div className="mt-6 border border-foreground p-6 md:p-8">
            <p className="label">Who it’s for</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground headline list-disc pl-5">
              <li>Artists and companies presenting work</li>
              <li>Curators and producers</li>
              <li>Arts managers and cultural organisations</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
