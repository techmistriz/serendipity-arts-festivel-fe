import * as LabelPrimitive from "@radix-ui/react-label";
import { type ComponentProps, forwardRef } from "react";

import { cn } from "@/utils/cn";

type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "label leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
export type { LabelProps };
