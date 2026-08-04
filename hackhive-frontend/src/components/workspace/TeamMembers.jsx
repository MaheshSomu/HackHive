import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Crown,
    Shield,
    UserMinus,
    AlertCircle,
    RotateCcw,
    Users,
    ArrowUpRight,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { SkeletonBlock } from "../student-dashboard/DashboardStates";
import MemberProfileDrawer from "./MemberProfileDrawer";

function GithubIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
        </svg>
    );
}

function LinkedinIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
        </svg>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export default function TeamMembers({
    members = [],
    currentTeam = null,
    currentUser = null,
    isLoading = false,
    isError = false,
    onRemoveMember,
    onTransferLeadership,
    onRetry,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Identify if the logged-in user is the team leader
    const isCurrentUserLeader = useMemo(() => {
        if (!currentUser || !currentTeam) return false;
        const currentStudentId = currentUser.studentProfileId || currentUser.id;
        const currentEmail = currentUser.email?.toLowerCase();

        const isLeadById =
            currentTeam.leaderStudentProfileId &&
            String(currentTeam.leaderStudentProfileId) === String(currentStudentId);
        const isLeadByName =
            currentTeam.leaderName &&
            currentUser.fullName &&
            currentTeam.leaderName.toLowerCase() === currentUser.fullName.toLowerCase();

        const memberMatch = members.find((m) => {
            const mId = m.studentProfileId || m.memberId;
            const mEmail = m.email?.toLowerCase();
            return (mId && String(mId) === String(currentStudentId)) || (mEmail && mEmail === currentEmail);
        });

        const isMemberRoleLeader = memberMatch?.role === "LEADER";

        return Boolean(isLeadById || isLeadByName || isMemberRoleLeader);
    }, [currentUser, currentTeam, members]);

    // Filter members list
    const filteredMembers = useMemo(() => {
        if (!searchQuery.trim()) return members;
        const q = searchQuery.toLowerCase();
        return members.filter((m) => {
            const name = (m.fullName || "").toLowerCase();
            const email = (m.email || "").toLowerCase();
            const role = (m.role || "").toLowerCase();
            const college = (m.college || "").toLowerCase();
            const branch = (m.branch || "").toLowerCase();
            const skills = Array.isArray(m.skills)
                ? m.skills.join(" ").toLowerCase()
                : typeof m.skills === "string"
                ? m.skills.toLowerCase()
                : "";

            return (
                name.includes(q) ||
                email.includes(q) ||
                role.includes(q) ||
                college.includes(q) ||
                branch.includes(q) ||
                skills.includes(q)
            );
        });
    }, [members, searchQuery]);

    const handleCardClick = (member) => {
        setSelectedMember(member);
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Team Members
                        </h3>
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-extrabold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                            {members.length} {members.length === 1 ? "Member" : "Members"}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Teammates collaborating on this hackathon project workspace.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search members by name, email, or skill..."
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    />
                </div>
            </div>

            {/* Error State */}
            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold">Failed to load team members</h4>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400">
                            There was an issue fetching team member profiles. Please try again.
                        </p>
                    </div>
                    {onRetry && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={onRetry}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                        >
                            <RotateCcw className="size-3.5" /> Try Again
                        </Button>
                    )}
                </div>
            ) : isLoading ? (
                /* Loading Skeletons Grid */
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <SkeletonBlock className="size-12 rounded-full shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <SkeletonBlock className="h-4 w-3/4" />
                                    <SkeletonBlock className="h-3 w-1/2" />
                                </div>
                            </div>
                            <SkeletonBlock className="h-8 w-full rounded-xl" />
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                <SkeletonBlock className="h-4 w-20" />
                                <SkeletonBlock className="h-4 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredMembers.length > 0 ? (
                /* Responsive Profile Cards Grid */
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member) => {
                            const isLeader =
                                member.role === "LEADER" ||
                                (currentTeam?.leaderName && member.fullName === currentTeam.leaderName);

                            const initials = (member.fullName || member.email || "M")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2);

                            const skillsList = Array.isArray(member.skills)
                                ? member.skills
                                : typeof member.skills === "string"
                                ? member.skills.split(",").map((s) => s.trim()).filter(Boolean)
                                : [];

                            const joinDate = formatDate(member.joinedAt || member.createdAt);

                            return (
                                <motion.div
                                    key={member.memberId || member.studentProfileId || member.email}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Card
                                        onClick={() => handleCardClick(member)}
                                        className="group relative flex flex-col justify-between h-full cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition space-y-4"
                                    >
                                        <div className="space-y-3.5">
                                            {/* Card Top: Avatar & Role Badge */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="relative">
                                                    <div className="flex size-13 items-center justify-center rounded-2xl bg-slate-900 font-extrabold text-sm text-white shadow-xs dark:bg-indigo-600 ring-2 ring-slate-100 dark:ring-slate-800">
                                                        {member.profileImageUrl ? (
                                                            <img
                                                                src={member.profileImageUrl}
                                                                alt={member.fullName}
                                                                className="size-full rounded-2xl object-cover"
                                                            />
                                                        ) : (
                                                            <span>{initials}</span>
                                                        )}
                                                    </div>
                                                    {isLeader && (
                                                        <div
                                                            className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white dark:ring-slate-900"
                                                            title="Team Leader"
                                                        >
                                                            <Crown className="size-3" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    {isLeader ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800 shadow-2xs">
                                                            <Crown className="size-3 fill-amber-500 text-amber-500" /> Leader
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            <Shield className="size-3 text-slate-400" /> Member
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Member Name & Email */}
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center justify-between">
                                                    <span className="truncate">{member.fullName || "Teammate"}</span>
                                                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition text-indigo-500 shrink-0" />
                                                </h4>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">{member.email}</p>
                                                {(member.college || member.branch) && (
                                                    <p className="text-[11px] text-slate-400 truncate mt-1">
                                                        {[member.college, member.branch].filter(Boolean).join(" • ")}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Skills Chips (if available) */}
                                            {skillsList.length > 0 && (
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {skillsList.slice(0, 3).map((skill, idx) => (
                                                        <Badge
                                                            key={idx}
                                                            variant="secondary"
                                                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {skillsList.length > 3 && (
                                                        <span className="text-[10px] font-bold text-slate-400 self-center">
                                                            +{skillsList.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Row & Leader Actions */}
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            {/* Social Quick Links */}
                                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                {member.githubUrl && (
                                                    <a
                                                        href={member.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition"
                                                        title="GitHub Profile"
                                                    >
                                                        <GithubIcon className="size-3.5" />
                                                    </a>
                                                )}
                                                {member.linkedinUrl && (
                                                    <a
                                                        href={member.linkedinUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800 dark:hover:text-sky-400 transition"
                                                        title="LinkedIn Profile"
                                                    >
                                                        <LinkedinIcon className="size-3.5" />
                                                    </a>
                                                )}
                                                {joinDate && (
                                                    <span className="text-[10px] text-slate-400 font-medium ml-1">
                                                        Joined {joinDate}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Leader Actions Menu (Remove & Transfer) */}
                                            {isCurrentUserLeader && !isLeader && (
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                    {onTransferLeadership && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onTransferLeadership(member)}
                                                            className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition"
                                                            title="Transfer Leadership"
                                                        >
                                                            <Crown className="size-3.5" />
                                                        </button>
                                                    )}
                                                    {onRemoveMember && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onRemoveMember(member)}
                                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition"
                                                            title="Remove member from team"
                                                        >
                                                            <UserMinus className="size-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                /* Empty State */
                <Card className="border-dashed border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            <Users className="size-7" />
                        </div>
                        <div className="max-w-md space-y-1.5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {searchQuery ? "No matching team members found" : "No team members found"}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {searchQuery
                                    ? `No members found matching "${searchQuery}". Try a different name or email.`
                                    : "Invite teammates to join your project workspace to collaborate on tasks, resources, and chat."}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Member Profile Drawer */}
            <MemberProfileDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedMember(null);
                }}
                member={selectedMember}
                currentTeam={currentTeam}
            />
        </div>
    );
}
