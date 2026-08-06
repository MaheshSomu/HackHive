import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import useAuth from "../../hooks/useAuth";
import { getCurrentUser } from "../../services/authService";
import { storage } from "../../utils/storage";
import { getDashboardPath } from "../../utils/authRoutes";

function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { persistAuth } = useAuth();

    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true });
            return;
        }

        let isMounted = true;

        async function handleOAuthSuccess() {
            try {
                storage.setToken(token);
                const response = await getCurrentUser();
                const userData = response.data;

                const authObj = {
                    accessToken: token,
                    tokenType: "Bearer",
                    userId: userData.userId,
                    fullName: userData.fullName,
                    email: userData.email,
                    role: userData.role,
                };

                if (isMounted) {
                    persistAuth(authObj);
                    toast.success(`Welcome back, ${userData.fullName}.`);
                    navigate(getDashboardPath(userData.role), { replace: true });
                }
            } catch {
                if (isMounted) {
                    storage.clear();
                    toast.error("Authentication failed. Please try again.");
                    navigate("/", { replace: true });
                }
            }
        }

        handleOAuthSuccess();

        return () => {
            isMounted = false;
        };
    }, [token, navigate, persistAuth]);

    return (
        <AuthLayout>
            <AuthCard>
                <div className="space-y-8 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                        <Loader2 className="size-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <AuthHeader
                        title="Signing You In"
                        subtitle="Completing Google authentication..."
                    />
                </div>
            </AuthCard>
        </AuthLayout>
    );
}

export default OAuthSuccessPage;
