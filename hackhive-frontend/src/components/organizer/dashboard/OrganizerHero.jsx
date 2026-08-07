import { Plus, Sparkles, Users, CalendarDays, FileCheck, Layers } from "lucide-react";
import { Button } from "../../ui/Button";

export default function OrganizerHero({ user, profile, stats, onCreateEvent }) {
    // Dynamic greeting based on user local time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const name = profile?.organizationName || user?.fullName || "Organizer";

    const summaryChips = [
        {
            label: "Active Events",
            value: stats?.activeEvents ?? 0,
            icon: CalendarDays,
            color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-100 dark:border-purple-900/60",
        },
        {
            label: "Total Registrations",
            value: stats?.totalRegistrations ?? 0,
            icon: Users,
            color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-100 dark:border-emerald-900/60",
        },
        {
            label: "Pending Reviews",
            value: stats?.pendingReviews ?? 0,
            icon: FileCheck,
            color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border-amber-100 dark:border-amber-900/60",
        },
        {
            label: "Teams Managed",
            value: stats?.totalTeams ?? 0,
            icon: Layers,
            color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-100 dark:border-indigo-900/60",
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all">
            {/* Background Decorative Accent */}
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Greeting & Subtitle */}
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-100 dark:border-purple-900/60">
                        <Sparkles className="size-3.5 text-purple-600 dark:text-purple-400" />
                        Host Operations Center
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        {getGreeting()}, {name} 👋
                    </h1>
                    <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Welcome back to your Organizer Workspace. Monitor registrations, orchestrate hackathons, and evaluate project submissions.
                    </p>

                    {/* Summary Chips */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3">
                        {summaryChips.map((chip, idx) => {
                            const Icon = chip.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-bold border transition-all ${chip.color}`}
                                >
                                    <Icon className="size-3.5" />
                                    <span>
                                        {chip.label}: <strong className="font-black">{chip.value}</strong>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Primary Action Button */}
                <div className="shrink-0">
                    <Button
                        type="button"
                        onClick={onCreateEvent}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs gap-2 px-6 py-3 rounded-2xl shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="size-4" /> Create Event
                    </Button>
                </div>
            </div>
        </div>
    );
}
