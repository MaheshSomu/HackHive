import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Phone, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthField from "../../components/auth/AuthField";
import AuthRoleSelect from "../../components/auth/AuthRoleSelect";
import PasswordInput from "../../components/auth/PasswordInput";
import useAuth from "../../hooks/useAuth";
import { registerSchema } from "../../validations/registerSchema";
import { getApiErrorMessage } from "../../utils/apiError";

import { Button } from "@/components/ui/button";

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

function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const { register: registerUser, loading } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: location.state?.email || "",
            phoneNumber: "",
            role: "STUDENT",
            password: "",
            confirmPassword: "",
        },
    });

    const role = useWatch({
        control,
        name: "role",
    });

    useEffect(() => {
        if (location.state?.email) {
            setValue("email", location.state.email, { shouldValidate: true });
        }
    }, [location.state, setValue]);

    const onSubmit = handleSubmit(async (values) => {
        try {
            const response = await registerUser({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                phoneNumber: values.phoneNumber || null,
                role: values.role,
            });

            toast.success(response.message || "Registration successful.");
            navigate("/", {
                replace: true,
                state: { email: values.email },
            });
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    });

    const handleGoogleSocialSignUp = () => {
        const backendBaseUrl = (
            import.meta.env.VITE_API_BASE_URL ||
            "http://localhost:8080/api"
        ).replace(/\/api\/?$/, "");

        window.location.href =
            `${backendBaseUrl}/oauth2/authorization/google`;
    };  


    const handleGithubSocialSignUp = () => {
        toast.info("GitHub Sign Up will be available soon.");
    };

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8">
                    <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                            Create account
                        </p>
                        <AuthHeader
                            title="Join HackHive"
                            subtitle="Set up your workspace and get started in minutes."
                        />
                    </div>

                    <form className="space-y-5" onSubmit={onSubmit}>
                        <AuthField
                            id="fullName"
                            label="Full name"
                            placeholder="Your name"
                            icon={<User size={18} />}
                            error={errors.fullName?.message}
                            {...register("fullName")}
                        />

                        <AuthField
                            id="register-email"
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail size={18} />}
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <AuthField
                            id="phoneNumber"
                            label="Phone number"
                            placeholder="Optional"
                            icon={<Phone size={18} />}
                            error={errors.phoneNumber?.message}
                            {...register("phoneNumber")}
                        />

                        <AuthRoleSelect
                            value={role}
                            onChange={(nextRole) =>
                                setValue("role", nextRole, { shouldValidate: true })
                            }
                            error={errors.role?.message}
                        />

                        <PasswordInput
                            id="register-password"
                            label="Password"
                            placeholder="Create a password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <PasswordInput
                            id="confirmPassword"
                            label="Confirm password"
                            placeholder="Re-enter your password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating account
                                </span>
                            ) : (
                                "Create account"
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
                                Or sign up with
                            </span>
                        </div>
                    </div>

                    {/* Social Registration Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleGoogleSocialSignUp}
                            aria-label="Continue with Google"
                            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-base font-semibold text-slate-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                        >
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGithubSocialSignUp}
                            aria-label="Continue with GitHub"
                            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-base font-semibold text-slate-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                        >
                            <GithubIcon />
                            <span>Continue with GitHub</span>
                        </button>
                    </div>

                    <AuthFooter
                        text="Already have an account?"
                        linkText="Sign in"
                        to="/"
                    />
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default Register;
