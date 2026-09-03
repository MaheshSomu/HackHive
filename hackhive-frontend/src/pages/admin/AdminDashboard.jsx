import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    Building2,
    CalendarDays,
    CheckCircle2,
    FileBarChart,
    GraduationCap,
    Shield,
    ShieldAlert,
    Sparkles,
    UserCheck,
    Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getDashboardStatistics();
            setStats(res);
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Welcome Banner */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                System Control Center
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                System Overview & Oversight
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                Platform administration console for user management, organizer verification, event oversight, and system metrics.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Users</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                            <Users className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats?.totalUsers ?? 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Registered platform accounts</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Students</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                            <GraduationCap className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats?.totalStudents ?? 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Active student accounts</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Organizers</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Building2 className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats?.totalOrganizers ?? 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Host organization profiles</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Hackathons</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            <CalendarDays className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats?.totalHackathons ?? 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Published events</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Teams</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            <Users className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats?.totalTeams ?? 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Formed project teams</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                            <UserCheck className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats?.totalRegistrations ?? 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Total event signups</p>
                </Card>
            </div>

            {/* Quick Actions */}
            <DashboardSection
                id="admin-shortcuts"
                eyebrow="Console"
                title="Management Actions"
                description="Quick shortcuts for platform administration."
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card
                        onClick={() => navigate("/admin/users")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950">
                            <Users className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">User Management</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">Enable/disable user accounts & inspect roles.</p>
                    </Card>

                    <Card
                        onClick={() => navigate("/admin/organizers")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800">
                            <Building2 className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Organizer Registry</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">Inspect host organizational profiles.</p>
                    </Card>

                    <Card
                        onClick={() => navigate("/admin/events")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                            <CalendarDays className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Hackathons Oversight</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">Review and manage platform hackathons.</p>
                    </Card>

                    <Card
                        onClick={() => navigate("/admin/reports")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950">
                            <FileBarChart className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Platform Reports</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">System growth and engagement metrics.</p>
                    </Card>
                </div>
            </DashboardSection>

            {/* System Status Banner */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">All System Services Operational</h4>
                        <p className="text-[11px] text-slate-500">Spring Boot REST API, JWT Authentication, and PostgreSQL Database are running normally.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}