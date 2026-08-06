import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import { verifyEmailToken } from "../../services/authService";

function VerifyEmailHandlerPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            navigate("/email-verification-failed", { replace: true });
            return;
        }

        let isMounted = true;

        async function performVerification() {
            try {
                await verifyEmailToken(token);
                if (isMounted) {
                    navigate("/email-verified", { replace: true });
                }
            } catch {
                if (isMounted) {
                    navigate("/email-verification-failed", { replace: true });
                }
            }
        }

        performVerification();

        return () => {
            isMounted = false;
        };
    }, [token, navigate]);

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                        <Loader2 className="size-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <AuthHeader
                        title="Verifying Your Email"
                        subtitle="Please wait while we verify your email address..."
                    />
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default VerifyEmailHandlerPage;
