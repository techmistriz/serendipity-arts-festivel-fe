import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 border px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em]",
  {
    variants: {
      variant: {
        default: "border-foreground bg-foreground text-background",
        primary: "border-accent bg-accent text-accent-foreground",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        outline: "border-foreground bg-transparent text-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
export type { BadgeProps };
