import { Plus, Sparkles } from "lucide-react";
import { Button } from "../../ui/Button";

export default function OrganizerHero({ user, profile, onCreateEvent }) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good morning";
        if (hour >= 12 && hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const organizerName = user?.fullName || profile?.organizationName || "Organizer";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                        <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                        ORGANIZER DASHBOARD
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        {getGreeting()}, {organizerName} 👋
                    </h1>
                    <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                        Manage your hackathons, registrations, teams, and submissions from one place.
                    </p>
                </div>

                <div className="shrink-0">
                    <Button
                        type="button"
                        onClick={onCreateEvent}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-slate-800 active:bg-slate-950 transition-colors dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <Plus className="size-4" /> Create Event
                    </Button>
                </div>
            </div>
        </div>
    );
}
