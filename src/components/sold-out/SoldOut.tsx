// src/components/common/SoldOut.tsx

type SoldOutProps = {
  className?: string;
};

export function SoldOut({ className = "" }: SoldOutProps) {
  return (
    <div
      role="status"
      aria-label="Sold out"
      className={`sold-out flex items-center justify-center gap-3 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 88"
        className="sold-out-ticket h-[1.7em] w-[2em] shrink-0 overflow-visible"
      >
        <path
          className="sold-out-spark"
          d="M8 15l-4-5m13 1V5m66 13l7-4M87 30l8 1"
          fill="none"
          stroke="var(--sold-out-pop)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g className="sold-out-character">
          <path
            d="M25 66l-5 10h-8m49-10l5 10h8"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M17 23h62v13a8 8 0 000 16v13H17V52a8 8 0 000-16Z"
            fill="var(--sold-out-ticket)"
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          <path d="M65 26v36" stroke="var(--foreground)" strokeWidth="2" strokeDasharray="3 4" />

          <path
            d="M17 45L8 38m71 7l8-9"
            stroke="var(--foreground)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            className="sold-out-wave"
            d="M87 36l-1-8m1 8l7-4"
            stroke="var(--foreground)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle cx="33" cy="39" r="2.5" fill="var(--foreground)" />
          <circle cx="49" cy="39" r="2.5" fill="var(--foreground)" />

          <path
            d="M34 47q7 8 14 0"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <circle cx="27" cy="46" r="3" fill="var(--sold-out-pop)" />
          <circle cx="55" cy="46" r="3" fill="var(--sold-out-pop)" />
        </g>
      </svg>

      <div className="min-w-0">
        <p className="display uppercase leading-none text-[1em]">Sold out!</p>
      </div>
    </div>
  );
}
