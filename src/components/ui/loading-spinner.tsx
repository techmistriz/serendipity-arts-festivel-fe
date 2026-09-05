import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

type LoadingSpinnerProps = ComponentProps<"span"> & {
  size?: "sm" | "default" | "lg";
};

function LoadingSpinner({ className, size = "default", ...props }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "size-3",
    default: "size-4",
    lg: "size-6",
  }[size];

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClass,
        className,
      )}
      {...props}
    />
  );
}

export { LoadingSpinner };
export type { LoadingSpinnerProps };
