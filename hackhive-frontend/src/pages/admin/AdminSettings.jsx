import useAuth from "../../hooks/useAuth";
import { Card, CardContent } from "../../components/ui/Card";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { Shield, Server, UserCheck, KeyRound } from "lucide-react";

export default function AdminSettings() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 pb-16">
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

            <DashboardSection
                id="admin-profile-info"
                eyebrow="Profile"
                title="Administrator Profile"
                description="Current logged-in system administrator."
            >
                <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-sm">
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
                    </div>
                </Card>
            </DashboardSection>

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
                        <p className="text-xs text-slate-500 font-mono">http://localhost:8080/api</p>
                        <p className="text-[11px] text-slate-400">Spring Boot REST API Service</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Shield className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>Security & Authentication</span>
                        </div>
                        <p className="text-xs text-slate-500">JWT Authentication Bearer Tokens</p>
                        <p className="text-[11px] text-slate-400">Spring Security + Role-based Authorization</p>
                    </Card>
                </div>
            </DashboardSection>
        </div>
    );
}
