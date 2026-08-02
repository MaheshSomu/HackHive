import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    MapPin,
    Trash2,
    Users,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

function formatDate(dateString) {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "TBD";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function getEventStatus(startDateStr, endDateStr, regEndDateStr) {
    const now = Date.now();
    const start = startDateStr ? new Date(startDateStr).getTime() : 0;
    const end = endDateStr ? new Date(endDateStr).getTime() : 0;

    if (end > 0 && now > end) return { label: "Ended", tone: "slate" };
    if (start > 0 && now >= start) return { label: "Live Now", tone: "emerald" };
    return { label: "Upcoming", tone: "indigo" };
}

export default function OrganizerEventCard({
    event,
    onView,
    onEdit,
    onDelete,
    registrationCount = 0,
}) {
    const status = getEventStatus(event.startDate, event.endDate, event.registrationEndDate);

    return (
        <Card className="group relative flex flex-col justify-between overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div>
                {/* Banner */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                    {event.bannerUrl ? (
                        <img
                            src={event.bannerUrl}
                            alt={event.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 p-6 text-white">
                            <div className="text-center">
                                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                                    {event.eventMode || "Hybrid"}
                                </span>
                                <h3 className="mt-1 line-clamp-1 text-base font-extrabold">{event.title}</h3>
                            </div>
                        </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                        <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs ${
                                status.tone === "emerald"
                                    ? "bg-emerald-600/90"
                                    : status.tone === "indigo"
                                    ? "bg-indigo-600/90"
                                    : "bg-slate-700/90"
                            }`}
                        >
                            {status.label}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3">
                        <span className="rounded-full border border-white/20 bg-slate-950/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                            {event.eventMode || "Hybrid"}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="space-y-3 p-5">
                    <div>
                        <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-100">
                            {event.title}
                        </h3>
                        {event.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Calendar className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Starts: {formatDate(event.startDate)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Clock className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Reg End: {formatDate(event.registrationEndDate)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Users className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Team: {event.minTeamSize || 1}-{event.maxTeamSize || 4}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <MapPin className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{event.location || "Online"}</span>
                        </div>
                    </div>
                </CardContent>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onView(event)}
                    className="flex-1 rounded-xl text-xs font-semibold"
                >
                    View Registrations
                </Button>

                <button
                    type="button"
                    onClick={() => onEdit(event)}
                    className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    title="Edit Event"
                >
                    <Edit2 className="size-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(event.id)}
                    className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:hover:bg-rose-950/40"
                    title="Delete Event"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>
        </Card>
    );
}
