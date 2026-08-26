import { MediaGridLoadingSkeleton } from "@/components/common/LoadingSkeletons";

import type { LaunchFilm } from "../types";

type LaunchFilmGridProps = {
  films: LaunchFilm[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function LaunchFilmGrid({ films, isLoading, error, onRetry }: LaunchFilmGridProps) {
  if (isLoading) {
    return <MediaGridLoadingSkeleton label="Loading launch films" />;
  }

  if (error) {
    return (
      <div className="mt-10 space-y-4">
        <p role="alert" className="headline text-sm text-muted-foreground">
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="label border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
        >
          Try again
        </button>
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <p className="headline mt-10 text-sm text-muted-foreground">Launch films are coming soon.</p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {films.map((film) => (
        <figure key={film.id} className="border-2 border-black bg-black">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${film.youtube_video_id}`}
              title={`Launch Film ${film.year}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <figcaption className="label bg-black px-3 py-2 text-white">
            Launch Film — {film.year}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
