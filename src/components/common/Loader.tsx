interface LoaderProps {
  className?: string;
  label?: string;
}

export default function Loader({ className = "", label = "Loading" }: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center py-10 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
