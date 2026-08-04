import * as React from "react";
import { cn } from "@/lib/utils";

function List({ className, children, ...props }) {
    return (
        <ul className={cn("divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden", className)} {...props}>
            {children}
        </ul>
    );
}

function ListItem({ className, icon, actions, title, description, children, onClick, ...props }) {
    return (
        <li
            onClick={onClick}
            className={cn(
                "flex items-center justify-between gap-4 p-4 text-sm transition-colors duration-150",
                onClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" : "",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {icon && <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{icon}</div>}
                <div className="min-w-0 flex-1 space-y-0.5">
                    {title && <h4 className="truncate font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{title}</h4>}
                    {description && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{description}</p>}
                    {children}
                </div>
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </li>
    );
}

export { List, ListItem };
export default List;
