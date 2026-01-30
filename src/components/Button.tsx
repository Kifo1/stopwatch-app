import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils.js";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva("hover:cursor-pointer rounded", {
  variants: {
    variant: {
      primary:
        "text-white bg-blue-500 hover:bg-blue-600 rounded-full font-bold text-xl tracking-wide transition-all transform hover:scale-101 active:scale-100 flex items-center justify-center gap-3",
      secondary: "",
      danger: "",
      success: "",
      ghost: "",
    },
    scale: {
      sm: "",
      md: "pt-2 pb-2 pl-4 pr-4",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    scale: "md",
  },
});

interface ButtonComponentProps
  extends
    VariantProps<typeof buttonVariants>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function Button({
  children,
  variant,
  scale,
  className,
  ...props
}: ButtonComponentProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, scale, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
