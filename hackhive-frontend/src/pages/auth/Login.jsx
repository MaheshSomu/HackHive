import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: location.state?.email || "",
            password: "",
            remember: true,
        },
    });

    useEffect(() => {
        if (location.state?.email) {
            setValue("email", location.state.email, { shouldValidate: true });
        }
    }, [location.state, setValue]);

    const onSubmit = handleSubmit(async (values) => {
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
            toast.error(getApiErrorMessage(error));
        }
    });

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