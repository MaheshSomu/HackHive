import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1 font-bold tracking-tight rounded-full px-2.5 py-0.5 text-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1 select-none",
    {
        variants: {
            variant: {
                default: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300",
                primary: "bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white",
                secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300",
                warning: "bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300",
                destructive: "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300",
                purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300",
                navy: "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
                cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300",
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

export function StatusPill({ status = "active", label, className = "", ...props }) {
    const statusMap = {
        active: { variant: "success", dotColor: "bg-emerald-500", text: "Active" },
        enabled: { variant: "success", dotColor: "bg-emerald-500", text: "Enabled" },
        completed: { variant: "success", dotColor: "bg-emerald-500", text: "Completed" },
        pending: { variant: "warning", dotColor: "bg-amber-500", text: "Pending" },
        warning: { variant: "warning", dotColor: "bg-amber-500", text: "Warning" },
        disabled: { variant: "destructive", dotColor: "bg-rose-500", text: "Disabled" },
        failed: { variant: "destructive", dotColor: "bg-rose-500", text: "Failed" },
        inactive: { variant: "secondary", dotColor: "bg-slate-400", text: "Inactive" },
        info: { variant: "default", dotColor: "bg-indigo-500", text: "Info" },
    };

    const config = statusMap[status.toLowerCase()] || statusMap.info;

    return (
        <Badge variant={config.variant} className={cn("gap-1.5 px-2.5 py-0.5", className)} {...props}>
            <span className={`size-1.5 rounded-full ${config.dotColor} animate-pulse`} />
            <span>{label || config.text}</span>
        </Badge>
    );
}

export function Tag({ label, onRemove, variant = "secondary", className = "", ...props }) {
    return (
        <Badge variant={variant} className={cn("gap-1 pr-1.5 py-1 text-xs rounded-lg font-medium", className)} {...props}>
            <span>{label}</span>
            {onRemove && (
                <button
                    type="button"
                    aria-label={`Remove tag ${label}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <X className="size-3" />
                </button>
            )}
        </Badge>
    );
}

export default Badge;

