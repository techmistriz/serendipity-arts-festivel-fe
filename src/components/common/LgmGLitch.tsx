import { SoundGlitch } from "./SoundGlitch";
import { GatherGlitch } from "./GatherGlitch";
import { MatrixBulge } from "./MatrixBulge";

type Variant = "listen" | "gather" | "move";

export function LgmGlitch({
  variant = "listen",
  seed = 11,
  className = "",
}: {
  variant?: Variant;
  seed?: number;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`} aria-hidden>
      {variant === "listen" && <SoundGlitch seed={seed} count={28} className="h-10 md:h-20" />}
      {variant === "gather" && (
        <GatherGlitch
          seed={seed}
          count={70}
          duration={4.5}
          rectWidth={180}
          className="h-8 md:h-14"
        />
      )}
      {variant === "move" && (
        <MatrixBulge seed={seed} count={38} duration={3.6} className="h-10 md:h-20" />
      )}
    </div>
  );
}
