import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";

import { cn } from "@/utils/cn";

const textareaVariants = cva(
  "flex min-h-28 w-full resize-y rounded-none border border-input bg-transparent px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        filled: "bg-muted",
        underline: "border-x-0 border-t-0 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TextareaProps = ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => (
    <textarea ref={ref} className={cn(textareaVariants({ variant }), className)} {...props} />
  ),
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
export type { TextareaProps };
