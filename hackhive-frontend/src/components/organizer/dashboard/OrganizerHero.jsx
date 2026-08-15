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
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50">
                        <Sparkles className="size-3.5 text-purple-600 dark:text-purple-400" />
                        HOST OPERATIONS CENTER
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
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-purple-700 active:bg-purple-800 transition-colors"
                    >
                        <Plus className="size-4" /> Create Event
                    </Button>
                </div>
            </div>
        </div>
    );
}
