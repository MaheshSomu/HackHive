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