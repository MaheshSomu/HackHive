import { User, Mail, ShieldCheck, CheckCircle2, Info, Lock } from "lucide-react";
import { Badge, StatusPill } from "../../ui/Badge";

export default function StudentAccountSection({ user }) {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <User className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Account Information</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your master authentication credentials and core account authority details.
                </p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name <span className="text-slate-400 font-normal">(Synced from Profile)</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            disabled
                            value={user?.fullName || "Student User"}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                        />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 font-medium">
                        Full name is synced directly with your student builder profile.
                    </p>
                </div>

                {/* Account Email (Read Only) */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Account Email Address <span className="text-slate-400 font-normal">(Read Only)</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="email"
                            disabled
                            value={user?.email || "student@hackhive.com"}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                        />
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    </div>
                    <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                        <Info className="size-3 shrink-0" />
                        <span>This email is managed by your main HackHive authentication account.</span>
                    </p>
                </div>

                {/* Email Verification Status */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                Email Verification Status
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Your account email has been verified for security and notifications.
                            </p>
                        </div>
                    </div>
                    <StatusPill status="active" label="Verified Email" />
                </div>

                {/* Platform Role & Permissions */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <ShieldCheck className="size-5" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                Platform Role & Access Level
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Student builder privileges across hackathons, team formations, and workspace tools.
                            </p>
                        </div>
                    </div>
                    <Badge variant="primary" className="px-3 py-1 text-xs font-bold shrink-0">
                        {user?.role || "STUDENT"}
                    </Badge>
                </div>

                {/* Account Managed Explanation Banner */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200">
                    <Info className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs leading-relaxed">
                        <p className="font-bold">Identity & Account Governance</p>
                        <p className="text-indigo-700 dark:text-indigo-300 text-[11px]">
                            Your email address and platform role are centrally managed by the HackHive identity system. Updating primary email address requires master authentication verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
