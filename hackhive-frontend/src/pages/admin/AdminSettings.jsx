import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, KeyRound, Lock, Mail, Server, Shield, UserCheck } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { requestPasswordChange } from "../../services/authService";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";

export default function AdminSettings() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

    const handleRequestPasswordChange = async () => {
        try {
            setLoading(true);
            const res = await requestPasswordChange();
            const msg = res?.message || "Password reset link sent to your account email.";
            toast.success(msg);
            setIsModalOpen(false);
        } catch (err) {
            const msg = err?.response?.data?.message || "Unable to send password reset email. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Platform Settings & Application Details Header */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Console Settings
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Platform Settings & Application Details
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            System configuration information, backend API endpoints, and admin profile overview.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Administrator Profile Section */}
            <DashboardSection
                id="admin-profile-info"
                eyebrow="Profile"
                title="Administrator Profile"
                description="Current logged-in system administrator."
            >
                <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-sm shrink-0">
                                {(user?.fullName || "A")[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {user?.fullName || "Administrator"}
                                </h3>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                                <span className="mt-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                                    Role: {user?.role || "ADMIN"}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 shadow-xs active:bg-blue-700 self-start sm:self-center"
                        >
                            <KeyRound className="size-3.5 mr-1.5" /> Request Password Change
                        </Button>
                    </div>
                </Card>
            </DashboardSection>

            {/* Security & Access Control Section */}
            <DashboardSection
                id="security-info"
                eyebrow="Security"
                title="Security & Access Control"
                description="Platform authentication standards and administrator security controls."
            >
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Lock className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>Authentication</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">JWT Authentication Bearer Tokens</p>
                        <p className="text-[11px] text-slate-400">Stateless session tokens with cryptographic verification</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Shield className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>Authorization</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Role-based Authorization</p>
                        <p className="text-[11px] text-slate-400">Spring Method Security & endpoint route filters</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <UserCheck className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>Account</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Administrator account</p>
                        <p className="text-[11px] text-slate-400">Full administrative privileges across platform resources</p>
                    </Card>
                </div>
            </DashboardSection>

            {/* System Information Section */}
            <DashboardSection
                id="system-info"
                eyebrow="Application"
                title="System Information"
                description="Configuration and API connectivity."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Server className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>Backend Server API</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">{apiBaseUrl}</p>
                        <p className="text-[11px] text-slate-400">Spring Boot REST API Service</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>API Gateway Status</span>
                        </div>
                        <p className="text-xs text-slate-500">Connected & Operational</p>
                        <p className="text-[11px] text-slate-400">Axios interceptor configured with Bearer token authentication</p>
                    </Card>
                </div>
            </DashboardSection>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !loading && setIsModalOpen(false)}
                title="Request Password Change"
                description="Send a secure password reset link to your administrator email address."
                maxWidth="max-w-md"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsModalOpen(false)}
                            disabled={loading}
                            className="text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={loading}
                            isLoading={loading}
                            onClick={handleRequestPasswordChange}
                            className="rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 shadow-xs active:bg-blue-700"
                        >
                            Send Reset Link
                        </Button>
                    </>
                }
            >
                <div className="space-y-3 py-1">
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        A secure password reset link will be sent to your account email:
                    </p>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-800">
                        <Mail className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                            {user?.email || "admin@hackhive.com"}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Follow the instructions in the email to complete the password change process. The link will remain active for 30 minutes.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
