import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    ExternalLink,
    MapPin,
    Sparkles,
} from "lucide-react";

import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../lib/utils";

function StatCard({ label, value, hint, icon, accentClassName = "text-slate-900 dark:text-slate-100" }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18 }}
            className="h-full"
        >
            <Card className="h-full border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                            <div className={cn("text-2xl font-extrabold tracking-tight", accentClassName)}>
                                {value}
                            </div>
                            {hint && (
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    {hint}
                                </p>
                            )}
                        </div>

                        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-indigo-400">
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ProfileCompletionCard({
    completion,
    summary,
    missingItems = [],
    onCompleteProfile,
}) {
    return (
        <Card className="border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Profile Progress
                            </span>
                            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Keep your profile ready
                            </h3>
                            <p className="max-w-xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                {summary}
                            </p>
                        </div>

                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50/70 font-extrabold text-base text-indigo-600 dark:border-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-400">
                            {completion}%
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                style={{ width: `${completion}%` }}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {missingItems.length > 0 ? (
                                missingItems.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                                    >
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <CheckCircle2 className="size-3.5" />
                                    All core sections complete
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button
                            type="button"
                            onClick={onCompleteProfile}
                            className="h-9 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-500"
                        >
                            Complete Profile
                        </Button>

                        <span className="text-[11px] text-slate-400">
                            Update missing sections to increase hackathon acceptance.
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function HackathonCard({ event, onOpen }) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.18 }}
            className="h-full"
        >
            <Card className="flex h-full flex-col justify-between border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            {event.statusLabel}
                        </span>
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                            {event.mode}
                        </span>
                    </div>

                    <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {event.title}
                    </h3>

                    <p className="line-clamp-2 text-xs text-slate-500 leading-5 dark:text-slate-400">
                        {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                                <Clock3 className="size-3" />
                                <span>Days Left</span>
                            </div>
                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                                {event.daysRemaining}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                                <MapPin className="size-3" />
                                <span>Location</span>
                            </div>
                            <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                                {event.location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CalendarClock className="size-3.5" />
                        <span>{event.registrationLabel}</span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onOpen}
                        className="rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                    >
                        View Event <ArrowRight className="ml-1 size-3.5" />
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}

function TeamCard({ team, onOpenWorkspace }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18 }}
            className="h-full"
        >
            <Card className="flex h-full flex-col justify-between border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            team.open
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                            {team.open ? "Open Slots" : "Full Team"}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                            {team.memberCount} / {team.maxMembers} Members
                        </span>
                    </div>

                    <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {team.name}
                    </h3>

                    <p className="line-clamp-2 text-xs text-slate-500 leading-5 dark:text-slate-400">
                        {team.description}
                    </p>

                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Event</span>
                        <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {team.eventTitle}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <p className="text-[11px] text-slate-400 truncate">
                        Led by <span className="font-semibold text-slate-700 dark:text-slate-300">{team.leaderName}</span>
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onOpenWorkspace}
                        className="rounded-xl text-xs font-bold text-indigo-600 hover:border-indigo-300 dark:text-indigo-400"
                    >
                        Workspace <ExternalLink className="ml-1 size-3.5" />
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}

function TimelineItem({ icon, title, description, meta, tone = "default" }) {
    const toneStyles = {
        default: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-400",
        warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-400",
        accent: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-400",
    };

    return (
        <div className="flex gap-3.5 items-start">
            <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border", toneStyles[tone])}>
                {icon}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{title}</h4>
                    {meta && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {meta}
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500 leading-4 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
}

function NotificationItem({ tone = "default", title, description, meta }) {
    const toneClasses = {
        default: "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40",
        success: "border-emerald-200 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20",
        warning: "border-amber-200 bg-amber-50/40 dark:border-amber-950 dark:bg-amber-950/20",
        accent: "border-indigo-200 bg-indigo-50/40 dark:border-indigo-950 dark:bg-indigo-950/20",
    };

    return (
        <div className={cn("rounded-2xl border p-4 space-y-1", toneClasses[tone])}>
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <AlertCircle className="size-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{title}</h4>
                        {meta && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {meta}
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-slate-500 leading-4 dark:text-slate-400">{description}</p>
                </div>
            </div>
        </div>
    );
}

function QuickActionCard({ title, description, icon, onClick, tone = "default" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group flex h-full w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition shadow-2xs",
                tone === "accent"
                    ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-500"
                    : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            )}
        >
            <div className={cn(
                "rounded-xl border p-2.5 transition shrink-0",
                tone === "accent"
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-slate-200 bg-slate-50 text-indigo-600 group-hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-800 dark:text-indigo-400"
            )}>
                {icon}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
                <div className={cn("text-xs font-bold", tone === "accent" ? "text-white" : "text-slate-900 dark:text-slate-100")}>
                    {title}
                </div>
                <p className={cn("text-[11px] leading-4", tone === "accent" ? "text-indigo-100" : "text-slate-500 dark:text-slate-400")}>
                    {description}
                </p>
            </div>
        </button>
    );
}

function SectionTitleRow({ title, description }) {
    return (
        <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
            </h3>
            {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
            )}
        </div>
    );
}

export {
    StatCard,
    ProfileCompletionCard,
    HackathonCard,
    TeamCard,
    TimelineItem,
    NotificationItem,
    QuickActionCard,
    SectionTitleRow,
};
