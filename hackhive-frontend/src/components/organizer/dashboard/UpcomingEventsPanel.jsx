import { Calendar, Plus, ExternalLink, Clock } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";

export default function UpcomingEventsPanel({ events = [], onNavigate, onCreateEvent }) {
    const now = Date.now();

    // Filter upcoming events (startDate > now)
    const upcomingEvents = events
        .filter((e) => {
            const start = e.startDate ? new Date(e.startDate).getTime() : 0;
            return start > 0 && now < start;
        })
        .slice(0, 4);

    return (
        <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                        <Clock className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Events</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Scheduled upcoming hackathons</p>
                    </div>
                </div>
                {upcomingEvents.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onNavigate("/organizer/events")}
                        className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
                    >
                        View All
                    </button>
                )}
            </div>

            {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                    {upcomingEvents.map((evt) => {
                        const startDateStr = evt.startDate
                            ? new Date(evt.startDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                              })
                            : "TBA";

                        return (
                            <div
                                key={evt.id}
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/80 hover:border-purple-200 dark:hover:border-purple-900 transition-colors"
                            >
                                <div className="space-y-1 min-w-0 pr-2">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {evt.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-3 text-slate-400" />
                                            {startDateStr}
                                        </span>
                                        <Badge variant="purple" className="text-[10px] px-2 py-0">
                                            Upcoming
                                        </Badge>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onNavigate("/organizer/events")}
                                    className="shrink-0 text-xs font-bold gap-1 px-3 py-1.5 rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                >
                                    Quick View <ExternalLink className="size-3" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Professional Empty State */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800/60">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Calendar className="size-6" />
                    </div>
                    <div className="space-y-1 max-w-xs">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">No upcoming events.</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            You don't have any upcoming scheduled hackathons. Schedule your next event to start gathering student registrations!
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
