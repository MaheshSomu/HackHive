import { Card } from "./Card";

export function StatCard({
    label,
    value,
    description,
    trend, // optional string/node e.g. "+12% this week"
    trendDirection = "up", // 'up' | 'down' | 'neutral'
    icon: Icon,
    colorTone = "indigo", // 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan'
    className = "",
    ...props
}) {
    const toneStyles = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400",
        rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400",
        cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400",
    };

    const iconStyle = toneStyles[colorTone] || toneStyles.indigo;

    return (
        <Card className={`group relative overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 ${className}`} {...props}>
            <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
                {Icon && (
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconStyle}`}>
                        <Icon className="size-5" />
                    </div>
                )}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
                {trend && (
                    <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            trendDirection === "up"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : trendDirection === "down"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                    >
                        {trend}
                    </span>
                )}
            </div>
            {description && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-snug">{description}</p>}
        </Card>
    );
}

export default StatCard;

