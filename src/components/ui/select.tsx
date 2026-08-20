import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";

import { cn } from "@/utils/cn";

const selectVariants = cva(
  "flex h-11 w-full rounded-none border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background",
        filled: "bg-muted",
        underline: "border-x-0 border-t-0 bg-transparent px-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type SelectProps = ComponentProps<"select"> & VariantProps<typeof selectVariants>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, ...props }, ref) => (
    <select ref={ref} className={cn(selectVariants({ variant }), className)} {...props} />
  ),
);

Select.displayName = "Select";

export { Select, selectVariants };
export type { SelectProps };
