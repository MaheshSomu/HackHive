import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Crown,
    LogOut,
    Mail,
    Shield,
    Trash2,
    UserCheck,
    UserMinus,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import { teamService } from "../../services/teamService";
import { Button } from "../ui/Button";

export default function TeamDetailsModal({
    team,
    isOpen,
    onClose,
    currentUserId,
    currentStudentProfileId,
    onRefresh,
    onDeleteTeam,
}) {
    const [members, setMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const isLeader = Boolean(team && (team.leaderId === currentUserId || team.leaderId === currentStudentProfileId));

    const loadDetails = useCallback(async () => {
        if (!team) return;
        try {
            setLoading(true);
            const membersRes = await teamService.getTeamMembers(team.id);
            setMembers(Array.isArray(membersRes) ? membersRes : []);

            if (isLeader) {
                const reqsRes = await teamService.getTeamJoinRequests(team.id);
                setJoinRequests(Array.isArray(reqsRes) ? reqsRes : []);
            }
        } catch {
            // silent catch
        } finally {
            setLoading(false);
        }
    }, [team, isLeader]);

    useEffect(() => {
        if (isOpen && team) {
            loadDetails();
        }
    }, [isOpen, team, loadDetails]);

    if (!isOpen || !team) return null;

    const handleApproveRequest = async (requestId) => {
        try {
            setActionLoading(true);
            await teamService.approveJoinRequest(requestId);
            toast.success("Join request approved!");
            loadDetails();
            if (onRefresh) onRefresh();
        } catch {
            toast.error("Failed to approve request.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            setActionLoading(true);
            await teamService.rejectJoinRequest(requestId);
            toast.success("Join request rejected.");
            setJoinRequests((prev) => prev.filter((r) => r.requestId !== requestId));
        } catch {
            toast.error("Failed to reject request.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveMember = async (studentProfileId) => {
        try {
            setActionLoading(true);
            await teamService.removeMember(team.id, studentProfileId);
            toast.success("Member removed from team.");
            setMembers((prev) => prev.filter((m) => m.studentProfileId !== studentProfileId));
            if (onRefresh) onRefresh();
        } catch {
            toast.error("Failed to remove member.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        try {
            setActionLoading(true);
            await teamService.leaveTeam(team.id);
            toast.success("You have left the team.");
            onClose();
            if (onRefresh) onRefresh();
        } catch {
            toast.error("Failed to leave team.");
        } finally {
            setActionLoading(false);
        }
    };

    const pendingRequests = joinRequests.filter((r) => r.status === "PENDING" || !r.status);

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
                    className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Users className="size-5 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {team.name}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Team Banner / Overview */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-800/40">
                            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                {team.eventType === "EXTERNAL" ? (
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider dark:bg-emerald-950">External Event</span>
                                        <span>{team.externalEvent?.eventName || team.eventTitle || "External Event"}</span>
                                        {team.externalEvent?.organizerName && <span className="text-slate-500 font-normal">({team.externalEvent.organizerName})</span>}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="size-4" /> {team.eventTitle || "Hackathon Event"}
                                    </span>
                                )}
                                {isLeader && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        <Crown className="size-3" /> Team Leader
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-5">
                                {team.description || "Team workspace for collaborative build."}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-500 border-t border-slate-200/60 dark:border-slate-700/60">
                                <div><span className="font-semibold text-slate-700 dark:text-slate-300">Leader:</span> {team.leaderName || "Lead"}</div>
                                <div><span className="font-semibold text-slate-700 dark:text-slate-300">Members:</span> {team.currentMembers || members.length}/{team.maxMembers}</div>
                                {team.collegeName && <div><span className="font-semibold text-slate-700 dark:text-slate-300">College:</span> {team.collegeName}</div>}
                            </div>
                        </div>

                        {/* Members Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Team Members ({members.length})
                                </h4>
                            </div>

                            {loading ? (
                                <div className="space-y-2">
                                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                                </div>
                            ) : members.length > 0 ? (
                                <div className="space-y-2">
                                    {members.map((member) => {
                                        const initials = (member.fullName || member.email || "M")[0].toUpperCase();
                                        const isMemberLeader = member.role === "LEADER" || member.fullName === team.leaderName;

                                        return (
                                            <div
                                                key={member.memberId || member.studentProfileId || member.email}
                                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-xs text-white dark:bg-indigo-600">
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                                {member.fullName || "Student Member"}
                                                            </p>
                                                            {isMemberLeader && (
                                                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                                    Leader
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="truncate text-[11px] text-slate-500">
                                                            {member.email} {member.branch ? `• ${member.branch}` : ""}
                                                        </p>
                                                    </div>
                                                </div>

                                                {isLeader && !isMemberLeader && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMember(member.studentProfileId)}
                                                        disabled={actionLoading}
                                                        title="Remove Member"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                                    >
                                                        <UserMinus className="size-4" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400">No members loaded.</p>
                            )}
                        </div>

                        {/* Pending Join Requests Section (Leader View) */}
                        {isLeader && (
                            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Pending Join Requests ({pendingRequests.length})
                                </h4>

                                {pendingRequests.length > 0 ? (
                                    <div className="space-y-2">
                                        {pendingRequests.map((req) => (
                                            <div
                                                key={req.requestId}
                                                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                        {req.studentName || "Applicant Student"}
                                                    </p>
                                                    <p className="truncate text-[11px] text-slate-500">{req.studentEmail}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleApproveRequest(req.requestId)}
                                                        disabled={actionLoading}
                                                        className="h-8 rounded-lg bg-emerald-600 text-[11px] text-white hover:bg-emerald-500"
                                                    >
                                                        <Check className="mr-1 size-3" /> Approve
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRejectRequest(req.requestId)}
                                                        disabled={actionLoading}
                                                        className="h-8 rounded-lg text-[11px] text-rose-600 hover:bg-rose-50"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400">No pending join requests at this time.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Close
                        </Button>

                        {isLeader && onDeleteTeam ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onClose();
                                    onDeleteTeam(team);
                                }}
                                disabled={actionLoading}
                                className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                            >
                                <Trash2 className="mr-1 size-3.5" /> Delete Team Workspace
                            </Button>
                        ) : !isLeader && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleLeave}
                                disabled={actionLoading}
                                className="text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                            >
                                <LogOut className="mr-1 size-3.5" /> Leave Team
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
