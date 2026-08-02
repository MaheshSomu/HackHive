import { useCallback, useEffect, useState } from "react";
import { Building2, CalendarDays, FileBarChart, GraduationCap, UserCheck, Users } from "lucide-react";
import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton } from "../../components/student-dashboard/DashboardStates";
import { Card, CardContent } from "../../components/ui/Card";

export default function AdminReports() {
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
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                            Platform Reporting
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            System Reports & Summary Metrics
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Comprehensive platform activity reports spanning registered users, student participation, host organizations, and event capacity.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <DashboardSection
                id="reports-summary"
                eyebrow="Summary"
                title="System Activity Overview"
                description="Live totals recorded across database entities."
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <Users className="size-5 text-rose-600" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Users Summary</h4>
                                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                                    {stats?.totalUsers ?? 0} Accounts
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <CalendarDays className="size-5 text-emerald-600" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Events Summary</h4>
                                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                                    {stats?.totalHackathons ?? 0} Hackathons
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <UserCheck className="size-5 text-cyan-600" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Registrations Summary</h4>
                                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                                    {stats?.totalRegistrations ?? 0} Signups
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </DashboardSection>
        </div>
    );
}
