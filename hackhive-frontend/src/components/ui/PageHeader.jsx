import { Card, CardContent } from "./Card";

export function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    children,
    className = "",
}) {
    return (
        <Card className={`overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 ${className}`}>
            <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        {eyebrow && (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                {eyebrow}
                            </span>
                        )}
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                {description}
                            </p>
                        )}
                    </div>

                    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                </div>

                {children && <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">{children}</div>}
            </CardContent>
        </Card>
    );
}
