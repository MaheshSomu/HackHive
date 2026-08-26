import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Crown,
    ExternalLink,
    LogOut,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

export default function TeamCard({
    team,
    isMyTeam,
    isLeader,
    hasPendingRequest,
    onViewDetails,
    onOpenWorkspace,
    onLeaveTeam,
    onDeleteTeam,
    onRequestJoin,
    isActionLoading,
}) {
    const currentCount = team.currentMembers || 1;
    const maxCount = team.maxMembers || 4;
    const availableSlots = Math.max(0, maxCount - currentCount);
    const isOpen = Boolean(team.open) && availableSlots > 0;

    return (
        <Card className="group relative flex flex-col justify-between overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-6 space-y-4">
                {/* Header Badge & Title */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {team.eventType === "EXTERNAL" ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider dark:bg-emerald-950">External</span>
                                    <span className="truncate">{team.externalEvent?.eventName || team.eventTitle || "External Event"}</span>
                                </span>
                            ) : (
                                <>
                                    <Calendar className="size-3.5" />
                                    <span className="truncate">{team.eventTitle || "Hackathon Event"}</span>
                                </>
                            )}
                        </span>

                        {isMyTeam ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <CheckCircle2 className="size-3" /> Member
                            </span>
                        ) : isOpen ? (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                {availableSlots} slot{availableSlots === 1 ? "" : "s"} open
                            </span>
                        ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Team Full
                            </span>
                        )}
                    </div>

                    <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {team.name}
                    </h3>

                    {team.description && (
                        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400 leading-5">
                            {team.description}
                        </p>
                    )}
                </div>

                {/* Team Info Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Crown className="size-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">Lead: {team.leaderName || "Team Lead"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Users className="size-3.5 text-slate-400 shrink-0" />
                        <span>{currentCount} / {maxCount} members</span>
                    </div>

                    {team.collegeName && (
                        <div className="col-span-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Building2 className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{team.collegeName}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Actions Footer */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(team)}
                    className="flex-1 rounded-xl text-xs font-semibold"
                >
                    View Details
                </Button>

                {isMyTeam ? (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => onOpenWorkspace(team)}
                            className="rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        >
                            Workspace <ExternalLink className="ml-1 size-3" />
                        </Button>

                        {isLeader && onDeleteTeam && (
                            <button
                                type="button"
                                onClick={() => onDeleteTeam(team)}
                                disabled={isActionLoading}
                                title="Delete Team Workspace"
                                className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/40 transition-colors"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        )}

                        {!isLeader && onLeaveTeam && (
                            <button
                                type="button"
                                onClick={() => onLeaveTeam(team.id)}
                                disabled={isActionLoading}
                                title="Leave Team"
                                className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/40 transition-colors"
                            >
                                <LogOut className="size-3.5" />
                            </button>
                        )}
                    </div>
                ) : hasPendingRequest ? (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <Clock className="size-3.5" /> Request Pending
                    </span>
                ) : (
                    <Button
                        type="button"
                        size="sm"
                        disabled={!isOpen || isActionLoading}
                        onClick={() => onRequestJoin(team.id)}
                        className="rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                    >
                        {isActionLoading ? "Sending..." : "Request to Join"} <UserPlus className="ml-1 size-3.5" />
                    </Button>
                )}
            </div>
        </Card>
    );
}
