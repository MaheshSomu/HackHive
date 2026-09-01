import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthField from "../../components/auth/AuthField";
import useAuth from "../../hooks/useAuth";
import { loginSchema } from "../../validations/loginSchema";
import { getApiErrorMessage } from "../../utils/apiError";
import { getDashboardPath } from "../../utils/authRoutes";
import { requestAccountReactivation } from "../../services/authService";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function GoogleIcon() {
    return (
        <svg className="size-5 shrink-0" viewBox="0 0 24 24">
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
    );
}

function GithubIcon() {
    return (
        <svg className="size-5 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { login, loading } = useAuth();

    const [isDeactivated, setIsDeactivated] = useState(false);
    const [deactivatedEmail, setDeactivatedEmail] = useState("");
    const [reactivatingLoading, setReactivatingLoading] = useState(false);
    const [reactivationSent, setReactivationSent] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: location.state?.email || searchParams.get("email") || "",
            password: "",
            remember: true,
        },
    });

    useEffect(() => {
        if (location.state?.email) {
            setValue("email", location.state.email, { shouldValidate: true });
        }
        const errorParam = searchParams.get("error");
        if (errorParam === "account_deactivated") {
            setIsDeactivated(true);
            const emailParam = searchParams.get("email");
            if (emailParam) {
                setDeactivatedEmail(emailParam);
                setValue("email", emailParam, { shouldValidate: true });
            }
        } else if (errorParam) {
            if (errorParam === "oauth_email_missing") {
                toast.error("Unable to retrieve email from your GitHub account. Please ensure your email is set or try signing up directly.");
            } else {
                toast.error(`Authentication failed: ${decodeURIComponent(errorParam)}`);
            }
        }
    }, [location.state, searchParams, setValue]);

    const onSubmit = handleSubmit(async (values) => {
        setIsDeactivated(false);
        setReactivationSent(false);
        try {
            const auth = await login(
                {
                    email: values.email,
                    password: values.password,
                },
                { remember: values.remember }
            );

            toast.success(`Welcome back, ${auth.fullName}.`);
            navigate(getDashboardPath(auth.role), { replace: true });
        } catch (error) {
            const errorMsg = getApiErrorMessage(error);
            if (errorMsg.toLowerCase().includes("deactivated") || error.response?.status === 403) {
                setIsDeactivated(true);
                setDeactivatedEmail(values.email);
            } else {
                toast.error(errorMsg);
            }
        }
    });

    const handleRequestReactivation = async () => {
        const emailToUse = deactivatedEmail || getValues("email");
        if (!emailToUse) {
            toast.error("Please enter your email address to request reactivation.");
            return;
        }

        setReactivatingLoading(true);
        try {
            await requestAccountReactivation(emailToUse);
            setReactivationSent(true);
            toast.success("Reactivation link sent. Please check your email inbox.");
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to request account reactivation."));
        } finally {
            setReactivatingLoading(false);
        }
    };

    const handleGoogleSocialLogin = () => {
        const backendBaseUrl = (
            import.meta.env.VITE_API_BASE_URL ||
            "http://localhost:8080/api"
        ).replace(/\/api\/?$/, "");

        window.location.href = `${backendBaseUrl}/oauth2/authorization/google`;
    };

    const handleGithubSocialLogin = () => {
        const backendBaseUrl = (
            import.meta.env.VITE_API_BASE_URL ||
            "http://localhost:8080/api"
        ).replace(/\/api\/?$/, "");

        window.location.href = `${backendBaseUrl}/oauth2/authorization/github`;
    };

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8">
                    <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                            Sign in
                        </p>
                        <AuthHeader
                            title="Welcome back"
                            subtitle="Sign in to continue your HackHive workspace."
                        />
                    </div>

                    {isDeactivated && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 dark:border-rose-900/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 space-y-3">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">Your account is currently deactivated.</p>
                                    <p className="text-[11px] text-rose-700/90 dark:text-rose-300/90 font-medium leading-relaxed">
                                        Account login is disabled. You can request a secure email reactivation link below.
                                    </p>
                                </div>
                            </div>

                            {reactivationSent ? (
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>Reactivation link sent. Check your email.</span>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    disabled={reactivatingLoading}
                                    onClick={handleRequestReactivation}
                                    className="w-full font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl"
                                >
                                    {reactivatingLoading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="size-3.5 animate-spin" />
                                            Sending Reactivation Email...
                                        </span>
                                    ) : (
                                        "Reactivate Account"
                                    )}
                                </Button>
                            )}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={onSubmit}>
                        <AuthField
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail size={18} />}
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <PasswordInput
                            id="password"
                            label="Password"
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <div className="flex items-center justify-between gap-4">
                            <Controller
                                name="remember"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex items-center gap-3 text-sm text-slate-600">
                                        <Checkbox
                                            checked={Boolean(field.value)}
                                            onCheckedChange={(checked) =>
                                                field.onChange(Boolean(checked))
                                            }
                                        />
                                        Remember me
                                    </label>
                                )}
                            />

                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Signing in
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    {/* Centered Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                            <span className="bg-white px-3 font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                                Continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleGoogleSocialLogin}
                            aria-label="Continue with Google"
                            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-base font-semibold text-slate-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGithubSocialLogin}
                            aria-label="Continue with GitHub"
                            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-base font-semibold text-slate-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                        >
                            <GithubIcon />
                            <span>Continue with GitHub</span>
                        </button>
                    </div>

                    <AuthFooter
                        text="New to HackHive?"
                        linkText="Create account"
                        to="/register"
                    />
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default Login;
