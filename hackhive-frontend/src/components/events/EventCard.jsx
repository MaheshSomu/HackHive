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
    userRegistration,
    onViewDetails,
    onRegister,
    onCancel,
    onViewReceipt,
    isRegistering,
}) {
    const isClosed = getCountdownText(event.registrationEndDate) === "Closed";
    const countdown = getCountdownText(event.registrationEndDate);

    const isConfirmed = isRegistered || (userRegistration && (!userRegistration.status || userRegistration.status === "CONFIRMED"));
    const isPendingPayment = userRegistration && userRegistration.status === "PENDING_PAYMENT";
    const isFull = event.maxParticipants && event.maxParticipants > 0 && (event.registrationCount ?? 0) >= event.maxParticipants;

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
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        {isConfirmed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                <CheckCircle2 className="size-3" /> {userRegistration?.paymentStatus === "PAID" ? "Registered / Paid" : "Registered"}
                            </span>
                        ) : isPendingPayment ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                Payment Pending
                            </span>
                        ) : isClosed ? (
                            <span className="rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                Registration Closed
                            </span>
                        ) : isFull ? (
                            <span className="rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs backdrop-blur-xs">
                                Sold Out
                            </span>
                        ) : (
                            <span className="rounded-full bg-indigo-600/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
                                {countdown}
                            </span>
                        )}
                        <span className="rounded-full bg-slate-950/75 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 shadow-xs backdrop-blur-xs">
                            {event.registrationType === "PAID" && Number(event.registrationFee) > 0 ? `₹${event.registrationFee} Registration Fee` : "Free"}
                        </span>
                        {event.maxParticipants && event.maxParticipants > 0 && (
                            <span className="rounded-full bg-slate-900/80 border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-200 backdrop-blur-xs">
                                {event.registrationCount || 0} / {event.maxParticipants} Registered
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
                <CardContent className="p-5 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1 dark:text-slate-100">
                            {event.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 font-medium">
                            {event.description || "Join this exciting hackathon, build solutions, and compete with talented developers."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 truncate">
                            <Building2 className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{event.collegeName || "HackHive Community"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{event.location || "Online"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                            <Calendar className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                            <Users className="size-3.5 text-indigo-500 shrink-0" />
                            <span>{event.minTeamSize || 1}-{event.maxTeamSize || 4} Members</span>
                        </div>
                    </div>
                </CardContent>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(event)}
                    className="flex-1 rounded-xl text-xs font-semibold"
                >
                    View Details
                </Button>

                {isConfirmed ? (
                    <div className="flex items-center gap-1.5">
                        {userRegistration?.paymentStatus === "PAID" && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onViewReceipt(userRegistration, event)}
                                className="rounded-xl text-xs font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                            >
                                Receipt
                            </Button>
                        )}
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
                    </div>
                ) : isPendingPayment ? (
                    <Button
                        type="button"
                        size="sm"
                        disabled={isClosed || isFull || isRegistering}
                        onClick={() => onRegister(event.id)}
                        className="flex-1 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                    >
                        {isRegistering ? "Processing..." : "Complete Payment"}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="sm"
                        disabled={isClosed || isFull || isRegistering}
                        onClick={() => onRegister(event.id)}
                        className="flex-1 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                    >
                        {isRegistering
                            ? "Processing..."
                            : isClosed
                            ? "Closed"
                            : isFull
                            ? "Sold Out"
                            : event.registrationType === "PAID" && Number(event.registrationFee) > 0
                            ? `Register & Pay (₹${event.registrationFee})`
                            : "Register Now"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
