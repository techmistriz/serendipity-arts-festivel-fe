"use client";

type ComingSoonPopupProps = {
  open: boolean;
  onClose: () => void;
};

export default function ComingSoonPopup({
  open,
  onClose,
}: ComingSoonPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 ">
      <div className="relative w-full max-w-xl bg-background px-10 py-14 text-center shadow-2xl md:px-16 md:py-20 rounded-lg">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-5 top-5 text-3xl leading-none transition-colors hover:text-accent"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="display text-5xl uppercase md:text-6xl">
          Coming Soon
        </h2>

        {/* Description */}
        <p className="  mx-auto mt-6 max-w-md text-base leading-7 text-muted-foreground md:text-lg">
          Our programmes will be available soon.
          <br />
          Please check back later.
        </p>

        {/* Close button */}
        {/* <button
          type="button"
          onClick={onClose}
          className="mt-10 bg-foreground px-10 py-4 text-sm uppercase tracking-wider text-background transition-colors hover:bg-accent"
        >
          Close
        </button> */}
      </div>
    </div>
  );
}