import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-none border text-sm font-semibold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-foreground text-background hover:bg-accent hover:border-accent",
        primary: "border-accent bg-accent text-accent-foreground hover:brightness-95",
        secondary: "border-secondary bg-secondary text-secondary-foreground hover:bg-muted",
        outline:
          "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        ghost: "border-transparent bg-transparent text-foreground hover:bg-muted",
        link: "border-transparent bg-transparent px-0 text-foreground underline underline-offset-4 hover:text-accent",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:brightness-90",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-11 px-5",
        lg: "h-13 px-7 text-base",
        icon: "size-11 p-0",
        "icon-sm": "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
export type { ButtonProps };
