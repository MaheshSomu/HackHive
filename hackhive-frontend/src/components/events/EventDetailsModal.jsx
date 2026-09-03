import { AnimatePresence, motion } from "framer-motion";
import {
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    HelpCircle,
    MapPin,
    Shield,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";
import { Button } from "../ui/Button";

function formatDate(dateString) {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Not specified";
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(date);
}

export default function EventDetailsModal({
    event,
    isOpen,
    onClose,
    isRegistered,
    userRegistration,
    onRegister,
    onCancel,
    isRegistering,
}) {
    if (!isOpen || !event) return null;

    const isConfirmed = isRegistered || (userRegistration && (!userRegistration.status || userRegistration.status === "CONFIRMED"));
    const isPendingPayment = userRegistration && userRegistration.status === "PENDING_PAYMENT";

    const isClosed = (() => {
        if (!event.registrationEndDate) return false;
        const deadline = new Date(event.registrationEndDate);
        return deadline.getTime() < Date.now();
    })();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Dialog Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Header Banner */}
                    <div className="relative h-48 w-full shrink-0 bg-slate-950">
                        {event.bannerUrl ? (
                            <img
                                src={event.bannerUrl}
                                alt={event.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-800 p-6 text-white">
                                <div className="text-center space-y-1">
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                                        {event.eventMode || "Hackathon"}
                                    </span>
                                    <h2 className="text-2xl font-extrabold tracking-tight">{event.title}</h2>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-slate-950"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Scrollable Main Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Title & Host info */}
                        <div className="space-y-2 border-b border-slate-100 pb-5 dark:border-slate-800">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                <Building2 className="size-4" />
                                <span>Hosted by {event.organizerName || event.collegeName || "HackHive Host"}</span>
                                {event.verified && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                                        <ShieldCheck className="size-3 text-blue-600 dark:text-blue-400" /> Verified Host
                                    </span>
                                )}
                                {event.collegeName && <span className="text-slate-400">• {event.collegeName}</span>}
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap gap-2 pt-1">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                                    event.registrationType === "PAID" && Number(event.registrationFee) > 0
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                }`}>
                                    {event.registrationType === "PAID" && Number(event.registrationFee) > 0
                                        ? `Registration Fee: ₹${event.registrationFee}`
                                        : "Registration: Free"}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    Mode: {event.eventMode || "Hybrid"}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    Team: {event.minTeamSize || 1} - {event.maxTeamSize || 4} Members
                                </span>
                                {isRegistered && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                        <CheckCircle2 className="size-3.5" /> Registered
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
                                Overview & Description
                            </h3>
                            <p className="text-xs leading-6 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                                {event.description || "Detailed overview for this hackathon build."}
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
                                Event Timeline & Dates
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <Clock className="size-4 text-indigo-500" />
                                        <span>Registration Window</span>
                                    </div>
                                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                                        {formatDate(event.registrationStartDate)} – {formatDate(event.registrationEndDate)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <Calendar className="size-4 text-indigo-500" />
                                        <span>Hackathon Duration</span>
                                    </div>
                                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                                        {formatDate(event.startDate)} – {formatDate(event.endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Eligibility & Guidelines */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-1.5 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                                    <Shield className="size-4 text-indigo-500" />
                                    <span>Eligibility Criteria</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {event.eligibility || "Open to all enrolled students and recent graduates."}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-1.5 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                                    <MapPin className="size-4 text-indigo-500" />
                                    <span>Location & Venue</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {event.location || event.eventMode || "Online"}
                                </p>
                            </div>
                        </div>

                        {/* Rules & Guidelines */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
                                Rules & Submission Guidelines
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                                <li>All projects must be built during the hackathon timeframe.</li>
                                <li>Teams must comprise between {event.minTeamSize || 1} and {event.maxTeamSize || 4} members.</li>
                                <li>Original code, proper repository structure, and demo presentation are required.</li>
                                <li>Respect code of conduct and maintain ethical collaboration standards.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Close
                        </Button>

                        {isConfirmed ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (event.registrationType === "PAID" || userRegistration?.amountPaid > 0) {
                                        const confirmed = window.confirm(
                                            "Refund Policy Notice:\n\nCancelling your registration will release your spot in this event. Please note that registration fees are non-refundable under the platform policy.\n\nAre you sure you want to proceed with cancellation?"
                                        );
                                        if (!confirmed) return;
                                    }
                                    onCancel(event.id);
                                }}
                                disabled={isRegistering}
                                className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                            >
                                {isRegistering ? "Cancelling..." : "Cancel Registration"}
                            </Button>
                        ) : isPendingPayment ? (
                            <Button
                                type="button"
                                size="sm"
                                disabled={isClosed || isRegistering}
                                onClick={() => onRegister(event.id)}
                                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6"
                            >
                                {isRegistering ? "Processing..." : "Complete Payment"}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="sm"
                                disabled={isClosed || isRegistering}
                                onClick={() => onRegister(event.id)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6"
                            >
                                {isRegistering
                                    ? "Processing..."
                                    : isClosed
                                    ? "Registration Closed"
                                    : event.registrationType === "PAID" && Number(event.registrationFee) > 0
                                    ? `Register & Pay (₹${event.registrationFee})`
                                    : "Register Now"}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
