import { Calendar, Plus, Users, ArrowUpRight, Sparkles } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";

export default function RecentEventsSection({ events = [], onNavigate, onCreateEvent }) {
    const recentEvents = events.slice(0, 6);

    const getStatusConfig = (evt) => {
        const now = Date.now();
        const start = evt.startDate ? new Date(evt.startDate).getTime() : 0;
        const end = evt.endDate ? new Date(evt.endDate).getTime() : 0;

        if (start > 0 && now < start) {
            return { label: "Upcoming", variant: "navy" };
        }
        if (start > 0 && now >= start && (end === 0 || now <= end)) {
            return { label: "Active Live", variant: "success" };
        }
        if (end > 0 && now > end) {
            return { label: "Completed", variant: "secondary" };
        }
        return { label: "Published", variant: "default" };
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Portfolio Overview
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Recent Hackathon Events
                    </h3>
                </div>
                {events.length > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("/organizer/events")}
                        className="text-xs font-bold gap-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Manage All Events ({events.length})
                    </Button>
                )}
            </div>

            {recentEvents.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recentEvents.map((evt) => {
                        const status = getStatusConfig(evt);
                        const startDateStr = evt.startDate
                            ? new Date(evt.startDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                              })
                            : "TBD";

                        return (
                            <Card
                                key={evt.id}
                                className="group relative overflow-hidden border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                            >
                                {/* Banner / Header Graphic */}
                                <div className="relative h-32 w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
                                    {evt.bannerUrl ? (
                                        <img
                                            src={evt.bannerUrl}
                                            alt={evt.title}
                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={status.variant} className="font-extrabold shadow-2xs">
                                            {status.label}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                    <div className="space-y-1.5">
                                        <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                            {evt.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                                            {evt.description || "No description provided."}
                                        </p>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                {startDateStr}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                                <Users className="size-3.5 text-emerald-600" />
                                                {evt.registrationsCount ?? 0} Registered
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onNavigate("/organizer/events")}
                                                className="w-full text-xs font-bold gap-1 rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                            >
                                                Manage Event <ArrowUpRight className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                /* Professional Empty State */
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50/50 p-10 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900/40 shadow-2xs">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        <Sparkles className="size-7" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                            You haven't created any events yet.
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                            Get started by publishing your first hackathon event to engage students, manage submissions, and organize teams.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={onCreateEvent}
                        className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-bold text-xs gap-2 px-6 py-2.5 rounded-xl shadow-md"
                    >
                        <Plus className="size-4" /> Create First Event
                    </Button>
                </div>
            )}
        </div>
    );
}
