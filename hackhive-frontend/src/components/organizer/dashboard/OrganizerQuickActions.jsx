import { Plus, CalendarDays, UserCheck, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "../../ui/Card";

export default function OrganizerQuickActions({ onCreateEvent, onNavigate }) {
    const actions = [
        {
            title: "Create Event",
            description: "Publish a new hackathon with multi-step wizard",
            icon: Plus,
            color: "from-purple-500 to-indigo-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800",
            iconBg: "bg-purple-600 text-white shadow-xs shadow-purple-500/30",
            onClick: onCreateEvent,
        },
        {
            title: "Manage Events",
            description: "View, edit, filter, or manage published events",
            icon: CalendarDays,
            color: "from-indigo-500 to-blue-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800",
            iconBg: "bg-indigo-600 text-white shadow-xs shadow-indigo-500/30",
            onClick: () => onNavigate("/organizer/events"),
        },
        {
            title: "Registrations",
            description: "Check registered students & team rosters",
            icon: UserCheck,
            color: "from-emerald-500 to-teal-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800",
            iconBg: "bg-emerald-600 text-white shadow-xs shadow-emerald-500/30",
            onClick: () => onNavigate("/organizer/registrations"),
        },
        {
            title: "Analytics",
            description: "Monitor engagement, traffic & event growth",
            icon: BarChart3,
            color: "from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800",
            iconBg: "bg-amber-600 text-white shadow-xs shadow-amber-500/30",
            onClick: () => onNavigate("/organizer/analytics"),
        },
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Shortcuts
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Organizer Quick Actions
                    </h3>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {actions.map((act, idx) => {
                    const Icon = act.icon;
                    return (
                        <Card
                            key={idx}
                            onClick={act.onClick}
                            className="group relative cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-700"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`flex size-10 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${act.iconBg}`}>
                                    <Icon className="size-5" />
                                </div>
                                <ArrowRight className="size-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-purple-600 dark:text-slate-600 dark:group-hover:text-purple-400" />
                            </div>

                            <div className="mt-4 space-y-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {act.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                    {act.description}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
