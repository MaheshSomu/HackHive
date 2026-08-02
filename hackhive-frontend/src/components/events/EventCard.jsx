import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    MapPin,
    Shield,
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

function getCountdownText(deadlineString) {
    if (!deadlineString) return "Open";
    const deadline = new Date(deadlineString);
    if (Number.isNaN(deadline.getTime())) return "Open";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.round((deadline.getTime() - today.getTime()) / 86400000);
    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Closes Today";
    if (diffDays === 1) return "Closes Tomorrow";
    return `${diffDays} days left`;
}

export default function EventCard({
    event,
    isRegistered,
    onViewDetails,
    onRegister,
    onCancel,
    isRegistering,
}) {
    const isClosed = getCountdownText(event.registrationEndDate) === "Closed";
    const countdown = getCountdownText(event.registrationEndDate);

    return (
        <Card className="group relative flex flex-col justify-between overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div>
                {/* Banner / Card Header */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                    {event.bannerUrl ? (
                        <img
                            src={event.bannerUrl}
                            alt={event.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-6 text-white">
                            <div className="text-center">
                                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-100 backdrop-blur-xs">
                                    {event.eventMode || "Hackathon"}
                                </span>
                                <h3 className="mt-2 line-clamp-1 text-lg font-extrabold tracking-tight">
                                    {event.title}
                                </h3>
                            </div>
                        </div>
                    )}

                    {/* Status Badge Overlays */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {isRegistered ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                <CheckCircle2 className="size-3" /> Registered
                            </span>
                        ) : isClosed ? (
                            <span className="rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                Registration Closed
                            </span>
                        ) : (
                            <span className="rounded-full bg-indigo-600/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                {countdown}
                            </span>
                        )}
                    </div>

                    <div className="absolute top-3 right-3">
                        <span className="rounded-full border border-white/20 bg-slate-950/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                            {event.eventMode || "Hybrid"}
                        </span>
                    </div>
                </div>

                {/* Card Content */}
                <CardContent className="space-y-4 p-5">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Building2 className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-semibold truncate">
                                {event.organizerName || event.collegeName || "HackHive Host"}
                            </span>
                        </div>

                        <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-100">
                            {event.title}
                        </h3>

                        {event.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Calendar className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{formatDate(event.startDate)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Clock className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Deadline: {formatDate(event.registrationEndDate)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Users className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Team: {event.minTeamSize || 1}-{event.maxTeamSize || 4} members</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <MapPin className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{event.location || event.eventMode || "Online"}</span>
                        </div>
                    </div>

                    {/* Eligibility Badge */}
                    {event.eligibility && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <Shield className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate font-medium">{event.eligibility}</span>
                        </div>
                    )}
                </CardContent>
            </div>

            {/* Card Actions Footer */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(event)}
                    className="flex-1 rounded-xl text-xs font-semibold"
                >
                    View Details
                </Button>

                {isRegistered ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel(event.id)}
                        disabled={isRegistering}
                        className="rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                        {isRegistering ? "Cancelling..." : "Cancel"}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="sm"
                        disabled={isClosed || isRegistering}
                        onClick={() => onRegister(event.id)}
                        className="flex-1 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                    >
                        {isRegistering ? "Registering..." : isClosed ? "Closed" : "Register Now"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
