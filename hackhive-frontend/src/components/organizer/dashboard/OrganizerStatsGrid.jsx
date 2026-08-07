import { CalendarDays, Sparkles, Clock, Users, Layers, FolderGit2 } from "lucide-react";
import { Card } from "../../ui/Card";

export default function OrganizerStatsGrid({ stats }) {
    const cards = [
        {
            title: "Total Events",
            value: stats?.totalEvents ?? 0,
            description: "Events hosted by your organization",
            icon: CalendarDays,
            accent: "from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-100 dark:border-purple-900/60",
            iconBg: "bg-purple-500/10 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
        },
        {
            title: "Active Events",
            value: stats?.activeEvents ?? 0,
            description: "Ongoing live hackathons",
            icon: Sparkles,
            accent: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-100 dark:border-emerald-900/60",
            iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
        },
        {
            title: "Upcoming Events",
            value: stats?.upcomingEvents ?? 0,
            description: "Scheduled for upcoming dates",
            icon: Clock,
            accent: "from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-100 dark:border-indigo-900/60",
            iconBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300",
        },
        {
            title: "Total Registrations",
            value: stats?.totalRegistrations ?? 0,
            description: "Confirmed student signups",
            icon: Users,
            accent: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border-amber-100 dark:border-amber-900/60",
            iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
        },
        {
            title: "Total Teams",
            value: stats?.totalTeams ?? 0,
            description: "Formed hackathon teams",
            icon: Layers,
            accent: "from-cyan-500/10 to-sky-500/10 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 border-cyan-100 dark:border-cyan-900/60",
            iconBg: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300",
        },
        {
            title: "Projects Submitted",
            value: stats?.projectsSubmitted ?? 0,
            description: "Final project submissions",
            icon: FolderGit2,
            accent: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border-rose-100 dark:border-rose-900/60",
            iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={idx}
                        className="group relative overflow-hidden border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        {/* Hover Subtle Gradient Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none`} />

                        <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {card.title}
                                </span>
                                <div className={`flex size-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${card.iconBg}`}>
                                    <Icon className="size-4.5" />
                                </div>
                            </div>

                            <div>
                                <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                                    {card.value}
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
