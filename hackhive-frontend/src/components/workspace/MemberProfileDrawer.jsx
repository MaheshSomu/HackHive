import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    GraduationCap,
    Building2,
    BookOpen,
    Globe,
    Crown,
    Shield,
    Copy,
    Check,
    ExternalLink,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { toast } from "sonner";

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

export default function MemberProfileDrawer({ isOpen, onClose, member, currentTeam }) {
    const [copiedEmail, setCopiedEmail] = useState(false);

    if (!isOpen || !member) return null;

    const initials = (member.fullName || member.email || "M")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const isLeader = member.role === "LEADER" || member.fullName === currentTeam?.leaderName;

    const handleCopyEmail = () => {
        if (!member.email) return;
        navigator.clipboard.writeText(member.email);
        setCopiedEmail(true);
        toast.success("Email copied to clipboard!");
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    // Extract skills if array or string
    const skillsList = Array.isArray(member.skills)
        ? member.skills
        : typeof member.skills === "string"
        ? member.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                />

                {/* Drawer Content */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative flex flex-col w-full max-w-md h-full bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto"
                >
                    {/* Polished HackHive Branded Header Banner */}
                    <div className="relative h-36 w-full overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-5 flex flex-col justify-between border-b border-indigo-500/10">
                        {/* Subtle Grid Dot Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:12px_12px]" />

                        {/* Geometric Hexagon Pattern - Very Subtle */}
                        <svg className="absolute inset-0 size-full opacity-5 pointer-events-none text-indigo-400" fill="currentColor">
                            <pattern id="hex-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                                <path d="M14 0L28 8V24L14 32L0 24V8L14 0Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#hex-grid)" />
                        </svg>

                        {/* Large Semi-Transparent "HACKHIVE" Watermark (15-20% larger, subtle opacity) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                            <span className="text-4xl sm:text-[2.6rem] font-black tracking-[0.3em] text-white/[0.035] uppercase font-mono">
                                HACKHIVE
                            </span>
                        </div>

                        {/* Close Button */}
                        <div className="relative z-10 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full bg-slate-900/60 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition backdrop-blur-xs border border-white/10"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Horizontally Centered Slogan Tagline */}
                        <div className="relative z-10 text-center w-full mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300/75 font-mono">
                                Collaborate • Innovate • Build
                            </span>
                        </div>
                    </div>

                    {/* Avatar Floating Bar */}
                    <div className="px-6 relative -mt-11 flex items-end justify-between">
                        <div className="relative">
                            <div className="flex size-20 items-center justify-center rounded-2xl bg-slate-900 text-xl font-extrabold text-white ring-4 ring-white dark:ring-slate-900 shadow-md dark:bg-indigo-600">
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
                                    className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs"
                                    title="Team Leader"
                                >
                                    <Crown className="size-3.5" />
                                </div>
                            )}
                        </div>

                        {/* Leader Badge or Role Pill */}
                        <div className="mb-1">
                            {isLeader ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800 shadow-2xs">
                                    <Crown className="size-3.5 fill-amber-500 text-amber-500" /> Team Leader
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    <Shield className="size-3.5 text-slate-400" /> Member
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Member Name & Email */}
                    <div className="px-6 mt-3.5 space-y-0.5">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                            {member.fullName || "Team Member"}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{member.email}</p>
                    </div>

                    {/* Profile Main Body */}
                    <div className="p-6 space-y-5 flex-1">
                        {/* Action Row: Copy Email & Send Mail (Equal height & width, solid indigo) */}
                        <div className="flex items-center gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCopyEmail}
                                className="flex-1 h-9.5 text-xs font-bold gap-1.5 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                {copiedEmail ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                                {copiedEmail ? "Copied Email" : "Copy Email"}
                            </Button>
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="inline-flex items-center justify-center gap-1.5 flex-1 h-9.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 text-xs font-bold text-white shadow-xs transition"
                                >
                                    <Mail className="size-3.5" /> Send Mail
                                </a>
                            )}
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        {/* Bio / About */}
                        {member.bio && (
                            <div className="space-y-1.5">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Sparkles className="size-3.5 text-indigo-500" /> Bio & Summary
                                </h4>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                    {member.bio}
                                </p>
                            </div>
                        )}

                        {/* Academic & Organization details */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Academic & Organization</h4>
                            {member.college || member.branch ? (
                                <div className="grid gap-2 text-xs">
                                    {member.college && (
                                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                                            <Building2 className="size-4 text-indigo-500 shrink-0" />
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-semibold">College / University</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{member.college}</span>
                                            </div>
                                        </div>
                                    )}

                                    {member.branch && (
                                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                                            <GraduationCap className="size-4 text-indigo-500 shrink-0" />
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-semibold">Branch & Specialization</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{member.branch}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 text-xs text-slate-400 font-medium italic">
                                    No academic information available.
                                </div>
                            )}
                        </div>

                        {/* Skills Chips */}
                        {skillsList.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <BookOpen className="size-3.5 text-indigo-500" /> Skills & Expertise
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {skillsList.map((skill, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 px-2.5 py-1 text-[11px] font-bold rounded-lg"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Social & Portfolio</h4>
                            {member.githubUrl || member.linkedinUrl || member.portfolioUrl ? (
                                <div className="grid gap-2">
                                    {member.githubUrl && (
                                        <a
                                            href={member.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
                                        >
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                                <GithubIcon className="size-4 text-slate-900 dark:text-white" /> GitHub Profile
                                            </div>
                                            <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                                        </a>
                                    )}

                                    {member.linkedinUrl && (
                                        <a
                                            href={member.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
                                        >
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                                <LinkedinIcon className="size-4 text-sky-600" /> LinkedIn Profile
                                            </div>
                                            <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                                        </a>
                                    )}

                                    {member.portfolioUrl && (
                                        <a
                                            href={member.portfolioUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
                                        >
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                                <Globe className="size-4 text-indigo-600" /> Personal Portfolio
                                            </div>
                                            <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 text-xs text-slate-400 font-medium italic">
                                    No social links added.
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
