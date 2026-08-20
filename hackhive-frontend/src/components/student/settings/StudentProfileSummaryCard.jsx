import { User, Mail, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, StatusPill } from "../../ui/Badge";
import { Button } from "../../ui/Button";

export default function StudentProfileSummaryCard({ user }) {
    const navigate = useNavigate();

    const initials = (user?.fullName || user?.email || "Student")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const isGoogleAuth = user?.authProvider === "GOOGLE";

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all">
            {/* Background Accent Decorative Blur */}
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Column: Avatar & Main Student Info */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                    {/* Student Avatar */}
                    <div className="relative flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-xl sm:text-2xl font-black text-white shadow-md ring-4 ring-indigo-50 dark:ring-indigo-950/50 overflow-hidden">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user?.fullName || "Student"}
                                className="size-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : null}
                        <span className={user?.avatarUrl ? "hidden" : "block"}>{initials}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 truncate">
                                {user?.fullName || "Student User"}
                            </h2>

                            <Badge variant="primary" className="px-2.5 py-0.5 text-xs font-bold shadow-2xs">
                                <Sparkles className="size-3 text-white" />
                                <span>{user?.role || "STUDENT"}</span>
                            </Badge>

                            <StatusPill status="active" label="Verified Account" />
                        </div>

                        {/* Metadata line */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Mail className="size-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{user?.email || "student@hackhive.com"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 min-w-0">
                                <ShieldCheck className="size-3.5 text-indigo-500 shrink-0" />
                                <span>{isGoogleAuth ? "Google OAuth Account" : "Email & Password Account"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/student/profile")}
                        className="w-full sm:w-auto font-bold border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 gap-2 px-4 py-2.5 rounded-xl text-xs"
                    >
                        <User className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Edit Student Profile</span>
                        <ArrowRight className="size-3.5 text-slate-400" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
