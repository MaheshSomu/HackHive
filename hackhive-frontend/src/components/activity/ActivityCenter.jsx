import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    Calendar,
    ChevronRight,
    Clock,
    FileText,
    FolderGit2,
    Plus,
    Rocket,
    Search,
    Shield,
    Sparkles,
    UserCheck,
    Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { eventService } from "../../services/eventService";
import { teamService } from "../../services/teamService";
import { studentDashboardService } from "../../services/studentDashboardService";
import { organizerService } from "../../services/organizerService";
import { adminService } from "../../services/adminService";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { EmptyState } from "../student-dashboard/DashboardStates";

export default function ActivityCenter() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState("TODAY"); // 'TODAY' | 'WEEK' | 'MONTH'
    const [searchQuery, setSearchQuery] = useState("");

    const loadActivities = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const items = [];
            const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            if (user.role === "STUDENT") {
                const [regsRes, teamsRes, profileRes] = await Promise.allSettled([
                    eventService.getMyRegistrations(),
                    teamService.getMyTeams(),
                    studentDashboardService.getProfile(),
                ]);

                if (regsRes.status === "fulfilled" && Array.isArray(regsRes.value)) {
                    regsRes.value.forEach((reg) => {
                        items.push({
                            id: `act-reg-${reg.registrationId || reg.eventId}`,
                            title: "Registered for Event",
                            description: `Successfully signed up for ${reg.eventTitle || "Hackathon"}`,
                            time: timeNow,
                            module: "Events",
                            icon: Calendar,
                            path: "/student/events",
                        });
                    });
                }

                if (teamsRes.status === "fulfilled" && Array.isArray(teamsRes.value)) {
                    teamsRes.value.forEach((team) => {
                        items.push({
                            id: `act-team-${team.id}`,
                            title: "Joined Team",
                            description: `Active member in team ${team.name} for ${team.eventTitle || "Hackathon"}`,
                            time: timeNow,
                            module: "Teams",
                            icon: Users,
                            path: "/student/teams",
                        });
                    });
                }

                if (profileRes.status === "fulfilled" && profileRes.value) {
                    items.push({
                        id: "act-prof-1",
                        title: "Updated Profile",
                        description: "Student portfolio and bio credentials updated",
                        time: timeNow,
                        module: "Profile",
                        icon: UserCheck,
                        path: "/student/profile",
                    });
                }
            } else if (user.role === "ORGANIZER") {
                const myEvents = await organizerService.getMyEvents().catch(() => []);
                if (Array.isArray(myEvents)) {
                    myEvents.forEach((evt) => {
                        items.push({
                            id: `act-org-evt-${evt.id}`,
                            title: "Created Event",
                            description: `Published event: ${evt.title}`,
                            time: timeNow,
                            module: "Events",
                            icon: Rocket,
                            path: "/organizer/events",
                        });

                        items.push({
                            id: `act-org-reg-${evt.id}`,
                            title: "Registration Received",
                            description: `${evt.registeredCount || 0} student registrations received for ${evt.title}`,
                            time: timeNow,
                            module: "Registrations",
                            icon: FileText,
                            path: "/organizer/registrations",
                        });
                    });
                }
            } else if (user.role === "ADMIN") {
                const stats = await adminService.getDashboardStatistics().catch(() => null);
                if (stats) {
                    items.push({
                        id: "act-adm-1",
                        title: "User Created",
                        description: `${stats.totalUsers} registered platform user accounts`,
                        time: timeNow,
                        module: "Users",
                        icon: UserCheck,
                        path: "/admin/users",
                    });

                    items.push({
                        id: "act-adm-2",
                        title: "Organizer Approved",
                        description: `${stats.totalOrganizers} active host organizer profiles verified`,
                        time: timeNow,
                        module: "Organizers",
                        icon: Shield,
                        path: "/admin/organizers",
                    });
                }
            }

            setActivities(items);
        } catch {
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    const filteredActivities = useMemo(() => {
        return activities.filter((act) => {
            const matchesSearch =
                !searchQuery.trim() ||
                act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                act.module.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [activities, searchQuery]);

    return (
        <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        Activity Log
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                        Recent Activity Center
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search activity..."
                            className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    {/* Date Filters */}
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800">
                        <button
                            type="button"
                            onClick={() => setDateFilter("TODAY")}
                            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                                dateFilter === "TODAY"
                                    ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => setDateFilter("WEEK")}
                            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                                dateFilter === "WEEK"
                                    ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            This Week
                        </button>
                        <button
                            type="button"
                            onClick={() => setDateFilter("MONTH")}
                            className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                                dateFilter === "MONTH"
                                    ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            This Month
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                </div>
            ) : filteredActivities.length > 0 ? (
                <div className="space-y-3">
                    {filteredActivities.map((act) => {
                        const IconComp = act.icon || Activity;
                        return (
                            <div
                                key={act.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                        <IconComp className="size-4.5" />
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                {act.title}
                                            </h4>
                                            <span className="rounded font-bold text-[9px] uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                {act.module}
                                            </span>
                                        </div>
                                        <p className="truncate text-[11px] text-slate-500">{act.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[10px] text-slate-400">{act.time}</span>
                                    {act.path && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(act.path)}
                                            className="rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400"
                                        >
                                            View <ChevronRight className="ml-1 size-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<Activity className="size-6 text-slate-400" />}
                    title="No activity recorded yet"
                    description="Activities will appear here as you interact with hackathons, teams, and workspace resources."
                />
            )}
        </Card>
    );
}
