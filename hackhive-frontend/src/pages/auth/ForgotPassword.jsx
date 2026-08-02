import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthField from "../../components/auth/AuthField";

import { Button } from "@/components/ui/button";

function ForgotPassword() {
    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8">
                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                        >
                            <ArrowLeft className="size-4" />
                            Back to sign in
                        </Link>

                        <AuthHeader
                            title="Reset your password"
                            subtitle="A clean reset experience will live here once the backend reset endpoint is available."
                        />
                    </div>

                    <div className="space-y-6">
                        <AuthField
                            id="forgot-email"
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail size={18} />}
                            hint="We’ll keep the reset flow consistent with the rest of HackHive."
                        />

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 size-5 text-indigo-600" />
                                <p className="text-sm leading-6 text-slate-600">
                                    The reset workflow is not connected yet. This screen is ready for backend integration when the endpoint ships.
                                </p>
                            </div>
                        </div>

                        {/* TODO: Wire password reset API when the backend endpoint becomes available. */}
                        <Button
                            type="button"
                            disabled
                            className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white opacity-70"
                        >
                            Send reset link
                        </Button>

                        <p className="text-center text-sm leading-6 text-slate-500">
                            Need help? Return to sign in and continue once reset support is ready.
                        </p>
                    </div>
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default ForgotPassword;
