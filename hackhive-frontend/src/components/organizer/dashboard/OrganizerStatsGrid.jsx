import { CalendarDays, Users, Clock, Layers, FolderGit2 } from "lucide-react";

export default function OrganizerStatsGrid({ stats }) {
    const activeCount = stats?.activeEvents ?? 0;
    const upcomingCount = stats?.upcomingEvents ?? 0;

    const cards = [
        {
            title: "Events",
            value: stats?.totalEvents ?? 0,
            supportingText: `${activeCount} active · ${upcomingCount} upcoming`,
            icon: CalendarDays,
            iconBg: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
        },
        {
            title: "Registrations",
            value: stats?.totalRegistrations ?? 0,
            supportingText: "Total registered students",
            icon: Users,
            iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
        },
        {
            title: "Upcoming",
            value: stats?.upcomingEvents ?? 0,
            supportingText: "Upcoming events",
            icon: Clock,
            iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
        },
        {
            title: "Teams",
            value: stats?.totalTeams ?? 0,
            supportingText: "Teams formed",
            icon: Layers,
            iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
        },
        {
            title: "Submissions",
            value: stats?.projectsSubmitted ?? 0,
            supportingText: "Projects submitted",
            icon: FolderGit2,
            iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50",
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Overview
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={idx}
                            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                    {card.title}
                                </span>
                                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                                    <Icon className="size-4" />
                                </div>
                            </div>

                            <div>
                                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {card.value}
                                </div>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal truncate">
                                    {card.supportingText}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
