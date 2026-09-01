import { BarChart3, TrendingUp, Users, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

export default function AnalyticsPreviewCard({ events = [], onNavigate }) {
    const hasRegistrations = events.some((e) => (e.registrationsCount || 0) > 0);

    return (
        <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                        <BarChart3 className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Event Analytics Overview</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Live audience metrics & registration velocity</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onNavigate("/organizer/analytics")}
                    className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                >
                    Full Analytics <ArrowRight className="size-3" />
                </button>
            </div>

            {hasRegistrations ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/60 space-y-1">
                        <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-bold">
                            <span>Registration Growth</span>
                            <TrendingUp className="size-4" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                            {events.reduce((sum, e) => sum + (e.registrationsCount || 0), 0)}
                        </p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                            Total registered students across all events
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 font-bold">
                            <span>Active Hackathons</span>
                            <Sparkles className="size-4" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                            {events.length}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                            Published event instances
                        </p>
                    </div>
                </div>
            ) : (
                /* Professional Placeholder Card */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800/60">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                        <BarChart3 className="size-6" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Analytics will appear after your first event receives registrations.
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Once students register for your hackathons, detailed engagement graphs, conversion rates, and team analytics will populate here automatically.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("/organizer/analytics")}
                        className="text-xs font-bold gap-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 mt-1"
                    >
                        Explore Analytics Portal
                    </Button>
                </div>
            )}
        </Card>
    );
}
