import Loader from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type AsyncErrorAlertProps = {
  title: string;
  error: string;
  onRetry: () => void;
  retryDisabled?: boolean;
  className: string;
};

export function AsyncErrorAlert({
  title,
  error,
  onRetry,
  retryDisabled = false,
  className,
}: AsyncErrorAlertProps) {
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

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-16 text-center">
      <p className="headline text-sm uppercase text-muted-foreground">{message}</p>
    </div>
  );
}

type LoadingStateProps = {
  label: string;
  variant: "inline" | "overlay";
};

export function LoadingState({ label, variant }: LoadingStateProps) {
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
