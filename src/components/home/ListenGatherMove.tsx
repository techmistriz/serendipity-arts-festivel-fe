import { LgmGlitch } from "../common/LgmGLitch";

export function ListenGatherMove() {
  return (
    <section className="container-editorial mt-20 md:mt-32">
      <div className="border border-foreground p-6 md:p-10 lg:p-14">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="label mb-3 text-muted-foreground">
              Visual language for the 2026 festival
            </p>

            <h2 className="display text-5xl uppercase leading-[0.85] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-8xl">
              Listen
              <br />
              Gather
              <br />
              Move
            </h2>
          </div>

          <div className="space-y-4 md:col-span-7">
            <LgmGlitch variant="listen" seed={11} className="border-y border-foreground py-3" />

            <LgmGlitch variant="gather" seed={13} className="border-y border-foreground py-3" />

            <LgmGlitch variant="move" seed={17} className="border-y border-foreground py-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
