import { Activity, CalendarDays, CheckCircle2, Clock, Plus } from "lucide-react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

export default function RecentActivityPanel({ events = [], onCreateEvent }) {
    // Generate activity items dynamically from real event list if available
    const activities = events.slice(0, 4).map((evt) => ({
        id: evt.id,
        title: `Event "${evt.title || "Untitled"}" published`,
        timestamp: evt.startDate ? new Date(evt.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Recently",
        type: "event",
    }));

    return (
        <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
                        <Activity className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Activity</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Live operational events & actions</p>
                    </div>
                </div>
            </div>

            {activities.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                    {activities.map((act) => (
                        <div key={act.id} className="relative flex items-start gap-4 pl-8">
                            <div className="absolute left-1.5 top-1 size-4 rounded-full bg-purple-600 text-white ring-4 ring-white dark:ring-slate-900 flex items-center justify-center">
                                <CheckCircle2 className="size-3" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{act.title}</p>
                                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Clock className="size-3" />
                                    <span>{act.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Professional Empty State */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800/60">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <Activity className="size-6" />
                    </div>
                    <div className="space-y-1 max-w-xs">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">No recent activity yet.</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Activity notifications and registration logs will appear here when your hackathons go live.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={onCreateEvent}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 px-4 py-2 rounded-xl mt-1"
                    >
                        <Plus className="size-3.5" /> Create Event
                    </Button>
                </div>
            )}
        </Card>
    );
}
