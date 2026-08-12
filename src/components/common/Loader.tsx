interface LoaderProps {
  className?: string;
}

export default function Loader({ className = "" }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
    </div>
  );
}