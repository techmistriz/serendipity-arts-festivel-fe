"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section narrow">
      <p>Something went wrong while loading this page.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
