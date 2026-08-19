import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

function Field({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function FieldError({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-destructive", className)} role="alert" {...props} />;
}

export { Field, FieldDescription, FieldError };
