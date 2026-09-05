import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";

import { cn } from "@/utils/cn";

const inputVariants = cva(
  "flex w-full rounded-none border border-input bg-transparent text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 file:mr-4 file:border-0 file:bg-transparent file:font-semibold file:text-foreground",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-3.5 text-sm",
        lg: "h-13 px-4 text-base",
      },
      variant: {
        default: "bg-transparent",
        filled: "bg-muted",
        underline: "border-x-0 border-t-0 px-0",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

type InputProps = Omit<ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ size, variant }), className)}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
