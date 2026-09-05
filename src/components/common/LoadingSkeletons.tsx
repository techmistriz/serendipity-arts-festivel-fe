import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

type LoadingSkeletonProps = {
  className?: string;
  label?: string;
};

type ContentGridSkeletonProps = LoadingSkeletonProps & {
  count?: number;
};

function LoadingAnnouncement({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>;
}

export function RouteLoadingOverlay({ label = "Loading page" }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-background/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <span
          className="h-11 w-11 animate-spin rounded-full border-[3px] border-foreground/20 border-t-accent"
          aria-hidden="true"
        />
        <span className="label text-muted-foreground">Loading</span>
      </div>
      <LoadingAnnouncement label={label} />
    </div>
  );
}

export function PageLoadingSkeleton({ className, label = "Loading page" }: LoadingSkeletonProps) {
  return (
    <div className={cn("container-editorial py-10 pb-32 md:py-20", className)} aria-busy="true">
      <Skeleton className="h-[clamp(4rem,10vw,9rem)] w-4/5 max-w-4xl" />
      <div className="mt-8 max-w-2xl space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <ContentGridSkeleton count={4} className="mt-14" label={label} />
    </div>
  );
}

export function ContentGridSkeleton({
  className,
  count = 4,
  label = "Loading content",
}: ContentGridSkeletonProps) {
  return (
    <div className={cn("mt-12", className)} role="status" aria-live="polite">
      <LoadingAnnouncement label={label} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} aria-hidden="true">
            <Skeleton className="aspect-square w-full" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VenueGridLoadingSkeleton({
  className,
  count = 4,
  label = "Loading venues",
}: ContentGridSkeletonProps) {
  return (
    <div className={cn("mt-12 md:mt-16", className)} role="status" aria-live="polite">
      <LoadingAnnouncement label={label} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} aria-hidden="true">
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="mt-4 h-7 w-3/4 md:h-10" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <Skeleton className="mt-3 h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoGridLoadingSkeleton({
  className,
  count = 8,
  label = "Loading partners",
}: ContentGridSkeletonProps) {
  return (
    <div className={cn("mt-8 border", className)} role="status" aria-live="polite">
      <LoadingAnnouncement label={label} />

      <div className="flex snap-x snap-mandatory overflow-hidden md:grid md:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`flex w-[46vw] min-h-[140px] shrink-0 flex-col justify-between px-4 py-5 md:w-auto md:min-h-[180px] md:px-6 md:py-6 ${
              index !== count - 1 ? "border-r" : ""
            }`}
            aria-hidden="true"
          >
            <div className="grid flex-1 place-items-center">
              <Skeleton className="h-[72px] w-[120px] md:h-[92px] md:w-[150px]" />
            </div>

            <div className="mt-3 flex justify-center">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaGridLoadingSkeleton({
  className,
  count = 4,
  label = "Loading media",
}: ContentGridSkeletonProps) {
  return (
    <div className={cn("mt-10", className)} role="status" aria-live="polite">
      <LoadingAnnouncement label={label} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} aria-hidden="true">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="mt-2 h-3 w-2/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailPageLoadingSkeleton({
  className,
  label = "Loading details",
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn("container-editorial py-10 pb-24 md:pt-16 md:pb-32", className)}
      aria-busy="true"
    >
      <Skeleton className="h-3 w-24" />
      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-12 md:gap-10">
        <Skeleton className="aspect-[4/3] w-full md:col-span-6" />
        <div className="space-y-5 md:col-span-6">
          <Skeleton className="h-14 w-4/5 md:h-24" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="mt-8 h-11 w-40" />
        </div>
      </div>
      <div className="mt-16 border-t border-rule pt-8">
        <Skeleton className="h-9 w-48" />
        <ContentGridSkeleton count={4} className="mt-8" label={label} />
      </div>
    </div>
  );
}

export function ListRowsLoadingSkeleton({
  className,
  count = 3,
  label = "Loading items",
}: ContentGridSkeletonProps) {
  return (
    <div className={cn("rule-t", className)} role="status" aria-live="polite">
      <LoadingAnnouncement label={label} />
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rule-b flex items-center gap-4 py-5 md:gap-6 md:py-6"
          aria-hidden="true"
        >
          <Skeleton className="h-16 w-16 shrink-0 md:h-24 md:w-24" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function FormLoadingSkeleton({ className, label = "Loading form" }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-8", className)} role="status" aria-live="polite">
      <LoadingAnnouncement label={label} />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2" aria-hidden="true">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </div>
  );
}
