import { Activity } from "lucide-react";

export default function RecentActivityPanel() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Recent Activity
            </h2>

            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <Activity className="mx-auto size-9 text-slate-400 mb-3" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    No recent activity
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal max-w-sm mx-auto">
                    New registrations, teams, and submissions will appear here.
                </p>
            </div>
        </div>
    );
}
