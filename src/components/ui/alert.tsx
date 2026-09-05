import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

type AlertProps = ComponentProps<"div"> & {
  variant?: "default" | "info" | "success" | "warning" | "destructive";
};

const alertStyles = {
  default: "border-foreground bg-muted text-foreground",
  info: "border-accent bg-accent/10 text-foreground",
  success:
    "border-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50",
  warning: "border-amber-600 bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-50",
  destructive: "border-destructive bg-destructive/10 text-foreground",
} as const;

const alertIcons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: AlertCircle,
} as const;

function Alert({ className, variant = "default", children, ...props }: AlertProps) {
  const Icon = alertIcons[variant];

  return (
    <div
      role="alert"
      className={cn("flex gap-3 border p-4 text-sm", alertStyles[variant], className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: ComponentProps<"h5">) {
  return <h5 className={cn("font-semibold", className)} {...props} />;
}

function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-1 text-sm leading-relaxed", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
export type { AlertProps };
