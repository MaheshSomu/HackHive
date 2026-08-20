import { User, Mail, ShieldCheck, CheckCircle2, Info, Lock, KeyRound, AlertCircle } from "lucide-react";
import { Badge, StatusPill } from "../../ui/Badge";

export default function StudentAccountSection({ user }) {
    const isGoogleAuth = user?.authProvider === "GOOGLE";
    const authMethodLabel = isGoogleAuth ? "Google OAuth Account" : "Email & Password Account";
    const userId = user?.userId || user?.id;

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
                            value={user?.fullName || ""}
                            placeholder="Student Name"
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
                            value={user?.email || ""}
                            placeholder="student@example.com"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                        />
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    </div>
                    <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                        <Info className="size-3 shrink-0" />
                        <span>This email is managed by your main HackHive authentication account.</span>
                    </p>
                </div>

                {/* Authentication Method */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs dark:bg-slate-800 dark:border-slate-700">
                            {isGoogleAuth ? (
                                <svg className="size-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                            ) : (
                                <KeyRound className="size-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                Authentication Method
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                {authMethodLabel}
                            </p>
                        </div>
                    </div>
                    <Badge variant={isGoogleAuth ? "success" : "primary"} className="px-3 py-1 text-xs font-bold shrink-0">
                        {authMethodLabel}
                    </Badge>
                </div>

                {/* Email Verification Status */}
                {user?.emailVerified !== undefined && (
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                    user.emailVerified
                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                                }`}
                            >
                                {user.emailVerified ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                            </div>
                            <div className="space-y-0.5">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    Email Verification Status
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                    {user.emailVerified
                                        ? "Your account email has been verified for security and notifications."
                                        : "Please check your inbox to verify your account email address."}
                                </p>
                            </div>
                        </div>
                        <StatusPill status={user.emailVerified ? "active" : "pending"} label={user.emailVerified ? "Verified Email" : "Pending Verification"} />
                    </div>
                )}

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
                                {userId && <span className="block mt-0.5 text-[11px] text-slate-400">Account ID: #{userId}</span>}
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
