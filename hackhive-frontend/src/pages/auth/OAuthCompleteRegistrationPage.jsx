import { useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, UserCheck, Users } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import useAuth from "../../hooks/useAuth";
import { completeOAuthRegistration } from "../../services/authService";
import { getApiErrorMessage } from "../../utils/apiError";
import { getDashboardPath } from "../../utils/authRoutes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const ROLES = [
    {
        value: "STUDENT",
        title: "Student",
        description: "Discover hackathons, join teams, and build projects.",
        icon: UserCheck,
    },
    {
        value: "ORGANIZER",
        title: "Organizer",
        description: "Create, host, and manage hackathons.",
        icon: Users,
    },
];

function OAuthCompleteRegistrationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const registrationId = searchParams.get("registrationId") || "";

    const { persistAuth } = useAuth();
    const [role, setRole] = useState("STUDENT");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!registrationId) {
            const missingMsg = "Invalid or missing registration session. Please sign in again.";
            setApiError(missingMsg);
            toast.error(missingMsg);
            return;
        }

        setLoading(true);
        setApiError("");

        try {
            const response = await completeOAuthRegistration({
                registrationId,
                role,
            });

            // ApiResponse contains data property with AuthResponse
            const authData = response.data || response;

            persistAuth(authData);
            toast.success(`Welcome to HackHive, ${authData.fullName || "User"}!`);

            const destination = getDashboardPath(authData.role);
            navigate(destination, { replace: true });
        } catch (err) {
            const errorMsg = getApiErrorMessage(err, "Failed to complete registration. Please try again.");
            setApiError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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
                            title="Complete Your Registration"
                            subtitle="Choose your role to finish creating your HackHive account."
                        />
                    </div>

                    {!registrationId ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <p className="text-sm font-medium leading-6">
                                    No registration session found. Please initiate sign in with Google again.
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Select Account Type
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {ROLES.map((r) => {
                                    const isSelected = role === r.value;
                                    const IconComponent = r.icon;

                                    return (
                                        <label
                                            key={r.value}
                                            className={cn(
                                                "relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/50",
                                                isSelected
                                                    ? "border-indigo-600 bg-indigo-50/60 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/30"
                                                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "flex size-9 items-center justify-center rounded-xl transition-colors",
                                                            isSelected
                                                                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                        )}
                                                    >
                                                        <IconComponent size={18} />
                                                    </div>

                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {r.title}
                                                    </span>
                                                </div>

                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={r.value}
                                                    checked={isSelected}
                                                    onChange={() => setRole(r.value)}
                                                    className="mt-1.5 size-4 accent-indigo-600"
                                                />
                                            </div>

                                            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                {r.description}
                                            </p>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !registrationId}
                            className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Completing Registration...
                                </span>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </form>
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default OAuthCompleteRegistrationPage;
