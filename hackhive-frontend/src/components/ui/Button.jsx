import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out outline-none select-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500",
        primary:
          "bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80",
        outline:
          "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        destructive:
          "bg-rose-600 text-white shadow-xs hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500 focus-visible:ring-rose-500/50",
        link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400 p-0 h-auto font-medium",
      },
      size: {
        default: "h-9 px-4 py-2 gap-2 text-xs sm:text-sm",
        xs: "h-7 px-2.5 text-xs rounded-lg gap-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 px-6 text-sm sm:text-base rounded-xl gap-2",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 rounded-xl [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin size-4 shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };

