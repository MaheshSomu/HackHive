import { useState } from "react";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Mail, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthField from "../../components/auth/AuthField";
import { resendVerificationEmail } from "../../services/authService";
import { getApiErrorMessage } from "../../utils/apiError";

import { Button } from "@/components/ui/Button";

function EmailVerificationFailedPage() {
    const [email, setEmail] = useState("");
    const [showResendForm, setShowResendForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleResend = async (e) => {
        e.preventDefault();
        if (!email || !email.trim()) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await resendVerificationEmail(email.trim());
            const msg = "Verification email sent successfully. Please check your inbox.";
            setSuccessMessage(msg);
            toast.success(msg);
        } catch (err) {
            const errorMsg = getApiErrorMessage(err, "Failed to resend verification email.");
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50">
                        <XCircle className="size-8 text-rose-600 dark:text-rose-400" />
                    </div>

                    <AuthHeader
                        title="Verification Failed"
                        subtitle="This verification link is invalid or has expired."
                    />

                    {successMessage ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-left text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <p className="text-sm font-medium leading-6">{successMessage}</p>
                            </div>
                        </div>
                    ) : null}

                    {errorMessage ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-left text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                <p className="text-sm font-medium leading-6">{errorMessage}</p>
                            </div>
                        </div>
                    ) : null}

                    {showResendForm ? (
                        <form className="space-y-4 text-left" onSubmit={handleResend}>
                            <AuthField
                                id="resend-email"
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                icon={<Mail size={18} />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Verification Email"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <Button
                                type="button"
                                onClick={() => setShowResendForm(true)}
                                className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                Resend Verification Email
                            </Button>

                            <Link to="/login" className="block">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-14 w-full rounded-2xl border-slate-200 text-base font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    )}

                    {showResendForm ? (
                        <div className="text-center pt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Login
                            </Link>
                        </div>
                    ) : null}
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default EmailVerificationFailedPage;
