import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";

import { Button } from "@/components/ui/button";

function PasswordResetSuccessPage() {
    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                        <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <AuthHeader
                        title="Password Reset Successful"
                        subtitle="Your password has been updated successfully. You can now login using your new password."
                    />

                    <Link to="/login" className="block">
                        <Button
                            type="button"
                            className="h-14 w-full rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                            Go to Login
                        </Button>
                    </Link>
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default PasswordResetSuccessPage;
