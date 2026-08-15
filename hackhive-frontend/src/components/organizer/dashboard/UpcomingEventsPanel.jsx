import { Calendar, Plus } from "lucide-react";
import { Button } from "../../ui/Button";

const formatDateRange = (start, end) => {
    if (!start) return "Date TBD";
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) return "Date TBD";

    const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();

    if (!end) {
        return `${startMonth} ${startDay}, ${startYear}`;
    }

    const endDate = new Date(end);
    if (isNaN(endDate.getTime())) {
        return `${startMonth} ${startDay}, ${startYear}`;
    }

    const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
    const endDay = endDate.getDate();
    const endYear = endDate.getFullYear();

    if (startYear === endYear) {
        if (startMonth === endMonth) {
            if (startDay === endDay) {
                return `${startMonth} ${startDay}, ${startYear}`;
            }
            return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
        }
        return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
};

const formatRegClosingDate = (regEnd) => {
    if (!regEnd) return null;
    const date = new Date(regEnd);
    if (isNaN(date.getTime())) return null;
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `Registration closes ${month} ${day}`;
};

export default function UpcomingEventsPanel({ events = [], onNavigate, onCreateEvent }) {
    const now = Date.now();

    // Filter upcoming events (startDate > now)
    const upcomingEvents = events.filter((e) => {
        const start = e.startDate ? new Date(e.startDate).getTime() : 0;
        return start > 0 && now < start;
    });

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Upcoming Events
            </h2>

            {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                    {upcomingEvents.map((evt) => {
                        const regCount = evt.registrationCount ?? evt.registrationsCount ?? 0;
                        const regCountText = `${regCount} ${regCount === 1 ? "registration" : "registrations"}`;
                        const regClosing = formatRegClosingDate(evt.registrationEndDate);

                        return (
                            <div
                                key={evt.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-purple-200 dark:hover:border-purple-900"
                            >
                                <div className="space-y-1.5 min-w-0">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {evt.title}
                                        </h3>
                                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50">
                                            Upcoming
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-normal">
                                        <span>{formatDateRange(evt.startDate, evt.endDate)}</span>
                                        <span>•</span>
                                        <span>{evt.eventMode || "Offline"}</span>
                                        <span>•</span>
                                        <span>{regCountText}</span>
                                        {regClosing && (
                                            <>
                                                <span>•</span>
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">
                                                    {regClosing}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0 self-start sm:self-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onNavigate(`/organizer/events`)}
                                        className="rounded-lg border-slate-200 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-300 transition-colors"
                                    >
                                        View Event
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Professional Empty State */
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <Calendar className="mx-auto size-9 text-slate-400 mb-3" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        No upcoming events
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal max-w-sm mx-auto">
                        Create an event to start building your event portfolio.
                    </p>
                    <Button
                        type="button"
                        onClick={onCreateEvent}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700 transition-colors shadow-xs"
                    >
                        <Plus className="size-4" /> Create Event
                    </Button>
                </div>
            )}
        </div>
    );
}
