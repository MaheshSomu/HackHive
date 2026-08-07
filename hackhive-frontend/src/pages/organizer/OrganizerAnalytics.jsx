import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    Filter,
    Globe,
    Layers,
    Plus,
    RefreshCw,
    Users,
    Building2,
    MapPin,
    ArrowUpRight,
} from "lucide-react";

import { organizerService } from "../../services/organizerService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";
import { toast } from "sonner";

export default function OrganizerAnalytics() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL"); // ALL | ACTIVE | UPCOMING | COMPLETED
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadAnalyticsData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await organizerService.getMyEvents();
            setEvents(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to load analytics data:", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalyticsData();
    }, [loadAnalyticsData]);

    // Handle Create Event submit
    const handleCreateSubmit = async (payload) => {
        try {
            setActionLoading(true);
            const created = await organizerService.createEvent(payload);
            setEvents((prev) => [created, ...prev]);
            toast.success("Hackathon event published successfully!");
            setIsCreateOpen(false);
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to create event.";
            toast.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    // Filter events based on filterStatus
    const filteredEvents = useMemo(() => {
        if (filterStatus === "ALL") return events;
        const now = Date.now();

        return events.filter((e) => {
            const start = e.startDate ? new Date(e.startDate).getTime() : 0;
            const end = e.endDate ? new Date(e.endDate).getTime() : 0;

            if (filterStatus === "ACTIVE") {
                return start > 0 && now >= start && (end === 0 || now <= end);
            }
            if (filterStatus === "UPCOMING") {
                return start > 0 && now < start;
            }
            if (filterStatus === "COMPLETED") {
                return end > 0 && now > end;
            }
            return true;
        });
    }, [events, filterStatus]);

    // Computed Analytics Metrics
    const metrics = useMemo(() => {
        const totalEvents = events.length;
        const now = Date.now();

        let activeCount = 0;
        let upcomingCount = 0;
        let completedCount = 0;

        let onlineCount = 0;
        let offlineCount = 0;
        let hybridCount = 0;

        let totalRegistrations = 0;
        let totalMaxTeamSizeSum = 0;

        events.forEach((e) => {
            const start = e.startDate ? new Date(e.startDate).getTime() : 0;
            const end = e.endDate ? new Date(e.endDate).getTime() : 0;

            if (start > 0 && now >= start && (end === 0 || now <= end)) {
                activeCount++;
            } else if (start > 0 && now < start) {
                upcomingCount++;
            } else if (end > 0 && now > end) {
                completedCount++;
            }

            const mode = (e.eventMode || "").toUpperCase();
            if (mode === "ONLINE") onlineCount++;
            else if (mode === "OFFLINE") offlineCount++;
            else hybridCount++;

            totalRegistrations += e.registrationsCount || 0;
            totalMaxTeamSizeSum += e.maxTeamSize || 4;
        });

        const avgRegistrationsPerEvent =
            totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;

        const avgMaxTeamSize =
            totalEvents > 0 ? (totalMaxTeamSizeSum / totalEvents).toFixed(1) : "N/A";

        // Determine dominant format
        let dominantFormat = "Online";
        if (offlineCount >= onlineCount && offlineCount >= hybridCount) {
            dominantFormat = "In-Person (Offline)";
        } else if (hybridCount >= onlineCount && hybridCount >= offlineCount) {
            dominantFormat = "Hybrid";
        }

        return {
            totalEvents,
            activeCount,
            upcomingCount,
            completedCount,
            onlineCount,
            offlineCount,
            hybridCount,
            totalRegistrations,
            avgRegistrationsPerEvent,
            avgMaxTeamSize,
            dominantFormat,
        };
    }, [events]);

    const getStatusBadge = (evt) => {
        const now = Date.now();
        const start = evt.startDate ? new Date(evt.startDate).getTime() : 0;
        const end = evt.endDate ? new Date(evt.endDate).getTime() : 0;

        if (start > 0 && now < start) {
            return { label: "Upcoming", variant: "purple" };
        }
        if (start > 0 && now >= start && (end === 0 || now <= end)) {
            return { label: "Active", variant: "success" };
        }
        if (end > 0 && now > end) {
            return { label: "Completed", variant: "secondary" };
        }
        return { label: "Published", variant: "outline" };
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-20 w-full max-w-7xl mx-auto">
                <Skeleton className="h-[140px] w-full rounded-2xl" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-[260px] w-full rounded-2xl" />
                    <Skeleton className="h-[260px] w-full rounded-2xl" />
                </div>
                <Skeleton className="h-[320px] w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 w-full max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
            {/* Header Controls Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Analytics & Insights
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Event Insights & Performance
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                        Operational metrics, student distribution, and event format analytics.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filter dropdown */}
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
                        <Filter className="size-3.5 text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-300 cursor-pointer"
                        >
                            <option value="ALL">All Events ({events.length})</option>
                            <option value="ACTIVE">Active Events ({metrics.activeCount})</option>
                            <option value="UPCOMING">Upcoming ({metrics.upcomingCount})</option>
                            <option value="COMPLETED">Completed ({metrics.completedCount})</option>
                        </select>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={loadAnalyticsData}
                        className="text-xs font-semibold gap-1.5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <RefreshCw className="size-3.5" /> Refresh
                    </Button>
                </div>
            </div>

            {/* If 0 events exist, show clean empty state */}
            {events.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <BarChart3 className="size-6" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            No event analytics data available
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                            Publish your first hackathon event to start gathering real-time audience metrics, format distributions, and registration growth analytics.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 px-5 py-2.5 rounded-xl shadow-xs"
                    >
                        <Plus className="size-4" /> Create First Event
                    </Button>
                </div>
            ) : (
                <>
                    {/* 1. Calm KPI Summary Grid (4 Cards) */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* KPI 1 */}
                        <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Total Events Hosted
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                    {metrics.totalEvents}
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="size-3.5" />
                                    {metrics.activeCount} Active
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {metrics.upcomingCount} upcoming event(s) scheduled
                            </p>
                        </Card>

                        {/* KPI 2 */}
                        <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Total Registrations
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                                    {metrics.totalRegistrations}
                                </span>
                                <span className="text-xs font-medium text-slate-500">
                                    ~{metrics.avgRegistrationsPerEvent}/event
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Confirmed student participants
                            </p>
                        </Card>

                        {/* KPI 3 */}
                        <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Primary Event Format
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
                                    {metrics.dominantFormat}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {metrics.onlineCount} Virtual • {metrics.offlineCount} In-Person • {metrics.hybridCount} Hybrid
                            </p>
                        </Card>

                        {/* KPI 4 */}
                        <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Avg Max Team Capacity
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                    {metrics.avgMaxTeamSize}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                    members/team
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Max team size setting across events
                            </p>
                        </Card>
                    </div>

                    {/* 2. Format Breakdown & Key Indicators (2 Columns) */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Format Distribution Panel */}
                        <Card className="border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
                            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Event Format Distribution
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Ratio of virtual, physical, and hybrid hackathon hosting formats.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Online */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        <span className="flex items-center gap-1.5">
                                            <Globe className="size-3.5 text-indigo-500" /> Virtual / Online
                                        </span>
                                        <span>
                                            {metrics.onlineCount} event(s) (
                                            {metrics.totalEvents > 0
                                                ? Math.round((metrics.onlineCount / metrics.totalEvents) * 100)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full bg-purple-600 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    metrics.totalEvents > 0
                                                        ? (metrics.onlineCount / metrics.totalEvents) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Offline */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="size-3.5 text-purple-500" /> In-Person / Offline
                                        </span>
                                        <span>
                                            {metrics.offlineCount} event(s) (
                                            {metrics.totalEvents > 0
                                                ? Math.round((metrics.offlineCount / metrics.totalEvents) * 100)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    metrics.totalEvents > 0
                                                        ? (metrics.offlineCount / metrics.totalEvents) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Hybrid */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        <span className="flex items-center gap-1.5">
                                            <Layers className="size-3.5 text-emerald-500" /> Hybrid Format
                                        </span>
                                        <span>
                                            {metrics.hybridCount} event(s) (
                                            {metrics.totalEvents > 0
                                                ? Math.round((metrics.hybridCount / metrics.totalEvents) * 100)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    metrics.totalEvents > 0
                                                        ? (metrics.hybridCount / metrics.totalEvents) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Operational Takeaways Card */}
                        <Card className="border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                            <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Operational Insights & Recommendations
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Data-driven takeaways from your hosting history.
                                </p>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-0.5 size-1.5 rounded-full bg-purple-600 shrink-0" />
                                    <span>
                                        <strong className="text-slate-900 dark:text-slate-100">Event Portfolio Volume:</strong> You have hosted {metrics.totalEvents} hackathon instance(s) with an average of {metrics.avgRegistrationsPerEvent} student participant(s) per event.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2.5">
                                    <span className="mt-0.5 size-1.5 rounded-full bg-purple-600 shrink-0" />
                                    <span>
                                        <strong className="text-slate-900 dark:text-slate-100">Dominant Mode:</strong> {metrics.dominantFormat} formats generate steady student engagement across regional chapters.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2.5">
                                    <span className="mt-0.5 size-1.5 rounded-full bg-purple-600 shrink-0" />
                                    <span>
                                        <strong className="text-slate-900 dark:text-slate-100">Team Structure:</strong> Average configured maximum team size is {metrics.avgMaxTeamSize} members.
                                    </span>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    {/* 3. Event Performance Data Table */}
                    <Card className="border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden space-y-0">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Event Performance Breakdown
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Detailed breakdown of all published hackathons ({filteredEvents.length} displaying).
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3 px-6">Event Name</th>
                                        <th className="py-3 px-4">Format</th>
                                        <th className="py-3 px-4">Start Date</th>
                                        <th className="py-3 px-4">End Date</th>
                                        <th className="py-3 px-4 text-center">Registrations</th>
                                        <th className="py-3 px-4 text-center">Team Capacity</th>
                                        <th className="py-3 px-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredEvents.map((evt) => {
                                        const status = getStatusBadge(evt);
                                        const startDateStr = evt.startDate
                                            ? new Date(evt.startDate).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "TBD";

                                        const endDateStr = evt.endDate
                                            ? new Date(evt.endDate).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "TBD";

                                        return (
                                            <tr
                                                key={evt.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                            >
                                                <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <span>{evt.title}</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {evt.eventMode || "ONLINE"}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                    {startDateStr}
                                                </td>

                                                <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-medium">
                                                    {endDateStr}
                                                </td>

                                                <td className="py-4 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                                                    {evt.registrationsCount || 0}
                                                </td>

                                                <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                                                    {evt.minTeamSize || 1} - {evt.maxTeamSize || 4} members
                                                </td>

                                                <td className="py-4 px-6 text-right">
                                                    <Badge variant={status.variant} className="px-2.5 py-0.5 text-[10px] font-bold">
                                                        {status.label}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}

            {/* Create Event Modal */}
            <OrganizerEventModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
                isLoading={actionLoading}
            />
        </div>
    );
}
