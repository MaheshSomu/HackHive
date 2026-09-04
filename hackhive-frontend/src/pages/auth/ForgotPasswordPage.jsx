import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthField from "../../components/auth/AuthField";
import { forgotPassword } from "../../services/authService";
import { forgotPasswordSchema } from "../../validations/forgotPasswordSchema";
import { getApiErrorMessage } from "../../utils/apiError";

import { Button } from "@/components/ui/Button";

function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        setLoading(true);
        setSuccessMessage("");
        setApiError("");

        try {
            await forgotPassword(values.email);
            const msg = "Password reset link has been sent to your email.";
            setSuccessMessage(msg);
            toast.success(msg);
        } catch (err) {
            const errorMsg = getApiErrorMessage(err, "Failed to send password reset link.");
            setApiError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    });

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8">
                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Login
                        </Link>

                        <AuthHeader
                            title="Forgot Password"
                            subtitle="Enter your registered email address and we'll send you a password reset link."
                        />
                    </div>

                    {successMessage ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <p className="text-sm font-medium leading-6">{successMessage}</p>
                            </div>
                        </div>
                    ) : null}

                    {apiError ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                <p className="text-sm font-medium leading-6">{apiError}</p>
                            </div>
                        </div>
                    ) : null}

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <AuthField
                            id="forgot-password-email"
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail size={18} />}
                            error={errors.email?.message}
                            {...register("email")}
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
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link
                            to="/"
                            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
