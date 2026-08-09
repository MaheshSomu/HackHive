import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    BarChart3,
    Calendar,
    Clock,
    Filter,
    Globe,
    Building2,
    Layers,
    Plus,
    RefreshCw,
    Users,
    AlertCircle,
    RotateCw,
    ChevronRight,
} from "lucide-react";

import { organizerService } from "../../services/organizerService";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import HackHiveSelect from "../../components/ui/HackHiveSelect";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";

const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export default function OrganizerAnalytics() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL"); // ALL | ACTIVE | UPCOMING | COMPLETED

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadAnalyticsData = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await organizerService.getMyEvents();
            setEvents(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to load analytics data:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalyticsData();
    }, [loadAnalyticsData]);

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

    // Filter events based on status dropdown
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

    // Computed Analytics Metrics strictly using backend data
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
        let topEvent = null;

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

            const regCount = e.registrationCount || 0;
            totalRegistrations += regCount;
            totalMaxTeamSizeSum += e.maxTeamSize || 4;

            if (!topEvent || regCount > (topEvent.registrationCount || 0)) {
                topEvent = e;
            }
        });

        const avgRegistrationsPerEvent =
            totalEvents > 0 ? (totalRegistrations / totalEvents).toFixed(1) : 0;

        const avgMaxTeamSize =
            totalEvents > 0 ? (totalMaxTeamSizeSum / totalEvents).toFixed(1) : 0;

        // Calculate dominant format details
        let dominantFormatName = "Offline";
        let dominantFormatCount = offlineCount;

        if (onlineCount > offlineCount && onlineCount >= hybridCount) {
            dominantFormatName = "Online";
            dominantFormatCount = onlineCount;
        } else if (hybridCount > offlineCount && hybridCount > onlineCount) {
            dominantFormatName = "Hybrid";
            dominantFormatCount = hybridCount;
        }

        const dominantFormatPct =
            totalEvents > 0 ? Math.round((dominantFormatCount / totalEvents) * 100) : 0;

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
            topEvent,
            dominantFormatName,
            dominantFormatPct,
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
            <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <Skeleton className="h-[100px] w-full rounded-xl" />

                {/* Key Metrics Skeleton */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                    ))}
                </div>

                {/* Overview Skeleton */}
                <Skeleton className="h-[220px] w-full rounded-xl" />

                {/* Format & Insights Skeleton */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-[240px] w-full rounded-xl" />
                    <Skeleton className="h-[240px] w-full rounded-xl" />
                </div>

                {/* Table Skeleton */}
                <Skeleton className="h-[280px] w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto py-12">
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-xs dark:border-red-900/40 dark:bg-red-950/20">
                    <AlertCircle className="mx-auto size-9 text-red-500 mb-3" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Unable to load analytics.
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal">
                        Please check your network connection or try again.
                    </p>
                    <Button
                        type="button"
                        onClick={loadAnalyticsData}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700 transition-colors shadow-xs"
                    >
                        <RotateCw className="size-3.5" /> Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
            {/* 1. Analytics Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                        ANALYTICS & INSIGHTS
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Event Insights & Performance
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                        Track registrations, event performance, capacity, and hosting trends across your hackathons.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Event Filter Dropdown */}
                    <div className="w-44">
                        <HackHiveSelect
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            options={[
                                { value: "ALL", label: `All Events (${events.length})` },
                                { value: "ACTIVE", label: `Active (${metrics.activeCount})` },
                                { value: "UPCOMING", label: `Upcoming (${metrics.upcomingCount})` },
                                { value: "COMPLETED", label: `Completed (${metrics.completedCount})` },
                            ]}
                            size="sm"
                        />
                    </div>

                    {/* Refresh Button */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={loadAnalyticsData}
                        className="rounded-lg border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RefreshCw className="size-3.5 mr-1.5" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Empty State when no events exist */}
            {events.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <BarChart3 className="mx-auto size-9 text-slate-400 mb-3" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        No analytics available yet.
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal max-w-sm mx-auto">
                        Create your first event to start seeing registrations and event performance insights.
                    </p>
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700 transition-colors shadow-xs"
                    >
                        <Plus className="size-4" /> Create Event
                    </Button>
                </div>
            ) : (
                <>
                    {/* 2. Key Metrics Row */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Events Hosted */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Events Hosted
                            </span>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {metrics.totalEvents}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                {metrics.activeCount} active · {metrics.upcomingCount} upcoming
                            </p>
                        </div>

                        {/* 2. Total Registrations */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Registrations
                            </span>
                            <div className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                {metrics.totalRegistrations}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                Total registered students
                            </p>
                        </div>

                        {/* 3. Upcoming Events */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Upcoming Events
                            </span>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {metrics.upcomingCount}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                Scheduled upcoming events
                            </p>
                        </div>

                        {/* 4. Average Registrations / Event */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Average Registrations / Event
                            </span>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {metrics.avgRegistrationsPerEvent}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                Registrations per hosted event
                            </p>
                        </div>
                    </div>

                    {/* 3. Registration Overview Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            Registration Overview
                        </h2>

                        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredEvents.map((evt) => {
                                const regCount = evt.registrationCount || 0;
                                const status = getStatusBadge(evt);

                                return (
                                    <div
                                        key={evt.id}
                                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                                                {evt.title}
                                            </h3>
                                            <Badge variant={status.variant} className="text-[10px] font-semibold shrink-0">
                                                {status.label}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-normal">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Registrations:</span>
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                    {regCount} {regCount === 1 ? "registration" : "registrations"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Team capacity:</span>
                                                <span>{evt.minTeamSize || 1}–{evt.maxTeamSize || 4}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Registration closes:</span>
                                                <span>{formatDate(evt.registrationEndDate)}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Start date:</span>
                                                <span>{formatDate(evt.startDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4 & 5 & 6. Format Distribution + Registration/Capacity Insights Grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Event Format Insights */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Format Distribution
                            </h2>

                            <div className="space-y-4 text-xs font-normal">
                                {/* Online */}
                                <div>
                                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Globe className="size-3.5 text-purple-600" /> Online
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
                                            className="h-full bg-purple-600 rounded-full transition-all"
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
                                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Building2 className="size-3.5 text-slate-600" /> Offline
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
                                            className="h-full bg-slate-600 rounded-full transition-all"
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
                                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Layers className="size-3.5 text-indigo-600" /> Hybrid
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
                                            className="h-full bg-indigo-600 rounded-full transition-all"
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
                        </div>

                        {/* Registration & Capacity Insights */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Registration & Capacity Insights
                            </h2>

                            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-normal">
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                        Top Performing Event
                                    </span>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                        {metrics.topEvent ? metrics.topEvent.title : "None"}
                                    </div>
                                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                                        {metrics.topEvent ? (metrics.topEvent.registrationCount || 0) : 0} registration(s)
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                        Team Capacity Config
                                    </span>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                        Average maximum team size: {metrics.avgMaxTeamSize} members
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7. Operational Insights Section */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            Operational Insights
                        </h2>

                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-normal">
                            <li className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-purple-600 shrink-0" />
                                <span>
                                    You currently have <strong className="text-slate-900 dark:text-slate-100 font-semibold">{metrics.upcomingCount}</strong> upcoming event(s).
                                </span>
                            </li>

                            <li className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-purple-600 shrink-0" />
                                <span>
                                    Your events have received <strong className="text-slate-900 dark:text-slate-100 font-semibold">{metrics.totalRegistrations}</strong> total registration(s).
                                </span>
                            </li>

                            <li className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-purple-600 shrink-0" />
                                <span>
                                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">{metrics.dominantFormatName}</strong> events represent <strong className="text-slate-900 dark:text-slate-100 font-semibold">{metrics.dominantFormatPct}%</strong> of your event portfolio.
                                </span>
                            </li>

                            <li className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-purple-600 shrink-0" />
                                <span>
                                    Average configured maximum team size is <strong className="text-slate-900 dark:text-slate-100 font-semibold">{metrics.avgMaxTeamSize}</strong> members.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* 8. Event Performance Table */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden space-y-0">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Event Performance Breakdown
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                Detailed breakdown of all published hackathons ({filteredEvents.length} displaying).
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
                                        <th className="py-3 px-5">Event</th>
                                        <th className="py-3 px-4">Format</th>
                                        <th className="py-3 px-4">Start Date</th>
                                        <th className="py-3 px-4">Registration Deadline</th>
                                        <th className="py-3 px-4 text-center">Registrations</th>
                                        <th className="py-3 px-4 text-center">Team Capacity</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                        <th className="py-3 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredEvents.map((evt) => {
                                        const status = getStatusBadge(evt);
                                        const regCount = evt.registrationCount || 0;

                                        return (
                                            <tr
                                                key={evt.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                                            >
                                                <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-slate-100">
                                                    {evt.title}
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-normal">
                                                    {evt.eventMode || "Offline"}
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-normal">
                                                    {formatDate(evt.startDate)}
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-normal">
                                                    {formatDate(evt.registrationEndDate)}
                                                </td>

                                                <td className="py-3.5 px-4 text-center font-semibold text-purple-600 dark:text-purple-400">
                                                    {regCount}
                                                </td>

                                                <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400 font-normal">
                                                    {evt.minTeamSize || 1}–{evt.maxTeamSize || 4} members
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    <Badge variant={status.variant} className="text-[10px] font-semibold">
                                                        {status.label}
                                                    </Badge>
                                                </td>

                                                <td className="py-3.5 px-5 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate("/organizer/events")}
                                                        className="rounded-lg border-slate-200 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
