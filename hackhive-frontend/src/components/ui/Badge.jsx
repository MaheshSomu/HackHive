import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1 font-bold tracking-tight rounded-full px-2.5 py-0.5 text-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
                secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                warning: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                destructive: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
                purple: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
                outline: "border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export function Badge({ className, variant, ...props }) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
