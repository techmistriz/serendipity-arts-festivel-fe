import Loader from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type CuratorErrorAlertProps = {
  title: string;
  error: string;
  onRetry: () => void;
  retryDisabled?: boolean;
  className: string;
};

export function CuratorErrorAlert({
  title,
  error,
  onRetry,
  retryDisabled = false,
  className,
}: CuratorErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </div>
        <Button variant="outline" onClick={onRetry} disabled={retryDisabled}>
          Try again
        </Button>
      </div>
    </Alert>
  );
}

export function CuratorEmptyState({ hasActiveFilter }: { hasActiveFilter: boolean }) {
  return (
    <div className="mt-16 text-center">
      <p className="headline text-sm uppercase text-muted-foreground">
        {hasActiveFilter ? "No curators match this discipline" : "No curators are available yet"}
      </p>
    </div>
  );
}

type CuratorLoadingStateProps = {
  label: string;
  variant: "inline" | "overlay";
};

export function CuratorLoadingState({ label, variant }: CuratorLoadingStateProps) {
  return (
    <div
      className={
        variant === "overlay"
          ? "fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          : "mt-40"
      }
      role="status"
      aria-live="polite"
    >
      <Loader />
      <span className="sr-only">{label}</span>
    </div>
  );
}
