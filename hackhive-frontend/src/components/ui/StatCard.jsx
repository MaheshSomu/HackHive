import { Card } from "./Card";

export function StatCard({
    label,
    value,
    description,
    icon: Icon,
    colorTone = "indigo", // 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan'
    className = "",
}) {
    const toneStyles = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
        rose: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
        cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400",
    };

    const iconStyle = toneStyles[colorTone] || toneStyles.indigo;

    return (
        <Card className={`border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
                {Icon && (
                    <div className={`flex size-9 items-center justify-center rounded-xl ${iconStyle}`}>
                        <Icon className="size-4.5" />
                    </div>
                )}
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
            {description && <p className="mt-1 text-[11px] text-slate-500">{description}</p>}
        </Card>
    );
}
