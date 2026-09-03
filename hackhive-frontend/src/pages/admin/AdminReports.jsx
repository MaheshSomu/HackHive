import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    Award,
    Building2,
    Calendar,
    CalendarDays,
    CheckCircle2,
    Clock,
    FileBarChart,
    GraduationCap,
    Layers,
    ShieldCheck,
    UserCheck,
    Users,
    UserX,
} from "lucide-react";

import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton } from "../../components/student-dashboard/DashboardStates";
import { Card, CardContent } from "../../components/ui/Card";

export default function AdminReports() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [teams, setTeams] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAllReportData = useCallback(async () => {
        try {
            setLoading(true);

            const [
                statsRes,
                usersRes,
                organizersRes,
                hackathonsRes,
                teamsRes,
                registrationsRes,
            ] = await Promise.allSettled([
                adminService.getDashboardStatistics(),
                adminService.getAllUsers(),
                adminService.getAllOrganizers(),
                adminService.getAllHackathons(),
                adminService.getAllTeams(),
                adminService.getAllRegistrations(),
            ]);

            setStats(statsRes.status === "fulfilled" ? statsRes.value : null);
            setUsers(usersRes.status === "fulfilled" && Array.isArray(usersRes.value) ? usersRes.value : []);
            setOrganizers(organizersRes.status === "fulfilled" && Array.isArray(organizersRes.value) ? organizersRes.value : []);
            setHackathons(hackathonsRes.status === "fulfilled" && Array.isArray(hackathonsRes.value) ? hackathonsRes.value : []);
            setTeams(teamsRes.status === "fulfilled" && Array.isArray(teamsRes.value) ? teamsRes.value : []);
            setRegistrations(registrationsRes.status === "fulfilled" && Array.isArray(registrationsRes.value) ? registrationsRes.value : []);
        } catch {
            // Handled gracefully via default empty states
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllReportData();
    }, [loadAllReportData]);

    // Computation derived strictly from real API response data
    const userAnalytics = useMemo(() => {
        const total = users.length || (stats?.totalUsers ?? 0);
        const enabled = users.filter((u) => Boolean(u.enabled)).length;
        const disabled = users.filter((u) => !u.enabled).length;
        const verified = users.filter((u) => Boolean(u.emailVerified)).length;

        const students = users.filter((u) => (u.role || "").toUpperCase() === "STUDENT").length;
        const organizersCount = users.filter((u) => (u.role || "").toUpperCase() === "ORGANIZER").length;
        const admins = users.filter((u) => (u.role || "").toUpperCase() === "ADMIN").length;

        return {
            total,
            enabled,
            disabled,
            verified,
            students: students || (stats?.totalStudents ?? 0),
            organizers: organizersCount || (stats?.totalOrganizers ?? 0),
            admins,
        };
    }, [users, stats]);

    const organizerAnalytics = useMemo(() => {
        const total = organizers.length || (stats?.totalOrganizers ?? 0);
        const verified = organizers.filter((o) => Boolean(o.verified)).length;
        const pending = total - verified;

        const typeMap = {};
        organizers.forEach((o) => {
            const type = o.organizationType || "Unspecified";
            typeMap[type] = (typeMap[type] || 0) + 1;
        });

        const typesList = Object.entries(typeMap).map(([type, count]) => ({
            type,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        })).sort((a, b) => b.count - a.count);

        return { total, verified, pending, typesList };
    }, [organizers, stats]);

    const eventAnalytics = useMemo(() => {
        const total = hackathons.length || (stats?.totalHackathons ?? 0);
        let online = 0;
        let offline = 0;
        let hybrid = 0;

        const now = new Date();
        let upcoming = 0;
        let ongoing = 0;
        let concluded = 0;

        const hostMap = {};

        hackathons.forEach((h) => {
            const mode = (h.mode || "").toUpperCase();
            if (mode === "ONLINE") online++;
            else if (mode === "OFFLINE") offline++;
            else hybrid++;

            const start = h.startDate ? new Date(h.startDate) : null;
            const end = h.endDate ? new Date(h.endDate) : null;

            if (start && start > now) upcoming++;
            else if (start && end && start <= now && end >= now) ongoing++;
            else if (end && end < now) concluded++;
            else upcoming++;

            const host = h.organizationName || h.organizerName || "Host Organization";
            hostMap[host] = (hostMap[host] || 0) + 1;
        });

        const topHosts = Object.entries(hostMap)
            .map(([host, count]) => ({ host, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return { total, online, offline, hybrid, upcoming, ongoing, concluded, topHosts };
    }, [hackathons, stats]);

    const registrationLeaderboard = useMemo(() => {
        const regMap = {};
        registrations.forEach((r) => {
            const name = r.hackathonName || `Hackathon #${r.hackathonId}`;
            regMap[name] = (regMap[name] || 0) + 1;
        });

        return Object.entries(regMap)
            .map(([title, count]) => ({ title, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [registrations]);

    const teamAnalytics = useMemo(() => {
        const total = teams.length || (stats?.totalTeams ?? 0);
        const fullTeams = teams.filter((t) => (t.currentMembers || 0) >= (t.maxMembers || 0)).length;
        const recruitingTeams = total - fullTeams;

        return { total, fullTeams, recruitingTeams };
    }, [teams, stats]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header Hero Banner */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Platform Reporting & Oversight
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            System Reports & Analytics Summary
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Comprehensive platform activity reports spanning user governance, student participation, host organization verifications, and event capacity.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Section 1: Summary Key Performance Metrics */}
            <DashboardSection
                id="reports-kpi"
                eyebrow="System Totals"
                title="Platform Core Metrics"
                description="Live totals recorded across active database records."
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Platform Users</span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                <Users className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {stats?.totalUsers ?? userAnalytics.total}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Registered platform accounts</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Directory</span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                <GraduationCap className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {stats?.totalStudents ?? userAnalytics.students}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Enrolled student profiles</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Host Organizations</span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <Building2 className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {stats?.totalOrganizers ?? organizerAnalytics.total}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Registered organizer entities</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Hackathons</span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                <CalendarDays className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {stats?.totalHackathons ?? eventAnalytics.total}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Global hackathon events</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Formed Teams</span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                <Users className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {stats?.totalTeams ?? teamAnalytics.total}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Collaborative student teams</p>
                    </Card>

                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Signups</span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                                <UserCheck className="size-4.5" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {stats?.totalRegistrations ?? registrations.length}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Student event registrations</p>
                    </Card>
                </div>
            </DashboardSection>

            {/* Section 2: User Role Governance & Account Status */}
            <DashboardSection
                id="user-breakdown"
                eyebrow="User Governance"
                title="Account Breakdown & Roles"
                description="Distribution of registered user roles and authorization statuses."
            >
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Role Distribution Card */}
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Role Composition</h4>
                            <span className="text-[11px] font-semibold text-slate-500">{userAnalytics.total} Total Users</span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>Students</span>
                                    <span>{userAnalytics.students} ({userAnalytics.total > 0 ? Math.round((userAnalytics.students / userAnalytics.total) * 100) : 0}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${userAnalytics.total > 0 ? (userAnalytics.students / userAnalytics.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>Organizers</span>
                                    <span>{userAnalytics.organizers} ({userAnalytics.total > 0 ? Math.round((userAnalytics.organizers / userAnalytics.total) * 100) : 0}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-slate-700 dark:bg-slate-300 transition-all duration-300"
                                        style={{ width: `${userAnalytics.total > 0 ? (userAnalytics.organizers / userAnalytics.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>Administrators</span>
                                    <span>{userAnalytics.admins} ({userAnalytics.total > 0 ? Math.round((userAnalytics.admins / userAnalytics.total) * 100) : 0}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-300"
                                        style={{ width: `${userAnalytics.total > 0 ? (userAnalytics.admins / userAnalytics.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Account Status Card */}
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Account Authorization & Verification</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active Accounts</span>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{userAnalytics.enabled}</p>
                                <p className="text-[10px] text-slate-500">Enabled for platform access</p>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <UserX className="size-4 text-rose-600" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Disabled Accounts</span>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{userAnalytics.disabled}</p>
                                <p className="text-[10px] text-slate-500">Deactivated or locked</p>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-500">Email Verified Accounts:</span>
                            <span className="text-emerald-600 font-bold">{userAnalytics.verified} / {userAnalytics.total}</span>
                        </div>
                    </Card>
                </div>
            </DashboardSection>

            {/* Section 3: Host Verification & Organization Types */}
            <DashboardSection
                id="organizer-breakdown"
                eyebrow="Host Oversight"
                title="Organizer Verification & Entity Types"
                description="Status of host organization profiles and organizational categories."
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Host Verification Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Verified Hosts</span>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{organizerAnalytics.verified}</p>
                                <p className="text-[10px] text-slate-500">Fully verified hosts</p>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-slate-500" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pending Review</span>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{organizerAnalytics.pending}</p>
                                <p className="text-[10px] text-slate-500">Awaiting verification</p>
                            </div>
                        </div>
                    </Card>

                    {/* Organization Types Breakdown */}
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Organization Types</h4>
                        {organizerAnalytics.typesList.length > 0 ? (
                            <div className="space-y-2.5">
                                {organizerAnalytics.typesList.map((item) => (
                                    <div key={item.type}>
                                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            <span>{item.type}</span>
                                            <span className="font-bold">{item.count}</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-300"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No organizer type data recorded yet.</p>
                        )}
                    </Card>
                </div>
            </DashboardSection>

            {/* Section 4: Event Modes & Timeline Oversight */}
            <DashboardSection
                id="events-breakdown"
                eyebrow="Event Oversight"
                title="Hackathon Delivery Modes & Statuses"
                description="Breakdown of event formats, activity windows, and top host organizers."
            >
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Event Formats Card */}
                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Modes</h4>
                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Online Events</span>
                                <span className="text-blue-600 font-bold">{eventAnalytics.online}</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Offline Events</span>
                                <span className="text-emerald-600 font-bold">{eventAnalytics.offline}</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Hybrid Events</span>
                                <span className="text-amber-600 font-bold">{eventAnalytics.hybrid}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline Statuses Card */}
                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline Windows</h4>
                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Upcoming Events</span>
                                <span className="text-blue-600 font-bold">{eventAnalytics.upcoming}</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Ongoing / Active</span>
                                <span className="text-emerald-600 font-bold">{eventAnalytics.ongoing}</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span>Concluded Events</span>
                                <span className="text-slate-500 font-bold">{eventAnalytics.concluded}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Top Host Organizations */}
                    <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Hosts by Hackathons</h4>
                        {eventAnalytics.topHosts.length > 0 ? (
                            <div className="space-y-2 pt-1">
                                {eventAnalytics.topHosts.map((item) => (
                                    <div key={item.host} className="flex items-center justify-between text-xs">
                                        <span className="truncate max-w-[140px] font-semibold text-slate-800 dark:text-slate-200">{item.host}</span>
                                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                            {item.count} {item.count === 1 ? "Event" : "Events"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No hackathon events published yet.</p>
                        )}
                    </Card>
                </div>
            </DashboardSection>

            {/* Section 5: Hackathon Registration & Team Leaderboards */}
            <DashboardSection
                id="registrations-leaderboard"
                eyebrow="Participation"
                title="Registration Activity & Team Capacity"
                description="Hackathons with highest student signups and team formation statistics."
            >
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Top Hackathons by Signups */}
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Most Popular Hackathons by Registrations</h4>
                        {registrationLeaderboard.length > 0 ? (
                            <div className="space-y-3">
                                {registrationLeaderboard.map((item, idx) => (
                                    <div key={item.title} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                #{idx + 1}
                                            </span>
                                            <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{item.title}</span>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            {item.count} {item.count === 1 ? "Signup" : "Signups"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No student registrations recorded yet.</p>
                        )}
                    </Card>

                    {/* Team Formation Metrics */}
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Team Capacity Overview</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Recruiting Teams</span>
                                <p className="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-400">{teamAnalytics.recruitingTeams}</p>
                                <p className="text-[10px] text-slate-500">Open for new members</p>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Roster Teams</span>
                                <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{teamAnalytics.fullTeams}</p>
                                <p className="text-[10px] text-slate-500">Maximum capacity reached</p>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                            <span>Total Collaborative Teams Formed:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">{teamAnalytics.total}</span>
                        </div>
                    </Card>
                </div>
            </DashboardSection>
        </div>
    );
}
