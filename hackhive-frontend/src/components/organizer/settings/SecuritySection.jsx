import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Mail, KeyRound, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { requestPasswordChange } from "../../../services/authService";

export default function SecuritySection({ user }) {
    const [loading, setLoading] = useState(false);

    // Determine if user authenticated via Google or standard email/password
    const isGoogleAuth = user?.authProvider === "GOOGLE";

    const handleChangePasswordRequest = async () => {
        setLoading(true);
        try {
            const res = await requestPasswordChange();
            const msg = res?.message || "Password reset link sent to your account email.";
            toast.success(msg);
        } catch (err) {
            console.error("Failed to request password change:", err);
            const msg = err.response?.data?.message || "Unable to send password reset email. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Security & Credentials</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage authentication credentials, linked identity providers, and password security.
                </p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* Email Address (Read-Only) */}
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                        />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 font-medium">
                        Synced directly with your HackHive master authentication account.
                    </p>
                </div>

                {/* Connected Accounts */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Authentication Method
                    </label>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs dark:bg-slate-800 dark:border-slate-700">
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
                                    <KeyRound className="size-5 text-purple-600" />
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    {isGoogleAuth ? "Google OAuth" : "Email & Password Account"}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {isGoogleAuth
                                        ? "Your account is secured through Google."
                                        : "Standard credential authentication via email password."}
                                </p>
                            </div>
                        </div>

                        {isGoogleAuth ? (
                            <Badge variant="success" className="gap-1 px-3 py-1 text-xs font-bold">
                                <CheckCircle2 className="size-3.5 text-emerald-600" /> Connected
                            </Badge>
                        ) : (
                            <Badge variant="purple" className="px-3 py-1 text-xs font-bold">
                                Active Provider
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Password Section */}
                <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password Credential
                    </label>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                                <Lock className="size-5" />
                            </div>
                            <div className="space-y-0.5">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Password Status
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                    {isGoogleAuth
                                        ? "Password management is handled through your Google account."
                                        : "Password is securely stored."}
                                </p>
                            </div>
                        </div>

                        {!isGoogleAuth && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleChangePasswordRequest}
                                disabled={loading}
                                className="text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 gap-1.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
