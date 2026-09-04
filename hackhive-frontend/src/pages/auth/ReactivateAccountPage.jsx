import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";
import { reactivateAccount } from "../../services/authService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function ReactivateAccountPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [loading, setLoading] = useState(Boolean(token));
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState(token ? "" : "No reactivation token found in URL.");

    useEffect(() => {
        if (!token) return;

        let isMounted = true;

        async function processReactivation() {
            setLoading(true);
            setApiError("");
            try {
                await reactivateAccount(token);
                if (isMounted) {
                    setSuccess(true);
                }
            } catch (err) {
                if (isMounted) {
                    setApiError(getApiErrorMessage(err, "Invalid or expired reactivation token."));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        processReactivation();

        return () => {
            isMounted = false;
        };
    }, [token]);

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8">
                    <AuthHeader
                        title={success ? "Account Reactivated!" : "Account Reactivation"}
                        subtitle={
                            success
                                ? "Your student account has been successfully reactivated."
                                : "Processing your account reactivation token..."
                        }
                    />

                    {loading ? (
                        <div className="p-8 text-center space-y-4">
                            <Loader2 className="size-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Verifying your reactivation token...
                            </p>
                        </div>
                    ) : success ? (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-950 dark:bg-emerald-950/40 text-center space-y-3">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                                        Welcome Back to HackHive
                                    </h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                        Your account is now active. You can sign in with your email and password or Google OAuth.
                                    </p>
                                </div>
                            </div>

                            <Link to="/login" replace className="block w-full">
                                <Button className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 gap-2">
                                    <span>Proceed to Sign In</span>
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 dark:border-rose-950 dark:bg-rose-950/40 space-y-3">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                                            Reactivation Failed
                                        </h4>
                                        <p className="text-xs text-rose-700/80 dark:text-rose-300/80 font-medium">
                                            {apiError}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/login" replace className="block w-full">
                                <Button className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </AuthCard>
        </AuthLayout>
    );
}
