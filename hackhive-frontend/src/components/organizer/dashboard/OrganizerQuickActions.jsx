import { Plus, CalendarDays, UserCheck, BarChart3 } from "lucide-react";

export default function OrganizerQuickActions({ onCreateEvent, onNavigate }) {
    const actions = [
        {
            title: "Create Event",
            icon: Plus,
            onClick: onCreateEvent,
        },
        {
            title: "Manage Events",
            icon: CalendarDays,
            onClick: () => onNavigate("/organizer/events"),
        },
        {
            title: "Registrations",
            icon: UserCheck,
            onClick: () => onNavigate("/organizer/registrations"),
        },
        {
            title: "Analytics",
            icon: BarChart3,
            onClick: () => onNavigate("/organizer/analytics"),
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Quick Actions
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {actions.map((act, idx) => {
                    const Icon = act.icon;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={act.onClick}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-xs hover:border-blue-300 hover:bg-slate-50 hover:text-slate-900 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 dark:hover:text-slate-100 group"
                        >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950/80 dark:group-hover:text-blue-400 transition-colors">
                                <Icon className="size-4" />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {act.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
