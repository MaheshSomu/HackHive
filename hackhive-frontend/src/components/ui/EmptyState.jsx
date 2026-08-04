import { Inbox } from "lucide-react";
import { Card, CardContent } from "./Card";

export function EmptyState({
    icon: Icon = Inbox,
    title = "No data found",
    description = "There are no records available to display at this time.",
    action,
    className = "",
}) {
    const isComponentIcon = typeof Icon === "function" || (typeof Icon === "object" && Icon !== null && !Icon.$$typeof);

    return (
        <Card className={`border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 ${className}`}>
            <CardContent className="flex flex-col items-center justify-center text-center p-8 sm:p-12 space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-3 text-slate-500 shadow-2xs dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                    {isComponentIcon ? <Icon className="size-7" /> : Icon}
                </div>

                <div className="space-y-1.5 max-w-md">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>

                {action && <div className="pt-2">{action}</div>}
            </CardContent>
        </Card>
    );
}

export default EmptyState;
