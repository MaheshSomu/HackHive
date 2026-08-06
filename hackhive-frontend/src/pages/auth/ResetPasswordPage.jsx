import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import PasswordInput from "../../components/auth/PasswordInput";
import { resetPassword } from "../../services/authService";
import { resetPasswordSchema } from "../../validations/resetPasswordSchema";
import { getApiErrorMessage } from "../../utils/apiError";

import { Button } from "@/components/ui/button";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        if (!token) {
            const missingTokenMsg = "Invalid or missing password reset token. Please request a new link.";
            setApiError(missingTokenMsg);
            toast.error(missingTokenMsg);
            return;
        }

        setLoading(true);
        setApiError("");

        try {
            await resetPassword({
                token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });

            toast.success("Password has been reset successfully.");
            navigate("/password-reset-success", { replace: true });
        } catch (err) {
            const errorMsg = getApiErrorMessage(err, "Failed to reset password. Please try again.");
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
                            title="Reset Password"
                            subtitle="Enter your new password below."
                        />
                    </div>

                    {!token ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <p className="text-sm font-medium leading-6">
                                    No reset token found in URL. Please use the reset link sent to your email.
                                </p>
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
                        <PasswordInput
                            id="newPassword"
                            label="New Password"
                            placeholder="Enter new password"
                            error={errors.newPassword?.message}
                            {...register("newPassword")}
                        />

                        <PasswordInput
                            id="confirmPassword"
                            label="Confirm Password"
                            placeholder="Re-enter new password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />

                        <Button
                            type="submit"
                            disabled={loading || !token}
                            className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Resetting...
                                </span>
                            ) : (
                                "Reset Password"
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

export default ResetPasswordPage;
